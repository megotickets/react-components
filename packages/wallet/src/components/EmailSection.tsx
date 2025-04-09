import React from "react";
import { Route } from "./web3-context";
import { MegoButton, useLanguage } from "@megotickets/core";

type SectionBaseProps = { setSection: (route: Route) => void };
const EmailSection: React.FC<SectionBaseProps> = ({ setSection }) => {
    const { t } = useLanguage();
    return (
        <div className="email-section-container">
            <MegoButton
                className="chooseType-btn"
                onClick={() => setSection("Login")}
            >
                <p className="mego-font-medium font-satoshi">{t('login', 'wallet')}</p>
            </MegoButton>
            <MegoButton
                className="chooseType-btn"
                onClick={() => setSection("Register")}
            >
                <p className="mego-font-medium font-satoshi">{t('signUp', 'wallet')}</p>
            </MegoButton>
        </div>
    );
};


export default EmailSection;