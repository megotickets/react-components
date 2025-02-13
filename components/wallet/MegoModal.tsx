import React, { useEffect, useState } from "react";
import { Route, useWeb3Context } from "./web3-context";
import WalletConnectButton from "./WalletConnectButton"

interface MegoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MegoModal: React.FC<MegoModalProps> = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const {
    isLoading,
    loggedAs,
    logout,
    loadingText,
    section,
    setSection,
    prevSection,
    setPrevSection,
  } = useWeb3Context(); // Aggiungi il contesto per il loading
 
  useEffect(() => {
    if (isOpen) {
      if (loggedAs) {
        setSection("Logged");
      } else {
        setNewSection("ChooseType");
      }
      setIsClosing(false);
    }
  }, [isOpen, loggedAs]);
  useEffect(() => {
    if (loggedAs && isOpen) {
      setTimeout(() => {
        setSection("Logged");
      }, 100);
    }
  }, [loggedAs, isOpen]);


  function setNewSection(route: Route) {
    setSection(route);
    if (route === "ChooseType") setPrevSection(undefined);
    if (route === "Email") setPrevSection("ChooseType");
    if (route === "Login") setPrevSection("Email");
    if (route === "Register") setPrevSection("Email");
    if (route === "Logged") setPrevSection(undefined);
    if (route === "ExportPrivateKey") setPrevSection("Logged");
    if (route === "TokenForPrivateKey") setPrevSection("ExportPrivateKey");
    if (route === "LoginWithPasswordForPrivateKey") setPrevSection("Logged");
  }

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // Match this with the animation duration
  }

  function returnCurrentSection() {
    switch (section) {
      case "ChooseType":
        return <ChooseTypeSection setSection={setNewSection} />;
      case "Email":
        return <EmailSection setSection={setNewSection} />;
      case "Login":
        return <LoginSection />;
      case "Logged":
        return <LoggedSection logout={logout} />;
      case "Register":
        return <RegisterSection />;
      case "ExportPrivateKey":
        return <ExportPrivateKeySection />;
      case "TokenForPrivateKey":
        return <TokenForPrivateKeySection />;
      case "LoginWithPasswordForPrivateKey":
        return <LoginWithPasswordForPrivateKeySection />;
      case "PrivateKey":
        return <PrivateKeySection />;
    }
  }

  if (!isOpen && !isClosing) return null;

  return (
    <div className={`${isClosing ? "closing" : ""}`}>
      <div className="mego-modal-backdrop" onClick={handleClose}></div>
      <div className="mego-modal-wrapper">
        <div className="mego-modal-header">
          <div className="mego-modal-logo">
            <img
              height={22}
              src={"/mego.svg"}
              alt="MegoLogo"
              className="mr-2 mt-1"
            />
            <img
              height={13}
              src={"/megoLetter.svg"}
              alt="MegoLetter"
              className="ms-2"
            />
          </div>
          <div className="mego-modal-buttons">
            {
              prevSection && !loggedAs &&
              <img
                role="button"
                height={16}
                onClick={() => setNewSection(prevSection)}
                src={"/arrowBack.svg"}
                alt="BackIcon"
                className="ms-2"
              />
            }
            <img
              role="button"
              height={16}
              onClick={handleClose}
              src={"/cross.svg"}
              alt="CloseIcon"
              className="ms-2"
            />
          </div>
        </div>
        <div className="mego-modal-content" style={{ padding: 0 }}>
          <span
            style={{
              transform: "scale(0.8)",
              height: 300,
              transition: "height 0.3s",
            }}
          >
            <div className="mego-modal-title">
              {section === "Register" ? "REGISTER" : "CHOOSE HOW TO LOGIN"}
            </div>

            <>&nbsp;</>
            {isLoading ? (
              <div className="d-flex flex-column align-items-center">
                <div className="loader" />
                <p className="mego-login-text mt-4">
                  {loadingText || "Loading data..."}
                </p>
              </div>
            ) : (
              returnCurrentSection()
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

type SectionBaseProps = { setSection: (route: Route) => void };

const ChooseTypeSection: React.FC<SectionBaseProps> = ({ setSection }) => {
  const { redirectToAppleLogin, redirectToGoogleLogin } = useWeb3Context();

  return (
    <div>
      <button
        className={`mego-modal-button mego-apple`}
        onClick={redirectToAppleLogin}>
        <img src="/apple.svg" alt="Apple" className="mr-2" />
        APPLE ACCOUNT
      </button>

      <button
        className="mego-modal-button"
        onClick={redirectToGoogleLogin}>
        <img width={17} src="/google.svg" alt="Google" className="mr-2 mt-1" />
        GOOGLE ACCOUNT
      </button>

      {/* <WalletConnectButton /> */}

      <button className="mego-modal-button mego-email" onClick={() => setSection("Email")}>
        <img src={"/email.svg"} width={30} alt="Email" className="mr-2" />
        E-MAIL
      </button>
    </div>
  );
};

const EmailSection: React.FC<SectionBaseProps> = ({ setSection }) => {
  return (
    <>
      <button
        className="mego-modal-button outlined"
        onClick={() => setSection("Login")}
      >
        LOGIN
      </button>
      <button
        className="mego-modal-button outlined"
        onClick={() => setSection("Register")}
      >
        SIGN UP
      </button>
    </>
  );
};

const LoggedSection: React.FC<{ logout: () => void }> = ({ logout }) => {
  const { loggedAs, setSection, provider,
    requestExportPrivateKeyWithGoogle,
    requestExportPrivateKeyWithApple,
    openMegoModal }
    = useWeb3Context();

  const exported = new URLSearchParams(window.location.search).get("exported");

  if (exported) {
    setSection("TokenForPrivateKey");
  }

  const handleCopyAddress = () => {
    if (loggedAs) {
      navigator.clipboard.writeText(loggedAs);
      alert("Address copied to clipboard");
    }
  };

  const requestExportPrivateKey = () => {
    console.log("provider -> ", provider);
    switch (provider) {
      case "email":
        setSection("LoginWithPasswordForPrivateKey");
        break;
      case "google":
        requestExportPrivateKeyWithGoogle();
        break;
      case "google?provider=google":
        requestExportPrivateKeyWithGoogle();
        break;
      case "apple":
        requestExportPrivateKeyWithApple();
        break;
      case "apple?provider=apple":
        requestExportPrivateKeyWithApple();
        break;
      default:
        break;
    }
  }


  return (
    <div>
      <button className="mego-modal-button outlined" onClick={handleCopyAddress}>
        <img src={"/copy.svg"} alt="TurnOff" className="mr-2 h-6 w-6" />
        Copy address
      </button>

      {/* ONLY FOR EMAIL PROVIDER (GOOGLE, APPLE, EMAIL)*/}
      {
        provider !== "walletConnect" &&
        <button className="mego-modal-button outlined" onClick={requestExportPrivateKey}>
          <img src={"/export_key.svg"} alt="TurnOff" className="mr-2 h-6 w-6" />
          Export private key
        </button>
      }

      <button className="mego-modal-button outlined" onClick={logout}>
        <img src={"/disconnect.svg"} alt="TurnOff" className="mr-2 h-6 w-6" />
        Disconnect
      </button>
    </div>
  );
};

const ExportPrivateKeySection = () => {
  return (
    <div>
      <h5 className="mego-login-text">
        Export private key to implement
      </h5>
    </div>
  );
};

const LoginWithPasswordForPrivateKeySection = () => {
  const [password, setPassword] = useState<string>("");

  return (
    <div>
      <h5 className="mego-login-text">
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


const TokenForPrivateKeySection = () => {
  const [token, setToken] = useState<string>("");

  const { revealPrivateKey } = useWeb3Context();

  return (
    <div className="w-full flex flex-col items-center justify-center">
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
        Reveal private key
      </button>
    </div>
  );
};

const PrivateKeySection = () => {
  const { privateKey } = useWeb3Context();

  const handleCopyPrivateKey = () => {
    if (privateKey) {
      navigator.clipboard.writeText(privateKey);
      alert("Private key copied to clipboard");
    }
  }

  return (
    <div>
      <h5 className="mego-login-text">
        Private key: {privateKey}
      </h5>
      <button className="mego-modal-button outlined" onClick={handleCopyPrivateKey}>
        Copy private key
      </button>
    </div>
  );
};

const LoginSection = () => {
  const { createNewWallet, loginWithEmail } = useWeb3Context();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginWithEmail(email, password);
  };

  return (
    <>
      <h5 className="mego-login-text">
        Type your e-mail address and Password to login
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

        <input
          className="mego-input"
          id="password"
          placeholder="Password..."
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number"
        />

        <button
          className="mego-modal-button mt-3"
          type="submit"
          style={{ maxWidth: 200 }}
        >
          LOGIN
        </button>
      </form>
    </>
  );
};

const RegisterSection = () => {
  const { createNewWallet } = useWeb3Context();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createNewWallet(email, password);
  };

  return (

    <>
      <h5 className="mego-login-text">
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

        <input
          className="mego-input"
          id="password"
          placeholder="Password..."
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number"
        />
        <p
          className="mego-login-text "
          style={{ marginTop: -10, marginBottom: 0, fontSize: 11 }}
        >
          Password must contain at least 8 characters, including one uppercase
          letter, one lowercase letter, and one number
        </p>

        <button
          className="mego-modal-button mt-3"
          type="submit"
          style={{ maxWidth: 200 }}
        >
          REGISTER
        </button>
      </form>
    </>
  );
};

export default MegoModal;
