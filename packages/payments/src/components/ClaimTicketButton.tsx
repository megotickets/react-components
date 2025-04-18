import React, { useMemo } from "react";
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { Stepper } from "../interfaces/interface-stepper";
import { useAccount, useLanguage } from "@megotickets/core";
import "../css/pay.css";
import { MegoMetadataFieldConfig } from "../interfaces/metadata";
import { getLoginData, LoginData } from "@megotickets/core";
import { getLoginDataInfo } from "@/utils/LoginUtils";

interface ClaimTicketButtonProps {
  eventDetails: any;
  buttonText?: string;
  overrideButton?: React.ReactNode;
  metadataConfig?: MegoMetadataFieldConfig[];
}

export const ClaimTicketButton: React.FC<ClaimTicketButtonProps> = ({
  buttonText,
  eventDetails,
  overrideButton,
}) => {

  const { setIsOpen, setEventDetails, resetPaymentProcessing, stepper, setMetadataConfig, amountOfTicket } = useBuyTicketContext();
  const { address } = useAccount();
  const { t } = useLanguage()

  const handleOpenModal = () => {
    if (stepper === Stepper.Claim) {
      // Resetta se il processo di pagamento precedente/corrente si è ultimato
      resetPaymentProcessing();
    }
    setEventDetails(eventDetails);
    setIsOpen(true);
  };


  if (overrideButton) {
    return <div
      onClick={() => {
        getLoginDataInfo()?.loggedAs ? handleOpenModal() : null
      }}
      style={{
        opacity: getLoginDataInfo()?.loggedAs ? 1 : 0.5,
        cursor: getLoginDataInfo()?.loggedAs ? 'pointer' : 'not-allowed',
        pointerEvents: getLoginDataInfo()?.loggedAs ? 'auto' : 'none'
      }}
    >
      {overrideButton}
    </div>;
  }

  return (
    <div
      className={`ticketButton ${!getLoginDataInfo()?.loggedAs ? 'ticketButtonDisabled' : ''}`}
      onClick={() => getLoginDataInfo()?.loggedAs ? handleOpenModal() : null}
    >
      <div
        className="ticketBtn font-satoshi"
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#111'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#000'}
      >
        {buttonText || (amountOfTicket > 1 ? t('buyTickets', 'payments') : t('buyTicket', 'payments'))}
      </div>
    </div>
  );
};


