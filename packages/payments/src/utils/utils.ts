import { getLoginDataInfo } from "./LoginUtils";

export const isConnectedWithMego = () => {
    return getLoginDataInfo()?.provider !== "walletConnect"
}

export const getProvider = () => {
    const provider = getLoginDataInfo()?.provider || ""
    return provider
}