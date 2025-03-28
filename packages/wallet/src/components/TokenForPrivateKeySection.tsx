import { useState } from "react";
import { useWeb3Context } from "./web3-context";

const TokenForPrivateKeySection = () => {
    const [token, setToken] = useState<string>("");
  
    const { revealPrivateKey, provider, loggedAs } = useWeb3Context();
  
    const comeBackToOrigin = () => {
      //origin
      const origin = window.location.href.split('?')[0];
      window.location.href = origin + "?provider=" + provider + "&loggedAs=" + loggedAs;
    }
  
    return (
      <div className="w-full flex flex-col items-center justify-center mt-10">
        <p className="mego-login-text mego-font-medium">Please insert token received by email</p>
        <input
          className="mego-input-token"
          id="token"
          placeholder="Insert token..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button
          disabled={token.length == 0}
  
          className={"mego-modal-button mt-3 " + (token.length == 0 ? "opacity-50" : "")}
          onClick={() => revealPrivateKey(token)}
        >
          <p className="mego-font-medium font-satoshi">Reveal private key</p>
        </button>
        <button className="mego-modal-button outlined" onClick={comeBackToOrigin}>
          <p className="mego-font-medium font-satoshi">Close</p>
        </button>
      </div>
    );
  };

export default TokenForPrivateKeySection;
