import { useCustomization } from "@megotickets/core";
import AppleIcon from "./icons/AppleIcon";
import EmailIcon from "./icons/EmailIcon";
import GoogleIcon from "./icons/GoogleIcon";
import WalletConnectButton from "./WalletConnectButton";
import { Route, useWeb3Context } from "./web3-context";

type SectionBaseProps = { setSection: (route: Route) => void };

const ChooseTypeSection: React.FC<SectionBaseProps> = ({ setSection }) => {
  const { redirectToAppleLogin, redirectToGoogleLogin } = useWeb3Context();
  const { style, providerConfiguration } = useCustomization();
  return (
    <div>
      <div onClick={redirectToAppleLogin}>
        {
          style?.customButtonOverrideComponent?.appleButton ?
            style?.customButtonOverrideComponent?.appleButton
            :
            (!providerConfiguration || providerConfiguration?.appleProvider || providerConfiguration?.appleProvider === undefined || providerConfiguration?.appleProvider === null) ?
              <button
                className={`mego-modal-button mego-apple`}
                style={{ ...style?.modalStyle?.buttonStyle }}
              >
                <div style={{ marginRight: '0.5rem' }}>
                  <AppleIcon height={13} width={11} />
                </div>
                <p className="mego-font-medium font-satoshi">APPLE ACCOUNT</p>
              </button>
              : <div></div>
        }
      </div>

      <div onClick={redirectToGoogleLogin}>
        {
          style?.customButtonOverrideComponent?.googleButton ?
            style?.customButtonOverrideComponent?.googleButton
            :
            providerConfiguration?.googleProvider || providerConfiguration?.googleProvider === undefined || providerConfiguration?.googleProvider === null ?
              <button
                className="mego-modal-button"
                style={{ ...style?.modalStyle?.buttonStyle }}
              >
                <GoogleIcon width={17} style={{ marginRight: '0.5rem' }} />
                <p className="mego-font-medium font-satoshi">GOOGLE ACCOUNT</p>
              </button>
              : <div></div>
        }
      </div>

      {
        providerConfiguration?.walletConnectProvider || providerConfiguration?.walletConnectProvider === undefined || providerConfiguration?.walletConnectProvider === null ?
          <WalletConnectButton />
          : <div></div>
      }

      <div onClick={() => setSection("Email")}>
        {
          style?.customButtonOverrideComponent?.emailButton ?
            style?.customButtonOverrideComponent?.emailButton
            :
            providerConfiguration?.emailProvider || providerConfiguration?.emailProvider === undefined || providerConfiguration?.emailProvider === null ?
              <button className="mego-modal-button mego-email font-satoshi" style={{ ...style?.modalStyle?.buttonStyle }}>
                <EmailIcon width={30} />
                <p className="mego-font-medium font-satoshi">E-MAIL</p>
              </button>
              : <div></div>
        }
      </div>
    </div>
  );
};

export default ChooseTypeSection;