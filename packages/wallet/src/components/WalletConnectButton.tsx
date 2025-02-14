import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useWeb3Context } from "./web3-context";
import "./mego-style.css";
import WalletConnectIcon from "./icons/WalletConnect";

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
  if (!mounted || authenticationStatus === "loading") {
    return (
      <button className="mego-modal-button">
        Caricamento...
      </button>
    );
  }
  if (!account || !chain) {
    return (
      <button className="mego-modal-button" onClick={openConnectModal}>
        <WalletConnectIcon width={17} style={{ marginRight: '0.5rem' }} />
        WALLET CONNECT
      </button>
    );
  }
  if (!loggedAs) {
    return (
      <button className="mego-modal-button" onClick={() => loginWithWalletConnect(account.address)}>
        <WalletConnectIcon width={17} style={{ marginRight: '0.5rem'}} />
        WALLET CONNECT
      </button>
    );
  }
  return (
    <button className="mego-modal-button" onClick={openAccountModal}>
      <WalletConnectIcon width={17} style={{ marginRight: '0.5rem' }} />
      {account.displayName}
    </button>
  );
};

export function WalletConnectButton() {
  const { loginWithWalletConnect, loggedAs } = useWeb3Context();

  return (
    <ConnectButton.Custom>
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
    </ConnectButton.Custom>
  );
};

export default WalletConnectButton;