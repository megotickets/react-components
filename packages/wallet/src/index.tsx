'use client';

export { Web3ClientProvider as Web3Provider, config } from './components/Web3ClientProvider';
export { ConnectButton as ConnectWallet } from '@rainbow-me/rainbowkit';
export * from 'wagmi';
export * from 'wagmi/actions';
export { RainbowKitProvider } from '@rainbow-me/rainbowkit';
export { http } from 'viem';
export { mainnet, polygon } from 'viem/chains'; 
export { MegoModal } from './components/MegoModal';
export { WalletButton as MegoWalletButton } from './components/WalletButton';
export { WalletConnectButton } from './components/WalletConnectButton';
export { useWeb3Context, Web3Provider as Web3MegoClientProvider } from './components/web3-context';
export { PaymentModal } from './components/payments/old-component-to-delete/PaymentModal';
export { PaymentStatusModal } from './components/payments/old-component-to-delete/PaymentStatusModal';
export { ClaimTicketButton } from './components/payments/components/ClaimTicketButton';
export { Ticket } from './components/payments/components/Ticket';