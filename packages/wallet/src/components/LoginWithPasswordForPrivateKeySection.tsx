import React, { useState } from "react";

const LoginWithPasswordForPrivateKeySection = () => {
    const [password, setPassword] = useState<string>("");
  
    return (
      <div>
        <h5 className="mego-login-text mego-font-medium">
          Insert password to obtain private key
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