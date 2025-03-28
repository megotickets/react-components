import React from "react";
import { ConnectWallet } from "@megotickets/core";
import { useWeb3Context } from "./web3-context";
import "../css/mego-style.css";
import WalletConnectIcon from "./icons/WalletConnect";
import { useCustomization } from "@megotickets/core";

interface WalletConnectStatusProps {
  account?: any;
  chain?: any;
  authenticationStatus: string;
  mounted: boolean;
  openConnectModal: () => void;
  openAccountModal: () => void;
  loginWithWalletConnect: (account: string) => void;
  loggedAs?: string;
}

const WalletConnectStatus: React.FC<WalletConnectStatusProps> = ({
  account,
  chain,
  authenticationStatus,
  mounted,
  openConnectModal,
  openAccountModal,
  loginWithWalletConnect,
  loggedAs,
}) => {
  const { style } = useCustomization();
  if (!mounted || authenticationStatus === "loading") {
    return (
      <button className="mego-modal-button">
        Caricamento...
      </button>
    );
  }
  console.log(account);
  console.log(chain);
  return (
    <div onClick={openConnectModal}>
      {
        style?.customButtonOverrideComponent?.walletConnectButton ?
          style?.customButtonOverrideComponent?.walletConnectButton
          :
          <button className="mego-modal-button" onClick={openConnectModal} style={{ ...style?.modalStyle?.buttonStyle }}>
            <WalletConnectIcon width={17} style={{ marginRight: '0.5rem' }} />
            <p className="mego-font-medium font-satoshi">WALLET CONNECT</p>
          </button>
      }
    </div>
  );
};

export function WalletConnectButton() {
  const { loginWithWalletConnect, loggedAs } = useWeb3Context();

  return (
    <ConnectWallet.Custom>
      {({
        account,
        chain,
        openConnectModal,
        openAccountModal,
        authenticationStatus,
        mounted,
      }) => (
        <WalletConnectStatus
          account={account}
          chain={chain}
          authenticationStatus={authenticationStatus ?? ""}
          mounted={mounted}
          openConnectModal={openConnectModal}
          openAccountModal={openAccountModal}
          loginWithWalletConnect={loginWithWalletConnect}
          loggedAs={loggedAs ?? undefined}
        />
      )}
    </ConnectWallet.Custom>
  );
};

export default WalletConnectButton;