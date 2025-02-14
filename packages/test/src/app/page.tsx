"use client";

import { Web3Provider, MegoWalletButton, Web3MegoClientProvider } from "@megotickets/wallet";
import "@megotickets/wallet/dist/index.css";
//import "./globals.css";

export default function Home() {
  return (
    <div>
      <h1>@megotickets/wallet</h1>
      <Web3Provider>
        <Web3MegoClientProvider>
          <MegoWalletButton />
        </Web3MegoClientProvider>
      </Web3Provider>
    </div>
  );
}
