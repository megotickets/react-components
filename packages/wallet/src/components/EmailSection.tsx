import React from "react";
import { Route } from "./web3-context";

type SectionBaseProps = { setSection: (route: Route) => void };
const EmailSection: React.FC<SectionBaseProps> = ({ setSection }) => {
    return (
        <>
            <button
                className="mego-modal-button outlined"
                onClick={() => setSection("Login")}
            >
                <p className="mego-font-medium font-satoshi">LOGIN</p>
            </button>
            <button
                className="mego-modal-button outlined"
                onClick={() => setSection("Register")}
            >
                <p className="mego-font-medium font-satoshi">SIGN UP</p>
            </button>
        </>
    );
};


export default EmailSection;