'use client';

import { WagmiProvider, http } from 'wagmi'
import { mainnet, polygon, sepolia, optimism, arbitrum, base, baseSepolia } from 'wagmi/chains'
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { CustomizationProvider } from './CustomizationProvider';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { LanguageProvider, SupportedLanguage } from '../context/LanguageContext';

export const config = getDefaultConfig({
  appName: 'Mego Wallet',
  projectId: "b04bcb017e647637f86b206334c538e6",
  chains: [mainnet, polygon, sepolia, optimism, arbitrum, base, baseSepolia],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [sepolia.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})

export interface Web3ProviderProps {
  children: React.ReactNode;
  forcedLanguage?: SupportedLanguage;
}

export function Web3ClientProvider({ 
  children,
  forcedLanguage
}: Web3ProviderProps) {
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
    <LanguageProvider defaultLanguage="en" forcedLanguage={forcedLanguage}>
      <CustomizationProvider>
        <QueryClientProvider client={queryClient}>
          {/* @ts-ignore */}
          <WagmiProvider config={config}>
            <RainbowKitProvider>
              {/* @ts-ignore */}
              {children}
            </RainbowKitProvider>
          </WagmiProvider>
        </QueryClientProvider>
      </CustomizationProvider>
    </LanguageProvider>
  );
} 