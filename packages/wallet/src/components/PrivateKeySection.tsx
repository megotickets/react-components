import React, { useEffect, useState } from "react";
import { useWeb3Context } from "./web3-context";
import { MegoButton, useLanguage } from "@megotickets/core";

const PrivateKeySection = () => {
  const { privateKey, provider, loggedAs } = useWeb3Context();
  const [timer, setTimer] = useState(5);
  const { t } = useLanguage();
  const handleCopyPrivateKey = () => {
    if (privateKey) {
      navigator.clipboard.writeText(privateKey);
      alert(t("privateKeyCopied", "wallet"));
    }
    comeBackToOrigin();
  }

  const comeBackToOrigin = () => {
    //origin
    const origin = window.location.href.split('?')[0];
    window.location.href = origin + "?provider=" + provider + "&loggedAs=" + loggedAs;
  }

  //After 5s come back to origin
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => prevTimer - 1);
    }, 1000);

    if (timer === 0) {
      comeBackToOrigin();
    }

    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div>
      <h5 style={{ marginTop: '2rem' }} className="mego-login-text mego-font-medium">
        Private key: {privateKey}
      </h5>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
        <div className="chooseType-btn-container">
          <MegoButton className="chooseType-btn" onClick={handleCopyPrivateKey}>
            <p className="mego-font-medium font-satoshi">{t("copyPrivateKey", "wallet")}</p>
          </MegoButton>
        </div>
        <div className="chooseType-btn-container">
          <MegoButton className="chooseType-btn" onClick={comeBackToOrigin}>
              <p className="mego-font-medium font-satoshi">{`${t("close", "wallet")} (${Math.max(timer, 0)}s)`}</p>
          </MegoButton>
        </div>
      </div>
    </div>

  );
};

export default PrivateKeySection;