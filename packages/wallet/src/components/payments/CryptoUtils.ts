import { ChainPayment } from "interfaces/PaymentMethod";
//Resolve euro -> ether
import axios from 'axios';

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
  const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur');
  const ethPrice = response.data.ethereum.eur;
  return amountEur / ethPrice;
}

export const convertEurToArbitrum = async (amountEur: number) => {
  const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=arbitrum&vs_currencies=eur');
  const arbPrice = response.data.arbitrum.eur;
  return amountEur / arbPrice;
}

export const convertEurToOptimism = async (amountEur: number) => {
  const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=optimism&vs_currencies=eur');
  const optPrice = response.data.optimism.eur;
  return amountEur / optPrice;
}

export const convertEurToPolygon = async (amountEur: number) => {
  const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=polygon&vs_currencies=eur');
  const polyPrice = response.data.polygon.eur;
  return amountEur / polyPrice;
}

export const convertEurToUsdc = async (amountEur: number) => {
  const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=usdc&vs_currencies=eur');
  const usdcPrice = response.data.usdc.eur;
  return amountEur / usdcPrice;
}

export const convertEurToUsdt = async (amountEur: number) => {
  const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=usdt&vs_currencies=eur');
  const usdtPrice = response.data.usdt.eur;
  return amountEur / usdtPrice;
}

export const convertEurToDai = async (amountEur: number) => {
  const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=dai&vs_currencies=eur');
  const daiPrice = response.data.dai.eur;
  return amountEur / daiPrice;
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







  

  
  