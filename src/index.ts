// SPDX-License-Identifier: MIT
// Author: Ruan Souza de Lima
// Created: 2023
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env")});

import WebSocket from "ws";

import { detectMarketTrend } from "./trendIndicators/detectMarketTrend";
import { balanceAccount } from "./accountTradesEndpoint/accountBalance";
import { newOrder } from "./accountTradesEndpoint/newOrder";
import { changeInitialLeverage } from "./accountTradesEndpoint/changeInitialLeverage";
import { exchangeInfo } from "./marketDataEndpoint/exchangeInformation";

interface typeOrder{
    side: string,
    orderId: string,
    executedQty: string,
}
interface typeTrend{
    time: number;
    uptrend: number;
    downtrend: number;
    trend : "Low" | "High" | "" ;
}
let isOpened: typeOrder = {
    side: "",
    orderId: "",
    executedQty: "",
}

const symbol: string = "ethusdt";
const symbolBoxTall: string = "ETHUSDT";
const symbolBalance: string = "USDT";
const levels: string = "20";
const porcentBuy: number = 0.95;
const leverageQuantity: number = 5;
let minQuantity: number;
let qtyPrecision: number;
let currentTrend: typeTrend = {
    uptrend: 0,
    downtrend: 0,
    time: 0,
    trend: "",
}

function calculateTotal(arr: number[]) {
    return arr.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
}

async function startExchangeInfo() {
    const response = await exchangeInfo(symbolBoxTall);
    if(response !== undefined){
       let {minQty,quantityPrecision} = response;
       minQuantity = minQty;
       qtyPrecision = quantityPrecision;
    }else{
        console.log("not found exchange information");
    }
}
startExchangeInfo();

async function buyInTrend(priceMarket: number, side: string) {
    const balanceEntry = await balanceAccount(symbolBalance);
    
    if(balanceEntry !== undefined){   
        const quantityAux = ((balanceEntry*leverageQuantity)/priceMarket)*porcentBuy;
        const roundedQuantity = quantityAux.toFixed(qtyPrecision);
        const quantity: string = roundedQuantity.toString();
        
        if(quantityAux < minQuantity){
            console.log("Insufficient balance, please verify if you have enough balance to buy the minimum quantity");
            process.exit(1);
        }else{
            const response = await newOrder(symbol,quantity,side);
            if(response !== undefined){
                console.log("log de response",response);
                isOpened.orderId = response;
                isOpened.side = side;
                isOpened.executedQty = quantity;
                return true;
            }else{
                return false;
            }
        }
    }else{
        console.log("Insufficient balance, please verify if you have enough balance to buy the minimum quantity");
        process.exit(1);
    }
}
function resetParams(){
    currentTrend.downtrend = 0;
    currentTrend.uptrend = 0;
    currentTrend.time = 0;
    currentTrend.trend = "";
}

changeInitialLeverage(symbolBoxTall,leverageQuantity.toString());

async function start(){
    const orderBook = new WebSocket(process.env.STREAM_URL + symbol + "@depth" + levels + "@500ms");
    
    orderBook.onopen = () => {
        console.log("Open API connection");
    };
    orderBook.onerror = (error) => {
        console.error("API connection error:", error);
    };
    let isProcessing = false; 

    orderBook.onmessage = async (event) => {
        if (isProcessing) return; 
        isProcessing = true; 
        let objOrderBook;
        try {
            objOrderBook = JSON.parse(event.data.toString());
            let volumeBids: number = calculateTotal(objOrderBook.b.map((bid: number[]) => bid[1]));
            let volumeAsks: number = calculateTotal(objOrderBook.a.map((ask: number[]) => ask[1]));

            currentTrend = detectMarketTrend(volumeAsks,volumeBids,currentTrend);

            if(currentTrend.trend === "High"){
                if(isOpened.side === "SELL"){
                    let priceMarket: number = objOrderBook.a[0][0];
                    await newOrder(symbol,isOpened.executedQty,"BUY");
                    await buyInTrend(priceMarket,"BUY");
                    resetParams();
                }else{
                    if(isOpened.side === ""){
                        let priceMarket: number = objOrderBook.a[0][0];
                        await buyInTrend(priceMarket , "BUY");
                        resetParams();
                    }
                    resetParams();
                }
            }else{
                if(currentTrend.trend === "Low"){
                    if(isOpened.side === "BUY"){
                        let priceMarket: number = objOrderBook.a[0][0];
                        await newOrder(symbol,isOpened.executedQty,"SELL");
                        await buyInTrend(priceMarket,"SELL");
                        resetParams();
                    }else{
                        if(isOpened.side === ""){
                            let priceMarket: number = objOrderBook.a[0][0];
                            await buyInTrend(priceMarket , "SELL");
                            resetParams();
                        }
                        resetParams();
                    }
                }
            }
            isProcessing = false;
        } catch (error) {
            console.error("Error processing the API", error);
            isProcessing = false;
        }
    }
    orderBook.onclose = async () => {
        console.log("API connection closed");
        if (isOpened.side !== "") {
            if(isOpened.side === "SELL"){
                await newOrder(symbol,isOpened.executedQty,"SELL");
            }else{
                await newOrder(symbol,isOpened.executedQty,"BUY");
            }
        }
    };
}
start();