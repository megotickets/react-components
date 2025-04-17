// Questo componente si occupa di gestire le relazioni con il localStorage
import { LoginData } from "../interfaces/LoginData";

// --- Login Data System Exports ---
const saveLoginData = (loginData: LoginData) => {
    localStorage.setItem("mego_login_data", JSON.stringify(loginData));
}

const getLoginData = (): LoginData | null => {
    const loginData = localStorage.getItem("mego_login_data");
    return loginData ? JSON.parse(loginData) : null;
}

const removeLoginData = () => {
    localStorage.removeItem("mego_login_data");
}
// --- End of Login Data System Exports ---


export { saveLoginData, getLoginData, removeLoginData };
