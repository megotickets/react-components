"use client";

import { ConnectWallet, Web3Provider, WalletButton, Web3MegoClientProvider } from "@megotickets/wallet";
import "@megotickets/wallet/dist/index.css";
//import "./globals.css";

export default function Home() {
  return (
    <div>
      <h1>@megotickets/wallet</h1>
      <Web3Provider>
        <Web3MegoClientProvider>
          <WalletButton />
        </Web3MegoClientProvider>
      </Web3Provider>
    </div>
  );
}
