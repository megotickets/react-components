import React, { useEffect, useState, ReactNode, useMemo } from "react";
import CrossIcon from "./icons/CrossIcon";
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { Stepper } from "../interfaces/interface-stepper";
import { BuyTicketForm } from "./BuyTicketForm";
import { BuyTicketProcessing } from "./BuyTicketProcessing";
import { BuyTicketClaim } from "./BuyTicketClaim";
import { BuyCheckNFTAndMint } from "./BuyCheckNFTAndMint";
import { BuyTicketClaimGeneration } from "./BuyTicketClaimGeneration";
import BuyTicketWithStripe from "./BuyTicketWithStripe";
import BuyTicketWithCrypto from "./BuyTicketWithCrypto";
import { useLanguage, LanguageSelector } from "@megotickets/core";
interface MegoBuyTicketModalProps {
  onClose?: () => void;
}

const MegoBuyTicketModal: React.FC<MegoBuyTicketModalProps> = ({ onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const { isOpen, setIsOpen, stepper, setStepper, resetPaymentProcessing } = useBuyTicketContext();
  const { t, language } = useLanguage()

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  // Change title dinamically based on the language and the stepper
  const modalTitle = useMemo(() => {
    if (stepper === Stepper.Claim) {
      return <h2 className="payment-title font-satoshi">{t('congratulationsTitle', 'payments')}</h2>;
    }
    return <h3 className="payment-title font-satoshi">{t('buyTicket', 'payments')}</h3>;
  }, [stepper, language]);

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
      setIsOpen(false);
      setIsClosing(false);
    }, 300); // Durata dell'animazione

    if (stepper === Stepper.Payments_Stripe) {
      resetPaymentProcessing();
    }
  }

  if (!isOpen && !isClosing) return null;

  return (
    <div className={`${isClosing ? "closing" : ""} mego-modal-container payment-modal`}>
      <div className="mego-modal-backdrop" onClick={handleClose}></div>
      <div
        className="mego-modal-wrapper payment-wrapper"
        style={{
          height: "75vh",
          maxHeight: "75vh"
        }}
      >
        <div className="mego-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="mego-modal-logo">
            {modalTitle}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative', zIndex: 10 }}>
             <LanguageSelector />
             <div onClick={handleClose} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <CrossIcon height={16} width={16} />
            </div>
          </div>
        </div>
        <div className="mego-modal-content payment-content">
          {stepper === Stepper.Form_data && <BuyTicketForm />}
          {stepper === Stepper.Processing && <BuyTicketProcessing />}
          {stepper === Stepper.Payments_crypto && <BuyTicketWithCrypto />}
          {stepper === Stepper.Payments_Stripe && <BuyTicketWithStripe />}
          {stepper === Stepper.NFT_Mint && <BuyCheckNFTAndMint />}
          {stepper === Stepper.Claim_Generation && <BuyTicketClaimGeneration />}
          {stepper === Stepper.Claim && <BuyTicketClaim />}
        </div>
      </div>
    </div>
  );
};

export default MegoBuyTicketModal;