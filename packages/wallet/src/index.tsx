'use client';

export { Web3ClientProvider as Web3Provider } from './components/Web3ClientProvider';
export { ConnectButton as ConnectWallet } from '@rainbow-me/rainbowkit';
export { WagmiProvider, createConfig } from 'wagmi';
export { RainbowKitProvider } from '@rainbow-me/rainbowkit';
export { http } from 'viem';
export { mainnet, polygon } from 'viem/chains'; 
export { MegoModal } from './components/MegoModal';
export { WalletButton as MegoWalletButton } from './components/WalletButton';
export { WalletConnectButton } from './components/WalletConnectButton';
export { useWeb3Context, Web3Provider as Web3MegoClientProvider } from './components/web3-context';