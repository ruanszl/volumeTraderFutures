# **Automated Bot on Binance Futures**

[![license](https://img.shields.io/github/license/ruanszl/volumeTraderFutures?color=red)](./lisense)

### O Bot Automatizado na Binance Futures é um projeto que utiliza a API da Binance e usa uma estratégia para tomar decisões automatizadas de compra e venda.

#

### **Índice**

- <a href="#Estrutura">Estrutura</a>
- <a href="#Visão-Geral-do-Projeto">Visão Geral do Projeto</a>
- <a href="#Como-Usar">Como Usar</a>
- <a href="#Endpoints">Endpoints</a>
- <a href="#Técnica">Técnica</a>
- <a href="#Próximos-Passos">Próximos Passos</a>
- <a href="#Como-Contribuir">Como Contribuir</a>
- <a href="#Autores">Autores</a>

# **Estrutura**

- [Node](https://nodejs.org/en/)
- [Typescript](https://www.typescriptlang.org/)
- [Tsx](https://www.npmjs.com/package/tsx)
- [WS](https://github.com/websockets/ws)
- [@types/ws](https://www.npmjs.com/package/@types/ws)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Axios](https://www.npmjs.com/package/axios)

# **Visão Geral do Projeto**

Este é um script Node.js escrito em TypeScript que utiliza a API do Binance futures para realizar ordens de compra ou venda.

O objetivo deste projeto é fazer a comunicação com a API da Binance e utilizar seus endpoints. Ele é estruturado para que seja possível usar outras estratégias, já que a estratégia utilizada neste projeto ainda está em desenvolvimento e sujeita a mudanças.

O robô utiliza a biblioteca dotenv para carregar as variáveis de ambiente a partir de um arquivo .env, Axios para fazer as requisições HTTPS e WebSockets para obter atualizações em tempo real do livro de ofertas.

O robô monitora o mercado de criptomoedas e determina se há uma tendência de alta ou baixa em um ativo.

São definidas algumas funções, incluindo startExchangeInfo (esta função é um start para a função exchangeInfo que retorna quantidade mínima e a precisão da quantidade para o símbolo da criptomoeda da exchange), changeInitialLeverage (usada para alterar a quantidade de alavancagem inicial para um determinado símbolo).

A função start é a função principal do programa. Ela cria uma nova conexão WebSocket com a API e ouve atualizações nos dados de mercado. Quando recebe uma atualização, ela calcula o volume total de oferta e demanda para o livro de pedidos usando a função calculateTotal (uma função que recebe um array de números e retorna a soma desses números) e chama a função detectMarketTrend para analisar a tendência. Dependendo da tendência, o programa realiza uma negociação usando a função buyInTrend (esta função define a quantidade de moedas que é possível ser comprada chamando a função balanceAccount que retorna o saldo da conta e realizando com base no porcentagem predefinida a compra de um contrato). Se a negociação for bem-sucedida, o programa atualiza o objeto isOpened com os detalhes da ordem e redefine o objeto currentTrend (variável utilizada para determinar a tendência atual).

O programa inclui tratamento de erros para registrar quaisquer erros que ocorram durante a conexão WebSocket ou a colocação de negociações. Quando o programa é encerrado, qualquer ordem aberta é encerrada, já que o programa não poderá mais fazer o monitoramento.


# **Como Usar**

## **Crie chaves de API e chaves secretas**

- [Chaves para Binance](https://www.binance.com/pt-BR/support/faq/como-criar-uma-api-360002502072)

## **Crie um arquivo .env.**
```ini
API_KEY=**********************************
SECRET_KEY=***********************************
```
Substitua os "*" pelas suas chaves.

## **Também configure a URL para acessar os endpoints**

```ini
API_URL=https://fapi.binance.com
STREAM_URL=wss://fstream.binancefuture.com/ws/
```

## **Configurações adicionais**

Faça algumas alterações no arquivo tsconfig.json.

Isso permitirá que o TypeScript reconheça as variáveis de ambiente definidas no arquivo .env.
```json
"typeRoots": [
      "./node_modules/@types",
      "./path/to/dotenv/types"
     ],
```
Alterar o diretório raiz do projeto para ./src.

Alterar o alvo (target) para es2020, que suporta o ES6.
```json
"rootDir": "./src", 
"target": "es2020",
```

Por fim, importe o arquivo .env. no arquivo index.ts

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

Embora a API de Futuros da Binance forneça vários endpoints com informações relevantes, este projeto utiliza apenas alguns desses retornos. Para uma lista completa dos endpoints utilizados e das informações retornadas, bem como informações sobre quaisquer endpoints não utilizados, consulte a documentação oficial da API de Futuros da Binance. Lá, você pode encontrar informações detalhadas sobre cada endpoint, incluindo parâmetros de entrada e exemplos de saída, para ajudá-lo a entender como esses dados são usados neste projeto.


- <a href="https://binance-docs.github.io/apidocs/futures/en/#account-trades-endpoints">API Binance</a>

#

## **Account Balance**

Este código é uma função que faz uma chamada para a API da Binance para obter o saldo de uma determinada moeda em uma conta de futuros. A função espera receber como parametro a variavel "symbol" retorna o saldo da moeda especificada se estiver disponível na conta.

## **Change Initial Leverage**

Esse código é uma função para alterar a alavancagem inicial de uma posição em uma conta na Binance usando sua API. A função espera receber dois argumentos: "symbol" o símbolo do ativo e "leverage" a alavancagem desejada. A função retorna a alavancagem definida na resposta da API da Binance.

## **New Order**

Este código é uma função que envia uma nova ordem de negociação no mercado de futuros da Binance usando sua API. A função recebe três parâmetros: o símbolo do ativo a ser negociado, a quantidade a ser negociada e o lado da negociação (compra ou venda). Se a ordem for executada com sucesso, a função retorna o ID da ordem.

## **Exchange Information**

Esse código é uma função que faz uma requisição para a API da Binance para obter informações sobre um determinado par de moedas. A função recebe como parametro a variavel "symbol" o símbolo do ativo e retorna um objeto com duas chaves: "minQty", que é a quantidade mínima que se pode comprar da moeda, e "quantityPrecision", que retorna o número de casas decimais que deve ser usado para informar a quantidade de moedas a ser comprado.

## **Próximos Passos**

O projeto tem como objetivo aprimorar, desenvolver ou implementar diversas técnicas. Segue abaixo uma lista de técnicas que estão sendo desenvolvidas.

- RSI
- Fibonacci
- Média Móvel

## **Como Contribuir**

Para contribuir com as técnicas, entre em contato via email : ruanszl@gmail.com.

## **Autores**

Ruan Souza de Lima.

