import React from "react";
import { useWeb3Context } from "./web3-context";
import { MegoButton } from "@megotickets/core";

const PrivateKeySection = () => {
  const { privateKey, provider, loggedAs } = useWeb3Context();

  const handleCopyPrivateKey = () => {
    if (privateKey) {
      navigator.clipboard.writeText(privateKey);
      alert("Private key copied to clipboard");
    }
  }

  const comeBackToOrigin = () => {
    //origin
    const origin = window.location.href.split('?')[0];
    window.location.href = origin + "?provider=" + provider + "&loggedAs=" + loggedAs;
  }

  return (
    <div>
      <h5 style={{ marginTop: '2rem' }} className="mego-login-text mego-font-medium">
        Private key: {privateKey}
      </h5>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
        <div className="chooseType-btn-container">
          <MegoButton className="chooseType-btn" onClick={handleCopyPrivateKey}>
            <p className="mego-font-medium font-satoshi">Copy private key</p>
          </MegoButton>
        </div>
        <div className="chooseType-btn-container">
          <MegoButton className="chooseType-btn" onClick={comeBackToOrigin}>
            <p className="mego-font-medium font-satoshi">Close</p>
          </MegoButton>
        </div>
      </div>
    </div>

  );
};

export default PrivateKeySection;