// SPDX-License-Identifier: MIT
// Author: Ruan Souza de Lima
// Created: 2023

import axios from "axios";
import crypto from "crypto";
import { URLSearchParams } from "url";

type typeData = Record<
    'timestamp' | 'recvWindow' | 'symbol' | 'leverage',
    string
>;

export async function changeInitialLeverage(symbol: string, leverage: string) {
    const apiKey = process.env.API_KEY;
    const secretKey = process.env.SECRET_KEY;
    const apiUrl = process.env.API_URL;

    if(!apiKey || !secretKey){
        throw new Error('keys not found');
    }
    
    const data: typeData = {
        leverage: leverage,
        symbol: symbol,
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
            method: "POST",
            url: `${apiUrl}/fapi/v1/leverage${queryString}`,
            headers: {"X-MBX-APIKEY": apiKey}
        })
        return response.data.leverage;
    } catch (error) {
        console.log(error);
    }
}

