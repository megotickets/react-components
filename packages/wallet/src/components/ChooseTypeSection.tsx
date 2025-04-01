import { MegoButton, useCustomization } from "@megotickets/core";
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
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
      <div className="chooseType-btn-container" onClick={redirectToAppleLogin}>
        {
          style?.customButtonOverrideComponent?.appleButton ?
            style?.customButtonOverrideComponent?.appleButton
            :
            (!providerConfiguration || providerConfiguration?.appleProvider || providerConfiguration?.appleProvider === undefined || providerConfiguration?.appleProvider === null) ?
              <MegoButton
                className="chooseType-btn"
                style={{ ...style?.modalStyle?.buttonStyle }}
              >
                <div className="chooseType-btn-content">
                  <div style={{ marginRight: '0.5rem' }}>
                    <AppleIcon height={13} width={11} />
                  </div>
                  <p className="mego-font-medium font-satoshi">APPLE ACCOUNT</p>
                </div>
              </MegoButton>
              : <div></div>
        }
      </div>

      <div className="chooseType-btn-container" onClick={redirectToGoogleLogin}>
        {
          style?.customButtonOverrideComponent?.googleButton ?
            style?.customButtonOverrideComponent?.googleButton
            :
            providerConfiguration?.googleProvider || providerConfiguration?.googleProvider === undefined || providerConfiguration?.googleProvider === null ?
              <MegoButton
                className="chooseType-btn"
                style={{ ...style?.modalStyle?.buttonStyle }}
              >
                <div className="chooseType-btn-content">
                  <GoogleIcon width={17} style={{ marginRight: '0.5rem' }} />
                  <p className="mego-font-medium font-satoshi">GOOGLE ACCOUNT</p>
                </div>
              </MegoButton>
              : <div></div>
        }
      </div>

      {
        providerConfiguration?.walletConnectProvider || providerConfiguration?.walletConnectProvider === undefined || providerConfiguration?.walletConnectProvider === null ?
          <WalletConnectButton />
          : <div></div>
      }

      <div className="chooseType-btn-container" onClick={() => setSection("Email")}>
        {
          style?.customButtonOverrideComponent?.emailButton ?
            style?.customButtonOverrideComponent?.emailButton
            :
            providerConfiguration?.emailProvider || providerConfiguration?.emailProvider === undefined || providerConfiguration?.emailProvider === null ?
              <MegoButton className="chooseType-btn font-satoshi" style={{ ...style?.modalStyle?.buttonStyle }}>

                <div className="chooseType-btn-content">
                  <EmailIcon width={30} />
                  <p className="mego-font-medium font-satoshi">E-MAIL</p>
                </div>

              </MegoButton>
              : <div></div>
        }
      </div>
    </div>
  );
};

export default ChooseTypeSection;