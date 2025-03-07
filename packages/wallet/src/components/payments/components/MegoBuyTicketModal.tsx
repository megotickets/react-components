import React, { useEffect, useState, ReactNode } from "react";
import "../../mego-style.css";
import CrossIcon from "../../icons/CrossIcon";
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { Stepper } from "../interfaces/interface-stepper";
import { BuyTicketForm } from "./BuyTicketForm";
import { BuyTicketProcessing } from "./BuyTicketProcessing";
import { BuyTicketPayments } from "./BuyTicketPayments";
import { BuyTicketClaim } from "./BuyTicketClaim";
import { useWeb3Context } from "@/components/web3-context";
import { useAccount } from "wagmi";

interface MegoBuyTicketModalProps {
  onClose?: () => void;
}

const MegoBuyTicketModal: React.FC<MegoBuyTicketModalProps> = ({ onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const { isOpen, setIsOpen, stepper, setStepper } = useBuyTicketContext();

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
            <h3 className="payment-title">Acquista Biglietto</h3>
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
          {stepper === Stepper.Payments && <BuyTicketPayments />}
          {stepper === Stepper.Claim && <BuyTicketClaim />}
        </div>
      </div>
    </div>
  );
};

export default MegoBuyTicketModal;