import React from "react";
import { useBuyTicketContext } from "../context/BuyTicketContext";

interface ClaimTicketButtonProps {
  eventDetails: any;
  buttonText?: string;
}

export const ClaimTicketButton: React.FC<ClaimTicketButtonProps> = ({
  buttonText = "Acquista Biglietto",
  eventDetails
}) => {
  const { setIsOpen, setEventDetails } = useBuyTicketContext();

  const handleOpenModal = () => {
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


