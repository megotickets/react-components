'use client'
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { sepolia, optimism } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import MegoWrapper from "@/components/MegoWrapper";

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
            <MegoWrapper/>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
