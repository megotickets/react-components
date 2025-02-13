'use client'
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { sepolia, optimism } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { Web3Provider, WalletButton } from "@mego/components";

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
          <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Web3Provider>
              <WalletButton />
            </Web3Provider>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
