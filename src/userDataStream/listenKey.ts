// SPDX-License-Identifier: MIT
// Author: Ruan Souza de Lima
// Created: 2023

import WebSocket from "ws";
import axios from "axios";

const baseUrlEndPoint: string = ' https://fapi.binance.com';

function keepAliveWebSocket() {
  setInterval( async () => {
    try {
      await axios({
        method: "PUT",
        url: `${baseUrlEndPoint}/fapi/v1/listenKey`,
        headers: {"X-MBX-APIKEY": process.env.API_KEY, 'Content-Type': 'application/x-www-form-urlencoded'},
      })
      console.log('ping pong');
    } catch (error) {
      console.log(error);
    }
  }, 59 * 60 * 1000);
}

async function createListenKey() {
  try {
    const result = await axios({
      method: "POST",
      url: `${baseUrlEndPoint}/fapi/v1/listenKey`,
      headers: {"X-MBX-APIKEY": process.env.API_KEY, 'Content-Type': 'application/x-www-form-urlencoded'},
    })
    keepAliveWebSocket();
    let listenKey = result.data.listenKey;
    return listenKey;
  } catch (error) {
    console.log(error);
  }
}

export async function startWebSocket() {
  const listenKey = await createListenKey();
  const userDataStream = new WebSocket (`wss://fstream-auth.binance.com/ws/${listenKey}?listenKey=${listenKey}`);
  userDataStream.onopen = () => {
    console.log('WebSocket connection opened.');
  };
  userDataStream.onerror = (error) => {
    console.error('WebSocket connection error:', error);
  };
  userDataStream.onmessage = (event) => {
    console.log('Message received:', event.data);
  };
  userDataStream.onclose = (event) => {
    console.log('Connection WebSocket close:', event);
  };
}