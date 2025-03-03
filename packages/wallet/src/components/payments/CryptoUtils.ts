import { ChainPayment } from "interfaces/PaymentMethod";


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
        return "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1747032588";
      case "optimism":
        return "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1747032588";
      case "arbitrum":
        return "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1747032588";
      case "polygon":
        return "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1747032588";
      case "usdcETH":
        return "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1747032588";
      case "usdcPolygon":
        return "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1747032588";
      case "usdtEthereum":
        return "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1747032588";
      case "daiETH":
        return "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1747032588";
    }
  }
  