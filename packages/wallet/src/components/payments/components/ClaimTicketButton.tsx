import React from "react";
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { Stepper } from "../interfaces/interface-stepper";

interface ClaimTicketButtonProps {
  eventDetails: any;
  buttonText?: string;
}

export const ClaimTicketButton: React.FC<ClaimTicketButtonProps> = ({
  buttonText = "Acquista Biglietto",
  eventDetails
}) => {
  const { setIsOpen, setEventDetails, resetPaymentProcessing, stepper } = useBuyTicketContext();

  const handleOpenModal = () => {
    if (stepper === Stepper.Claim) {
      // Resetta se il processo di pagamento precedente/corrente si è ultimato
      resetPaymentProcessing();
    }
    setEventDetails(eventDetails);
    setIsOpen(true);
  };

  return (
    <button
      style={{ backgroundColor: '#1E40AF', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.25rem' }}
      onClick={handleOpenModal}
    >
      {buttonText}
    </button>
  );
};


