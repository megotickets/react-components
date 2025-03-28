import CopyIcon from "./icons/CopyIcon";
import DisconnectIcon from "./icons/DisconnectIcon";
import ExportKeyIcon from "./icons/ExportKeyIcon";
import { useWeb3Context } from "./web3-context";


const LoggedSection: React.FC<{ logout: () => void }> = ({ logout }) => {
    const { loggedAs, setSection, provider,
      requestExportPrivateKeyWithGoogle,
      requestExportPrivateKeyWithApple,
      openMegoModal }
      = useWeb3Context();
  
    const exported = new URLSearchParams(window.location.search).get("exported");
    const privateKeyVisible = new URLSearchParams(window.location.search).get("privateKeyVisible");
  
    if (exported && !privateKeyVisible) {
      setSection("TokenForPrivateKey");
    }
  
    if (privateKeyVisible) {
      setSection("PrivateKey");
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
          <CopyIcon height={16} width={16} style={{ marginRight: '0.5rem', height: '1.5rem', width: '1.5rem' }} />
          <p className="mego-font-medium font-satoshi">Copy address</p>
        </button>
  
        {/* ONLY FOR EMAIL PROVIDER (GOOGLE, APPLE, EMAIL)*/}
        {
          provider !== "walletConnect" &&
          <button className="mego-modal-button outlined" onClick={requestExportPrivateKey}>
            <ExportKeyIcon
              style={{ marginRight: '0.5rem', height: '1.5rem', width: '1.5rem' }}
            />
            <p className="mego-font-medium font-satoshi">Export private key</p>
          </button>
        }
  
        <button className="mego-modal-button outlined" onClick={logout}>
          <DisconnectIcon
            style={{ marginRight: '0.5rem', height: '1.5rem', width: '1.5rem' }}
          />
          <p className="mego-font-medium font-satoshi">Disconnect</p>
        </button>
      </div>
    );
  };

export default LoggedSection;