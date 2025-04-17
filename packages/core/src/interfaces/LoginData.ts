
export interface LoginData {
    loggedAs: string;
    email: string;
    isConnectWithMego: boolean;
    provider: string;
    session?: string | null;
}