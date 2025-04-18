import React, { useEffect } from "react"
import { useWeb3Context } from "./web3-context"
import "../css/mego-style.css";
import { useCustomization, getLoginData } from "@megotickets/core";
import { CustomStyle, providerConfiguration } from "interfaces/CustomStyle";

const GlobalStyle = `
  @import url('https://api.fontshare.com/v2/css?f[]=satoshi@300,500&display=swap');
  
  .mego-font-light {
    font-family: 'Satoshi', sans-serif;
    font-weight: 300;
  }

  .mego-font-medium {
    font-family: 'Satoshi', sans-serif;
    font-weight: 500;
  }
`;

const WalletIcon: React.FC = () => {
    const { loggedAs } = useWeb3Context();
    const { style } = useCustomization();
    const loginData = getLoginData();
    const isConnectWithMego = loginData?.isConnectWithMego || false;
    const email = loginData?.email || "Email";
    return (
        <div className="mego-wallet-icon-container" style={{ ...style?.megoWalletContainerStyle }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 26" style={{ ...style?.megoWalletIconStyle, height: '1.5rem', width: '1.5rem', stroke: 'none', fill: `${style?.megoWalletIconStyle?.stroke || 'white'}` }}>
                <path d="M20.4 12.7c.4 0 .8.3.8.8s-.3.8-.8.8h-.2c-.4 0-.8-.3-.8-.8s.3-.8.8-.8h.2Z" />
                <path d="M20.2 11h4.2v-.5c0-2.6-2.1-4.8-4.8-4.8h-10c-2.6 0-4.8 2.1-4.8 4.8v6c0 2.6 2.1 4.8 4.8 4.8h10c2.6 0 4.8-2.1 4.8-4.8V16h-4.2c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5Zm-5.5 6.5h-6c-.3 0-.5-.2-.5-.5s.2-.5.5-.5h6c.3 0 .5.2.5.5s-.2.5-.5.5Z" />
                <path
                    d="M6.9 6.2c.8-.6 1.8-.9 2.9-.9h10c1.3 0 2.5.5 3.4 1.3l-.7-1.7c-1-2.6-4-3.8-6.5-2.7L8.4 5.3c-.6.2-1 .5-1.5.9Z"
                    style={{
                        fillRule: "evenodd",
                    }}
                />
            </svg>
            {loggedAs && !isConnectWithMego && <div className="font-satoshi">{loggedAs.slice(0, 4)}...{loggedAs.slice(-4)}</div>}
            {loggedAs && isConnectWithMego && <div className="font-satoshi">{email}</div>}
        </div>
    )
}
//style={{ ...style?.megoWalletIconStyle }}
//stroke={`${style?.megoWalletIconStyle?.stroke || 'white'}`}

interface MegoWalletProps {
    customStyle?: CustomStyle;
    providerConfiguration?: providerConfiguration;
    forceChainId?: number;
}

export function WalletButton({ customStyle, providerConfiguration, forceChainId }: MegoWalletProps) {
    const { openMegoModal, loggedAs, provider, setForceChainId } = useWeb3Context();

    // Inflate the custom style and button override component
    const { setStyle, setProviderConfiguration } = useCustomization();

    useEffect(() => {
        if (customStyle) {
            setStyle(customStyle);
        }

        if (providerConfiguration) {
            setProviderConfiguration(providerConfiguration);
        }

        if (forceChainId) {
            setForceChainId(forceChainId);
        }

        const styleElement = document.createElement('style');
        styleElement.innerHTML = GlobalStyle;
        document.head.appendChild(styleElement);
        
        return () => {
            document.head.removeChild(styleElement);
        };
    }, [customStyle, providerConfiguration, forceChainId]);


    return (
        <div role="button" onClick={openMegoModal}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: `${customStyle?.megoWalletPosition || 'right'}`,
                gap: '0.5rem',
            }}>
            <WalletIcon />
        </div>
    )
}

export default WalletButton;