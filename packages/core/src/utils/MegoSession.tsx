import { v4 as uuidv4 } from 'uuid';


const getDeviceId = async (): Promise<string> => {
    const deviceId = uuidv4();
    return deviceId;
};

// Interfaccia aggiornata per rappresentare sia successo che errore
interface CheckSessionsResult {
    details: any | null;
    error: boolean;
    message?: string; // Messaggio opzionale, più probabile in caso di errore
}

// Funzione aggiornata per restituire sempre CheckSessionsResult
const checkSessions = async (sessionToken: string): Promise<CheckSessionsResult> => {
    const url = `https://wallet.mego.tools/sessions/check`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ session: sessionToken }),
        });

        // Prova a leggere sempre il corpo JSON, sia per successo che per errore
        const data = await response.json();

        if (!response.ok) {
            const message = `Error checking session (HTTP Status): ${response.status} ${response.statusText}`
            return { message, error: true, details: null }; 
        }

        if (data.error === true) {
            const message = `Session check returned HTTP OK, but logical error reported by API: ${data.message}`
            return { message, error: true, details: null }; 
        }

        // Successo sia HTTP che logico
        return {
            message: "ok",
            error: false,
            details: data
        }

    } catch (error) {
        console.error("Network or JSON parsing error during session check:", error);
        // In caso di errore di rete o parsing JSON fallito, restituisci un errore generico
        return {
            error: true,
            message: error instanceof Error ? error.message : "Unknown network error",
            details: null
        };
    }
};

export { getDeviceId, checkSessions }; 
export type { CheckSessionsResult };
