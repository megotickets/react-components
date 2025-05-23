export { Web3ClientProvider as Web3Provider, config } from './components/Web3ClientProvider';
export {useCustomization} from './components/CustomizationProvider';
export { ConnectButton as ConnectWallet } from '@rainbow-me/rainbowkit';
export * from 'wagmi';
export * from 'wagmi/actions';
export { ethers } from 'ethers';
export { RainbowKitProvider } from '@rainbow-me/rainbowkit';
export { http, createWalletClient, custom } from 'viem';
export { optimism, optimismSepolia, mainnet, arbitrum, goerli, polygon } from 'viem/chains'; 
export { Loader } from '@/components/Loader';
export { signMessageWithApple, signMessageWithGoogle, signMessageWithPopupApple, signMessageWithPopupGoogle, signWithMego } from './components/SignMessage';
export { MegoPopup } from './components/MegoPopup';
export type { MegoPopupData } from './interfaces/MegoPopupData';
export { MegoButton } from './components/MegoButton';

// --- Language System Exports ---
export { useLanguage } from './hooks/useLanguage';
export { LanguageSelector } from './components/LanguageSelector';
export type { SupportedLanguage } from './context/LanguageContext';

// --- Login Data System Exports ---
export * from './utils/MegoLocalStorageBox';
export type { LoginData } from './interfaces/LoginData';

// --- Mego Session System Exports ---
export { getDeviceId, checkSessions } from './utils/MegoSession';
export type { CheckSessionsResult } from './utils/MegoSession';
