'use client'
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { sepolia, optimism } from 'wagmi/chains';
import { QueryClientProvider, QueryClient, } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import WalletButton from "../components/wallet/WalletButton";
import { Web3Provider } from "../components/wallet/web3-context";


const config = getDefaultConfig({
  appName: '<Your custom project>',
  projectId: process?.env?.REACT_APP_WALLET_CONNECT_ID || '<id>',
  chains: [sepolia, optimism],
  ssr: false,
});

const queryClient = new QueryClient();
export default function Home() {


  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Web3Provider>
            <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
              <WalletButton />
            </div>
          </Web3Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
