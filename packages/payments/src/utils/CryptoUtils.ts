import { ChainPayment } from "../interfaces/PaymentMethod";
//Resolve euro -> ether
import axios from 'axios';

const API_URL = 'https://tickets-api.mego.tools';

export const resolveChainIdByName = (chainName: keyof ChainPayment) => {
    switch (chainName) {
      case "eth":
        return 1;
      case "optimism":
        return 10;
      case "arbitrum":
        return 42161;
      case "polygon":
        return 137;
      case "usdcETH":
        return 1;
      case "usdcPolygon":
        return 137;
      case "usdtEthereum":
        return 1;
      case "daiETH":
        return 1;
    }
  }
  
  export const resolveChainImageByName = (chainName: keyof ChainPayment) => {
    switch (chainName) {
      case "eth":
        return "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628"; // Immagine corretta per Ethereum <button class="citation-flag" data-index="2">
      case "optimism":
        return "https://assets.coingecko.com/coins/images/25244/standard/Optimism.png?1696524385"; // Immagine corretta per Optimism 
      case "arbitrum":
        return "https://assets.coingecko.com/coins/images/16547/standard/arb.jpg?1721358242"; // Immagine corretta per Arbitrum 
      case "polygon":
        return "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1696502458"; // Immagine corretta per Polygon 
      case "usdcETH":
        return "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1696502844"; // Immagine corretta per USDC su Ethereum 
      case "usdcPolygon":
        return "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1696502844"; // USDC è lo stesso su Polygon 
      case "usdtEthereum":
        return "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1696503217"; // Immagine corretta per USDT su Ethereum 
      case "daiETH":
        return "https://assets.coingecko.com/coins/images/9956/large/4943.png?1696503521"; // Immagine corretta per DAI su Ethereum 
    }
}



export const convertEurToEth = async (amountEur: number) => {
  const response = await axios.post(
    API_URL + "/payments",
    {
      processor: "ethereum",
      amount: amountEur,
      identifier: "event",
      address: "0x123",
      discount_code: "",
      currency: "eur",
      email: "example@example.com",
      donation_amount: 0,
    }
  );
  console.log(response.data);
  return response.data.amount;
}

export const convertEurToArbitrum = async (amountEur: number) => {
  return convertEurToEth(amountEur);
}

export const convertEurToOptimism = async (amountEur: number) => {
  return convertEurToEth(amountEur);
}

export const convertEurToPolygon = async (amountEur: number) => {
  const response = await axios.post(
    API_URL + "/payments",
    {
      processor: "polygon",
      amount: amountEur,
      identifier: "eur_to_poly",
      address: "0x123",
      discount_code: "",
      currency: "eur",
      email: "example@example.com",
      donation_amount: 0,
    }
  );
  return response.data.amount;
}

export const convertEurToUsdc = async (amountEur: number) => {
  const response = await axios.post(
    API_URL + "/payments",
    {
      processor: "usdc",
      amount: amountEur,
      identifier: "eur_to_usdc",
      address: "0x123",
      discount_code: "",
      currency: "eur",
      email: "example@example.com",
      donation_amount: 0,
    }
  );
  return response.data.amount;
}

export const convertEurToUsdt = async (amountEur: number) => {
  const response = await axios.post(
    API_URL + "/payments",
    {
      processor: "usdt",
      amount: amountEur,
      identifier: "eur_to_usdt",
      address: "0x123",
      discount_code: "",
      currency: "eur",
      email: "example@example.com",
      donation_amount: 0,
    }
  );
  return response.data.amount;
}

export const convertEurToDai = async (amountEur: number) => {
  const response = await axios.post(
    API_URL + "/payments",
    {
      processor: "dai",
      amount: amountEur,
      identifier: "eur_to_dai",
      address: "0x123",
      discount_code: "",
      currency: "eur",
      email: "example@example.com",
      donation_amount: 0,
    }
  );
  return response.data.amount;
}

export const resolveAmountbyChain = async (chainName: keyof ChainPayment, amountEur: number) => {
  switch (chainName) {
    case "eth":
      return convertEurToEth(amountEur);
    case "optimism":
      return convertEurToOptimism(amountEur);
    case "arbitrum":
      return convertEurToArbitrum(amountEur);
    case "polygon":
      return convertEurToPolygon(amountEur);
    case "usdcETH":
      return convertEurToUsdc(amountEur);
    case "usdcPolygon":
      return convertEurToUsdc(amountEur);
    case "usdtEthereum":
      return convertEurToUsdt(amountEur);
    case "daiETH":
      return convertEurToDai(amountEur);
  }
}







  

  
  