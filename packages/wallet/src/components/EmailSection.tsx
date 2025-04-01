import React from "react";
import { Route } from "./web3-context";
import { MegoButton } from "@megotickets/core";

type SectionBaseProps = { setSection: (route: Route) => void };
const EmailSection: React.FC<SectionBaseProps> = ({ setSection }) => {
    return (
        <div className="email-section-container">
            <MegoButton
                className="chooseType-btn"
                onClick={() => setSection("Login")}
            >
                <p className="mego-font-medium font-satoshi">LOGIN</p>
            </MegoButton>
            <MegoButton
                className="chooseType-btn"
                onClick={() => setSection("Register")}
            >
                <p className="mego-font-medium font-satoshi">SIGN UP</p>
            </MegoButton>
        </div>
    );
};


export default EmailSection;