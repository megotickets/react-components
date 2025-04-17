import { getLoginDataInfo } from "./LoginUtils";

export const isConnectedWithMego = () => {
    return getLoginDataInfo()?.isConnectWithMego || false
}

export const getProvider = () => {
    const provider = getLoginDataInfo()?.provider || ""
    return provider
}