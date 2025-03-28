import { useWeb3Context } from "@megotickets/wallet";
import {useAccount} from "@megotickets/core"
import { useEffect, useState } from "react";
import { PaymentPreview } from "./PaymentPreview";
import { signMessageWithPopupApple, signMessageWithPopupGoogle } from "@megotickets/core";

export function MegoPreview() {
  const { loggedAs, provider } = useWeb3Context();
  const { isConnected } = useAccount();
  const [message, setMessage] = useState<string>("");
  const [signature, setSignature] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  // Funzione per formattare il provider
  const formatProvider = (providerString: string | null) => {
    if (!providerString) return "Nessun provider";

    if (providerString.toLowerCase().includes('google')) return 'Google';
    if (providerString.toLowerCase().includes('apple')) return 'Apple';

    return providerString;
  };

  // Funzione per firmare il messaggio
  const handleSign = async () => {
    const origin = window.location.href.split('?')[0];
    setIsSigning(true);

    try {
      let result;
      if (provider?.toLowerCase().includes('google')) {
        result = await signMessageWithPopupGoogle(origin, message);
      } else if (provider?.toLowerCase().includes('apple')) {
        result = await signMessageWithPopupApple(origin, message);
      } else {
        alert("Firma disponibile solo con provider Google o Apple");
        return;
      }

      if (result.error) {
        alert("Errore durante la firma");
      } else {
        setSignature(result.signature);
      }
    } catch (error) {
      console.error("Errore durante la firma:", error);
      alert("Errore durante la firma");
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-lg border border-gray-700">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${loggedAs ? "bg-green-500" : "bg-red-500"}`}></div>
        <p className="text-lg font-medium text-white">
          {loggedAs ? "Connesso" : "Disconnesso"}
        </p>
      </div>

      <div className="bg-gray-800 p-3 rounded-lg">
        <p className="text-sm text-gray-400 mb-1">Provider</p>
        <p className="text-white font-mono truncate">{formatProvider(provider)}</p>
      </div>

      {loggedAs && (provider?.toLowerCase().includes('google') || provider?.toLowerCase().includes('apple')) && (
        <div className="mt-4 bg-gray-800 p-4 rounded-lg">
          <h3 className="text-white font-medium mb-3">Test Firma con Mego (popup version)</h3>

          <div className="mb-3">
            <label className="text-sm text-gray-400 block mb-1">Messaggio da firmare</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:border-blue-500"
              rows={3}
            />
          </div>

          <button
            onClick={handleSign}
            disabled={message.length === 0 || isSigning}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors ${message.length === 0 || isSigning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSigning ? "Firma in corso..." : `Firma con ${formatProvider(provider)}`}
          </button>
          {signature && (
            <div className="mt-4 bg-gray-800 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-3">Firma conseguita</h3>
              <p className="text-white">{signature}</p>
            </div>
          )}
        </div>
      )}

      <PaymentPreview />
      
    </div>
  );
}
