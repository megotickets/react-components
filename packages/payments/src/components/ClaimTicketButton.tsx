import React, { useMemo } from "react";
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { Stepper } from "../interfaces/interface-stepper";
import { useAccount, useLanguage } from "@megotickets/core";
import "../css/pay.css";

interface ClaimTicketButtonProps {
  eventDetails: any;
  buttonText?: string;
  overrideButton?: React.ReactNode;
}



export const ClaimTicketButton: React.FC<ClaimTicketButtonProps> = ({
  buttonText,
  eventDetails,
  overrideButton
}) => {

  const { setIsOpen, setEventDetails, resetPaymentProcessing, stepper } = useBuyTicketContext();
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

  const userAddress = useMemo(() => {
    //Search loggedAs o signedAs nei params dell'url
    const urlParams = new URLSearchParams(window.location.search);
    const loggedAs = urlParams.get('loggedAs');
    const signedAs = urlParams.get('signedAs');
    return address || loggedAs || signedAs || ""
  }, [address, window.location.search])


  if (overrideButton) {
    return <div
      onClick={() => userAddress ? handleOpenModal() : null}
      style={{
        opacity: userAddress ? 1 : 0.5,
        cursor: userAddress ? 'pointer' : 'not-allowed',
        pointerEvents: userAddress ? 'auto' : 'none'
      }}
    >
      {overrideButton}
    </div>;
  }

  return (
    <div
      className={`ticketButton ${!userAddress ? 'ticketButtonDisabled' : ''}`}
      onClick={() => userAddress ? handleOpenModal() : null}
    >
      <div
        className="ticketBtn font-satoshi"
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#111'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#000'}
      >
        {buttonText || t('buyTicket', 'payments')}
      </div>
    </div>
  );
};


