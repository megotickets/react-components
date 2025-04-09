import React, { useEffect, useState } from "react";
import { Route, useWeb3Context } from "./web3-context";
import ArrowBackIcon from "./icons/ArrowBackIcon";
import CrossIcon from "./icons/CrossIcon";
import MegoIcon from "./icons/MegoIcon";
import MegoLetter from "./icons/MegoLetter";
import { Loader, useCustomization, LanguageSelector, useLanguage } from "@megotickets/core";
import "../css/mego-style.css";
import LoggedSection from "./LoggedSection";
import ExportPrivateKeySection from "./ExportPrivateKeySection";
import LoginWithPasswordForPrivateKeySection from "./LoginWithPasswordForPrivateKeySection";
import TokenForPrivateKeySection from "./TokenForPrivateKeySection";
import PrivateKeySection from "./PrivateKeySection";
import LoginSection from "./LoginSection";
import RegisterSection from "./RegisterSection";
import EmailSection from "./EmailSection";
import ChooseTypeSection from "./ChooseTypeSection";

interface MegoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MegoModal({ isOpen, onClose }: MegoModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const {isLoading,loggedAs,logout,section,setSection,prevSection, setPrevSection} = useWeb3Context(); // Aggiungi il contesto per il loading
  const { style } = useCustomization();
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      if (loggedAs) {
        setSection("Logged");
      } else {
        setNewSection("ChooseType");
      }
      setIsClosing(false);
    }
  }, [isOpen, loggedAs]);


  useEffect(() => {
    if (loggedAs && isOpen) {
      setTimeout(() => {
        setSection("Logged");
      }, 100);
    }
  }, [loggedAs, isOpen]);


  function setNewSection(route: Route) {
    setSection(route);
    if (route === "ChooseType") setPrevSection(undefined);
    if (route === "Email") setPrevSection("ChooseType");
    if (route === "Login") setPrevSection("Email");
    if (route === "Register") setPrevSection("Email");
    if (route === "Logged") setPrevSection(undefined);
    if (route === "ExportPrivateKey") setPrevSection("Logged");
    if (route === "TokenForPrivateKey") setPrevSection("ExportPrivateKey");
    if (route === "LoginWithPasswordForPrivateKey") setPrevSection("Logged");
  }

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // Match this with the animation duration
  }

  function returnCurrentSection() {
    switch (section) {
      case "ChooseType":
        return <ChooseTypeSection setSection={setNewSection} />;
      case "Email":
        return <EmailSection setSection={setNewSection} />;
      case "Login":
        return <LoginSection />;
      case "Logged":
        return <LoggedSection logout={logout} />;
      case "Register":
        return <RegisterSection />;
      case "ExportPrivateKey":
        return <ExportPrivateKeySection />;
      case "TokenForPrivateKey":
        return <TokenForPrivateKeySection />;
      case "LoginWithPasswordForPrivateKey":
        return <LoginWithPasswordForPrivateKeySection />;
      case "PrivateKey":
        return <PrivateKeySection />;
    }
  }

  if (!isOpen && !isClosing) return null;

  return (
    <div className={`${isClosing ? "closing" : ""} mego-modal-container`}>
      <div className="mego-modal-backdrop" onClick={handleClose}></div>
      <div className="mego-modal-wrapper"
        style={{
          backgroundColor: style?.modalStyle?.headerStyle?.backgroundColor || 'white',
        }}
      >
        <div className="mego-modal-header" style={{ ...style?.modalStyle?.headerStyle }}>
          <div className="mego-modal-logo"
            style={{
              backgroundColor: style?.modalStyle?.headerStyle?.backgroundColor || 'white',
            }}
          >
            <MegoIcon height={22} style={{ marginRight: '0.5rem', marginTop: '0.5rem' }} />
            <MegoLetter height={13} style={{ marginRight: '0.5rem', marginTop: '0.5rem' }} />
          </div>
          <div className="mego-modal-buttons">
            <div style={{ marginRight: '0.5rem', marginTop: '0.2rem'}}>
              <LanguageSelector />
            </div>
            {
              prevSection && !loggedAs &&
              <div onClick={() => setNewSection(prevSection)} style={{ marginRight: '0.5rem', marginTop: '0.5rem', cursor: 'pointer' }}>
                <ArrowBackIcon height={16} width={16} />
              </div>
            }
            <div onClick={handleClose} style={{ marginRight: '0.5rem', marginTop: '0.5rem', cursor: 'pointer' }}>
              <CrossIcon onClick={handleClose} height={16} width={16} />
            </div>
          </div>
        </div>
        <div className="mego-modal-content" style={{ ...style?.modalStyle?.bodyStyle }}>
          <span
            style={{
              transform: "scale(0.8)",
              height: 300,
              transition: "height 0.3s",
            }}
          >
            <div className="mego-modal-title mego-font-medium font-satoshi" style={{ marginBottom: '0.5rem' }}>
              {t(section === "Register" ? 'registerTitle' : 'loginTitle', 'wallet')}
            </div>

            {isLoading ? <div style={{ marginTop: '1rem', marginBottom: '1rem' }}><Loader /></div> : (
              returnCurrentSection()
            )}
          </span>
        </div>
      </div>
    </div>
  );
};




export default MegoModal;
