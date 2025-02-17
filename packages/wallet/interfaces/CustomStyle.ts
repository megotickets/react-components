
interface CustomStyle {
    modalStyle?: {
        headerStyle?: React.CSSProperties;
        bodyStyle?: React.CSSProperties;
        buttonStyle?: React.CSSProperties;
    };
    customButtonOverrideComponent?: buttonOverrideComponent;
    buttonOverrideComponent?: buttonOverrideComponent;
    connectButtonStyle?: React.CSSProperties;
    megoWalletContainerStyle?: React.CSSProperties;
    megoWalletIconStyle?: React.CSSProperties;
    megoWalletPosition?: 'left' | 'right' | 'center';
}

interface buttonOverrideComponent {
    googleButton?: React.ReactNode;
    appleButton?: React.ReactNode;
    emailButton?: React.ReactNode;
    walletConnectButton?: React.ReactNode;
}

export type { CustomStyle, buttonOverrideComponent };