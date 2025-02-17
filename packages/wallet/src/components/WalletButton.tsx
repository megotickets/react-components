import React, { useEffect } from "react"
import { useWeb3Context } from "./web3-context"
import "./mego-style.css";
import { useCustomization } from "./CustomizationProvider";
import { buttonOverrideComponent, CustomStyle } from "interfaces/CustomStyle";

const WalletIcon: React.FC = () => {
    const { loggedAs } = useWeb3Context();
    return (
        <div className="mego-wallet-icon-container">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.00001 6.5V6.5C3.00001 5.11929 4.1193 4 5.50001 4L19.2857 4C19.4852 4 19.585 4 19.6651 4.02806C19.8088 4.07831 19.9217 4.19124 19.9719 4.33486C20 4.41505 20 4.51479 20 4.71429V4.71429C20 5.91124 20 6.50972 19.8317 6.99084C19.5301 7.85258 18.8526 8.53011 17.9908 8.83165C17.5097 9 16.9112 9 15.7143 9L15 9M3.00001 6.5V6.5C3.00001 7.88071 4.11929 9 5.50001 9L19 9C19.9428 9 20.4142 9 20.7071 9.29289C21 9.58579 21 10.0572 21 11L21 13M3.00001 6.5L3.00001 17C3.00001 18.8856 3.00001 19.8284 3.58579 20.4142C4.17158 21 5.11439 21 7.00001 21L19 21C19.9428 21 20.4142 21 20.7071 20.7071C21 20.4142 21 19.9428 21 19L21 17M21 17H17C16.0572 17 15.5858 17 15.2929 16.7071C15 16.4142 15 15.9428 15 15V15C15 14.0572 15 13.5858 15.2929 13.2929C15.5858 13 16.0572 13 17 13H21M21 17L21 13" stroke="white" stroke-width="2" />
            </svg>
            {loggedAs && <div>{loggedAs.slice(0, 4)}...{loggedAs.slice(-4)}</div>}
        </div>
    )
}


interface MegoWalletProps {
    customStyle?: CustomStyle;
    customButtonOverrideComponent?: buttonOverrideComponent;
    customMegoWalletIconContainerStyle?: React.CSSProperties;
}

export function WalletButton({ customStyle, customButtonOverrideComponent, customMegoWalletIconContainerStyle }: MegoWalletProps) {
    const { openMegoModal, loggedAs, provider } = useWeb3Context();

    // Inflate the custom style and button override component
    const { megoWalletIconContainerStyle, setStyle, setButtonOverrideComponent, setMegoWalletIconContainerStyle } = useCustomization();
    useEffect(() => {
        if (customStyle) {
            setStyle(customStyle);
        }

        if (customButtonOverrideComponent) {
            setButtonOverrideComponent(customButtonOverrideComponent);
        }

        if (customMegoWalletIconContainerStyle) {
            setMegoWalletIconContainerStyle(customMegoWalletIconContainerStyle);
        }
    }, [customStyle, customButtonOverrideComponent, customMegoWalletIconContainerStyle]);

    return (
        <div role="button" onClick={openMegoModal}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                ...megoWalletIconContainerStyle
            }}>
            <WalletIcon />
        </div>
    )
}

export default WalletButton;