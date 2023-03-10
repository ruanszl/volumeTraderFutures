// SPDX-License-Identifier: MIT
// Author: Ruan Souza de Lima
// Created: 2023

import axios from "axios";

export async function exchangeInfo(symbol: string) {
    const apiUrl = process.env.API_URL;

    try {
        const response = await axios({
            method: "GET",
            url: `${apiUrl}/fapi/v1/exchangeInfo`,
        })
        const symbolInfo = response.data.symbols.find((s: any) => s.symbol === symbol);
        const quantityPrecision = symbolInfo.quantityPrecision;
        const lotSizeFilter = symbolInfo.filters.find((f: any) => f.filterType === "LOT_SIZE");
        const minQty = parseFloat(lotSizeFilter.minQty);
        return {minQty,quantityPrecision};  
        
    } catch (error) {
        console.log(error);
    }
}

