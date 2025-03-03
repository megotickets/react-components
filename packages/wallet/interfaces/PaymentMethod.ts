

export interface PaymentMethod {
    type: "stripe" | "rainbowkit" | "erc20" | keyof ChainPayment
}

export interface ChainPayment {
    eth?: boolean;
    optimism?: boolean;
    arbitrum?: boolean;
    polygon?: boolean;
    usdcETH?: boolean;
    usdcPolygon?: boolean;
    usdtEthereum?: boolean;
    daiETH?: boolean;
}



export interface PaymentModalityProps {
    stripe?: boolean;
    erc20?: boolean;
    chains?: ChainPayment;
}