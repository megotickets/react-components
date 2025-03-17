
interface CustomStyle {
    modalStyle?: {
        headerStyle?: React.CSSProperties;
        bodyStyle?: React.CSSProperties;
        buttonStyle?: React.CSSProperties;
    };
    customButtonOverrideComponent?: buttonOverrideComponent;
    buttonOverrideComponent?: buttonOverrideComponent;
    megoWalletContainerStyle?: React.CSSProperties;
    megoWalletIconStyle?: React.CSSProperties;
    megoWalletPosition?: 'left' | 'right' | 'center';
}

interface providerConfiguration {
    googleProvider?: boolean;
    appleProvider?: boolean;
    emailProvider?: boolean;
    walletConnectProvider?: boolean;
}

interface buttonOverrideComponent {
    googleButton?: React.ReactNode;
    appleButton?: React.ReactNode;
    emailButton?: React.ReactNode;
    walletConnectButton?: React.ReactNode;
}

export type { CustomStyle, buttonOverrideComponent, providerConfiguration };