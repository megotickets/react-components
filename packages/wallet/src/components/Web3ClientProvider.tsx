'use client';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { mainnet, polygon } from 'viem/chains';
import { http } from 'viem';
import {
  createConfig,
  WagmiProvider,
} from 'wagmi';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { CustomizationProvider } from './CustomizationProvider';

const config = createConfig({
  chains: [mainnet, polygon],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
  },
});

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