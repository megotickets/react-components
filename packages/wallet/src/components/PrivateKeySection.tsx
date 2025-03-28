import React from "react";
import { useWeb3Context } from "./web3-context";

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
        <button className="mego-modal-button outlined" onClick={handleCopyPrivateKey}>
          <p className="mego-font-medium font-satoshi">Copy private key</p>
        </button>
        <button className="mego-modal-button outlined" onClick={comeBackToOrigin}>
          <p className="mego-font-medium font-satoshi">Close</p>
        </button>
      </div>
    );
  };

export default PrivateKeySection;