import { useState } from "react";
import { useWeb3Context } from "./web3-context";
import { MegoButton, useLanguage } from "@megotickets/core";

const TokenForPrivateKeySection = () => {
    const [token, setToken] = useState<string>("");
  
    const { revealPrivateKey, provider, loggedAs } = useWeb3Context();
  
    const comeBackToOrigin = () => {
      //origin
      const origin = window.location.href.split('?')[0];
      window.location.href = origin + "?provider=" + provider + "&loggedAs=" + loggedAs;
    }
    const { t } = useLanguage();
    return (
      <div className="w-full flex flex-col gap-3 items-center justify-center mt-10">
        <p className="mego-login-text mego-font-medium">{t("insertTokenFromEmail", "wallet")}</p>
        <input
          className="mego-input-token font-satoshi"
          id="token"
          placeholder={t("insertToken", "wallet")}
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <MegoButton
          disabled={token.length == 0}
          className={"chooseType-btn mt-3 " + (token.length == 0 ? "disabled" : "")}
          onClick={() => revealPrivateKey(token)}
        >
          <p className="mego-font-medium font-satoshi">{t("revealPrivateKey", "wallet")}</p>
        </MegoButton>
        <MegoButton className="chooseType-btn" onClick={comeBackToOrigin}>
          <p className="mego-font-medium font-satoshi">{t("closeButton", "wallet")}</p>
        </MegoButton>
      </div>
    );
  };

export default TokenForPrivateKeySection;
