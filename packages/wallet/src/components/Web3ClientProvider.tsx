'use client';

import { WagmiProvider, http } from 'wagmi'
import { mainnet, polygon } from 'wagmi/chains'
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { CustomizationProvider } from './CustomizationProvider';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'


export const config = getDefaultConfig({
  appName: 'Mego Wallet',
  projectId: "b04bcb017e647637f86b206334c538e6",
  chains: [mainnet, polygon],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
  },
})

export interface Web3ProviderProps {
  children: React.ReactNode;
}

export function Web3ClientProvider({ children }: Web3ProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 0,
            staleTime: 30000,
          },
        },
      })
  );

  return (
    <CustomizationProvider>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <RainbowKitProvider>
            {children}
          </RainbowKitProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </CustomizationProvider>
  );
} 