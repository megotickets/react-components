import React from "react";
import { useWeb3Context } from "./web3-context";

const WalletConnectButton: React.FC = () => {
  const { loginWithWalletConnect, loggedAs, rainbowKitConnect } = useWeb3Context();

  const handleClick = () => {
    if (rainbowKitConnect) {
      rainbowKitConnect();
    } else {
      loginWithWalletConnect();
    }
  };

  return (
    <button className="mego-modal-button" onClick={handleClick}>
      <img 
        width={17} 
        src="/walletconnect.svg" 
        alt="WalletConnect" 
        className="mr-2 mt-1" 
      />
      {loggedAs ? loggedAs.slice(0, 6) + '...' : 'WALLET CONNECT'}
    </button>
  );
};

export default WalletConnectButton;