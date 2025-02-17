
interface CustomStyle {
    modalStyle?: {
        headerStyle?: React.CSSProperties;
        bodyStyle?: React.CSSProperties;
        buttonStyle?: React.CSSProperties;
    };
    connectButtonStyle?: React.CSSProperties;
    megoWalletIconContainerStyle?: React.CSSProperties;
}

interface buttonOverrideComponent {
    googleButton?: React.ReactNode;
    appleButton?: React.ReactNode;
    emailButton?: React.ReactNode;
    walletConnectButton?: React.ReactNode;
}

export type { CustomStyle, buttonOverrideComponent };