import { v4 as uuidv4 } from 'uuid';
interface DeviceIdResult {
    deviceId: string | null;
    message: string | null;
    error: boolean;
}

const getDeviceId = async (): Promise<DeviceIdResult> => {
    //TODO: Da chiedere a turinglabs se potrebbe essere un problema.
    /*
        PUNTO 1. Un utente potrebbe dire, come mai io devo accettare l'accesso al microfono o alla camera?
        PUNTO 2. Se l'utente non ha nessun dispositivo audio o video, come facciamo a generare un deviceId?
        PUNTO 3. Se l'utente non ci da i consensi che si fa? Il rischio è perdere la multi-login (ho sperimentato con deviceId non concessi)
        PUNTO 4. Se usassiamo un uuid potremmo risolvere la multisession ma cosi non siamo legati dal deviceId, il flusso sarebbe immediato, senza interruzioni ma tra una tab e un'altra avremo id diversi
        TEMPORANEAMENTE ho messo un fallbackDeviceId che è un uuid, ma non è ideale, da discutere con turinglabs
    */
    const fallbackDeviceId = uuidv4();

    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.error("MediaDevices API not supported.");
        return {
            deviceId: fallbackDeviceId,
            message: "MediaDevices API not supported.",
            error: false
        };
    }

    try {
        //Necessario per ottenere un deviceId stabile (SI DEVE DISCUTERE CON TURINGLABS)
        let stream: MediaStream | null = null;
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (audioError) {
            console.warn("Audio permission denied or no audio device, trying video...");
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
            } catch (videoError) {
                console.error("Audio and video permissions denied or no devices.");
            }
        }
        
        stream?.getTracks().forEach(track => track.stop());
        const devices = await navigator.mediaDevices.enumerateDevices();
        const firstValidDeviceId = devices.find(device => device.deviceId !== '' && device.deviceId !== null && device.deviceId !== "default")?.deviceId;

        if (firstValidDeviceId) {
            return {
                deviceId: firstValidDeviceId,
                message: null,
                error: false
            };
        } else {
            console.warn("No valid deviceId found after enumerating devices.");
            return {
                deviceId: fallbackDeviceId,
                message: "No valid deviceId found after enumerating devices.",
                error: true
            };
        }

    } catch (error) {
        console.error("Error getting device ID:", error);
        return {
            deviceId: fallbackDeviceId,
            message: "Error getting device ID.",
            error: true
        };
    }
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
export type { DeviceIdResult, CheckSessionsResult };
