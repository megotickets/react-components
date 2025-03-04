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
      className={"bg-blue-500 text-white px-4 py-2 rounded-md"}
      onClick={handleOpenModal}
    >
      {buttonText}
    </button>
  );
};


