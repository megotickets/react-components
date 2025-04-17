import { getLoginData, LoginData } from "@megotickets/core";

export const getLoginDataInfo = () => {
    const loginData: LoginData | null = getLoginData();
    return loginData;
}