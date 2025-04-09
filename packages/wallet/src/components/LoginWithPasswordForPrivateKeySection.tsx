import React, { useState } from "react";
import { useLanguage } from "@megotickets/core";
const LoginWithPasswordForPrivateKeySection = () => {
    const [password, setPassword] = useState<string>("");
    const { t } = useLanguage();
    return (
      <div>
        <h5 className="mego-login-text mego-font-medium">
          {t("insertPasswordToObtainPrivateKey", "wallet")}
        </h5>
        <input
          className="mego-input"
          id="password"
          placeholder="Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
    );
  };

export default LoginWithPasswordForPrivateKeySection;