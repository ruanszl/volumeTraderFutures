// SPDX-License-Identifier: MIT
// Author: Ruan Souza de Lima
// Created: 2023

import axios from "axios";
import crypto from "crypto";
import { URLSearchParams } from "url";

type orderData = Record<
    'symbol' | 'side' | 'type' | 'quantity' | 'recvWindow' | 'timestamp',
    string
>;

export async function newOrder(symbol: string, quantity: string, side: string) {
    const apiKey = process.env.API_KEY;
    const secretKey = process.env.SECRET_KEY;
    const apiUrl = process.env.API_URL;

    if(!apiKey || !secretKey){
        throw new Error('keys not found');
    }

    const data: orderData = {
        symbol,
        side,
        type: "MARKET",
        quantity,
        recvWindow: "5000",
        timestamp: Date.now().toString(),
    };

    const signature = crypto
        .createHmac("sha256", secretKey!)
        .update(`${new URLSearchParams(data)}`)
        .digest('hex')

    const queryString = `?${new URLSearchParams({ ...data, signature })}`
    
    try {
        const response = await axios({
            method: "POST",
            url: `${apiUrl}/fapi/v1/order${queryString}`,
            headers: { "X-MBX-APIKEY": apiKey},
        })
        if(response !== undefined){
            return response.data.orderId;
        }else{
            console.log("purchase not made");
        }
    } catch(error) {
            console.error(error);
        }    
}