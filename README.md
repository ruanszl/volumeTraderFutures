# **Automated Bot on Binance Futures**

[![license](https://img.shields.io/github/license/ruanszl/volumeTraderFutures?color=red)](./lisense)

### The Automated Bot on Binance Futures is a project that utilizes Binance's API and employs a strategy to make automated buying and selling decisions.

#

### **Index**

- <a href="#Structure">Structure</a>
- <a href="#Project-Overview">Project Overview</a>
- <a href="#How-to-Use">How to Use</a>
- <a href="#Endpoints">Endpoints</a>
- <a href="#Technique">Technique</a>
- <a href="#Next-Steps">Next Steps</a>
- <a href="#How-to-Contribute">How to Contribute</a>
- <a href="#Authors">Authors</a>

# **Structure**

- [Node](https://nodejs.org/en/)
- [Typescript](https://www.typescriptlang.org/)
- [Tsx](https://www.npmjs.com/package/tsx)
- [WS](https://github.com/websockets/ws)
- [@types/ws](https://www.npmjs.com/package/@types/ws)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Axios](https://www.npmjs.com/package/axios)

# **Project Overview**

This is a Node.js script written in TypeScript that utilizes the Binance futures API to place buy or sell orders.

The goal of this project is to communicate with the Binance API and utilize its endpoints. It is structured so that other strategies can be used, since the strategy used in this project is still in development and subject to change.

The bot uses the dotenv library to load environment variables from a .env file, Axios to make HTTPS requests, and WebSockets to receive real-time updates from the order book.

The bot monitors the cryptocurrency market and determines if there is a bullish or bearish trend in an asset.

Several functions are defined, including startExchangeInfo (this function is a start for the exchangeInfo function that returns the minimum quantity and quantity precision for the exchange cryptocurrency symbol), and changeInitialLeverage (used to change the initial leverage amount for a given symbol).

The start function is the main function of the program. It creates a new WebSocket connection to the API and listens for updates on market data. When it receives an update, it calculates the total volume of bids and asks for the order book using the calculateTotal function (a function that takes an array of numbers and returns the sum of those numbers) and calls the detectMarketTrend function to analyze the trend. Depending on the trend, the program places a trade using the buyInTrend function (this function defines the amount of coins that can be bought by calling the balanceAccount function that returns the account balance and performs the purchase based on the predefined percentage). If the trade is successful, the program updates the isOpened object with the order details and resets the currentTrend object (variable used to determine the current trend).

The program includes error handling to log any errors that occur during the WebSocket connection or trade placement. When the program is terminated, any open orders are closed since the program will no longer be monitoring the market.


# **How to Use**

## **Create API keys and secret keys**

- [Keys for Binance](https://www.binance.com/pt-BR/support/faq/como-criar-uma-api-360002502072)

## **Create a .env file**
```ini
API_KEY=**********************************
SECRET_KEY=***********************************
```
Replace the * with your keys.

## **Also, configure the URL to access the endpoints**

```ini
API_URL=https://fapi.binance.com
STREAM_URL=wss://fstream.binancefuture.com/ws/
```

## **Additional configurations**

Make some changes to the tsconfig.json file.

This will allow TypeScript to recognize the environment variables defined in the .env file.

```json
"typeRoots": [
      "./node_modules/@types",
      "./path/to/dotenv/types"
     ],
```
Change the project's root directory to ./src.

Change the target to es2020, which supports ES6.

```json
"rootDir": "./src", 
"target": "es2020",
```

Finally, import the .env file in the index.ts file.

```typescript
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env")});
```

# **Endpoints**

### **Account Trades Endpoint**

- <a href="#Account-Balance">Account Balance</a>
- <a href="#Change-Initial-Leverage">Change Initial Leverage</a>
- <a href="#New-Order">New Order</a>

### **Market Data Endpoint**

- <a href="#exchange-info">Exchange Info</a>

#

Although the Binance Futures API provides several endpoints with relevant information, this project only uses a few of these returns. For a complete list of the endpoints used and the information returned, as well as information about any unused endpoints, please refer to the official Binance Futures API documentation. There, you can find detailed information on each endpoint, including input parameters and output examples, to help you understand how this data is used in this project.

- <a href="https://binance-docs.github.io/apidocs/futures/en/#account-trades-endpoints">API Binance</a>

#

## **Account Balance**

This code is a function that makes a call to the Binance API to retrieve the balance of a specific coin in a futures account. The function expects to receive the "symbol" variable as a parameter and returns the balance of the specified coin if it's available in the account.

## **Change Initial Leverage**

This code is a function to change the initial leverage of a position in a Binance account using its API. The function expects two arguments: "symbol" the asset symbol and "leverage" the desired leverage. The function returns the leverage set in the Binance API response.

## **New Order**

This code is a function that sends a new trading order in the Binance futures market using its API. The function receives three parameters: the symbol of the asset to be traded, the quantity to be traded, and the side of the trade (buy or sell). If the order is successfully executed, the function returns the order ID.

## **Exchange Information**

This code is a function that makes a request to Binance API to get information about a specific currency pair. The function receives "symbol" variable as a parameter, which is the symbol of the asset, and returns an object with two keys: "minQty", which is the minimum amount that can be purchased of the currency, and "quantityPrecision", which returns the number of decimal places that should be used to inform the amount of coins to be bought.

## **Next Steps**

The project aims to improve, develop, or implement various techniques. Below is a list of techniques that are being developed:

- RSI
- Fibonacci
- Moving Average

## **How to Contribute**

PTo contribute with the techniques, please contact us via email: ruanszl@gmail.com.

## **Authors**

Ruan Souza de Lima.
