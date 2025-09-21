
export interface LoginData {
    loggedAs: string;
    email: string;
    provider: string;
    session?: string | null;
}