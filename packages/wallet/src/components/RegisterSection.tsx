import React, { useState } from "react";
import { useWeb3Context } from "./web3-context";
import EyeIcon from "./icons/EyeIcon";
import { MegoButton } from "@megotickets/core";



const EyeOffIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 23 12C21.27 7.61 17 4.5 12 4.5C10.6 4.5 9.26 4.75 8 5.2L10.17 7.37C10.74 7.14 11.35 7 12 7Z" fill="#666666" />
        <path d="M2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.8 19.08L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8ZM11.84 9.02L14.99 12.17L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z" fill="#666666" />
    </svg>
);

const RegisterSection = () => {
    const { createNewWallet } = useWeb3Context();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
  
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      createNewWallet(email, password);
    };
  
    return (
  
      <>
        <h5 className="mego-login-text mego-font-medium" style={{ marginTop: '10px' }}>
          Type your e-mail address and Password to register
        </h5>
  
        <form
          onSubmit={handleLogin}
          className="mego-form"
        >
  
          <input
            className="mego-input"
            id="email"
            placeholder="E-mail address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            required
            title="Insert a valid email"
          />
  
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              className="mego-input"
              id="password"
              placeholder="Password..."
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              
            />
            <span 
              onClick={() => setShowPassword(!showPassword)} 
              style={{
                position: 'absolute',
                right: '10px',
                top: '40%',
                transform: 'translateY(-50%)',
                cursor: 'pointer'
              }}
            >
              {showPassword ? <EyeIcon /> : <EyeOffIcon />}
            </span>
          </div>
          <p
            className="mego-login-text font-satoshi"
            style={{ marginTop: 10, marginBottom: 10, fontSize: 11 }}
          >
            Password must contain at least 8 characters, including one uppercase
            letter, one lowercase letter, and one number
          </p>
  
          <MegoButton
            className="chooseType-btn"
            type="submit"
            style={{ maxWidth: 200 }}
          >
            <p className="mego-font-medium font-satoshi">REGISTER</p>
          </MegoButton>
        </form>
      </>
    );
  };

export default RegisterSection;