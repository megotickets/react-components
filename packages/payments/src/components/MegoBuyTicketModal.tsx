import React, { useEffect, useState, ReactNode } from "react";
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

interface MegoBuyTicketModalProps {
  onClose?: () => void;
}

const MegoBuyTicketModal: React.FC<MegoBuyTicketModalProps> = ({ onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const { isOpen, setIsOpen, stepper, setStepper, resetPaymentProcessing } = useBuyTicketContext();

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

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
          height: "50vh",
          maxHeight: "50vh"
        }}
      >
        <div className="mego-modal-header">
          <div className="mego-modal-logo">
            <h3 className="payment-title font-satoshi">Buy Ticket</h3>
          </div>
          <div className="mego-modal-buttons">
            <div onClick={handleClose} style={{ marginRight: '0.5rem', marginTop: '0.5rem', cursor: 'pointer' }}>
              <CrossIcon onClick={handleClose} height={16} width={16} />
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