// SPDX-License-Identifier: MIT
// Author: Ruan Souza de Lima
// Created: 2023

import axios from "axios";
import crypto from "crypto";
import { URLSearchParams } from "url";

type typeData = Record<
    'timestamp' | 'recvWindow',
    string
>;

export async function balanceAccount(symbolBalance: string) {
    const apiKey = process.env.API_KEY;
    const secretKey = process.env.SECRET_KEY;
    const apiUrl = process.env.API_URL;

    if(!apiKey || !secretKey){
        throw new Error('keys not found');
    }
    
    const data: typeData = {
        timestamp: Date.now().toString(),
        recvWindow: "5000",
    }

    const signature = crypto
        .createHmac("sha256", secretKey)
        .update(`${new URLSearchParams(data)}`)
        .digest("hex")

    const queryString = `?${new URLSearchParams({ ...data, signature })}`;

    try {
        const response = await axios({
            method: "GET",
            url: `${apiUrl}/fapi/v2/balance${queryString}`,
            headers: {"X-MBX-APIKEY": apiKey}
        })
        const balanceEntry = response.data.find((entry: any)=> entry.asset === symbolBalance);
        if(balanceEntry){
            const balance: number = parseFloat(balanceEntry.balance);
            return balance;
        }else{
            console.log("symbol not found");
        }
    } catch (error) {
        console.log(error);
    }
}

