import React, { useMemo } from "react";
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { Stepper } from "../interfaces/interface-stepper";
import { useAccount } from "@megotickets/core";

interface ClaimTicketButtonProps {
  eventDetails: any;
  buttonText?: string;
  overrideButton?: React.ReactNode;
}

export const ClaimTicketButton: React.FC<ClaimTicketButtonProps> = ({
  buttonText = "Acquista Biglietto",
  eventDetails,
  overrideButton
}) => {

  const { setIsOpen, setEventDetails, resetPaymentProcessing, stepper } = useBuyTicketContext();
  const { address } = useAccount();

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
    <button
      style={{
        backgroundColor: '#3B82F6',
        color: 'white',
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        fontWeight: '600',
        border: 'none',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        opacity: userAddress ? 1 : 0.5,
        cursor: userAddress ? 'pointer' : 'not-allowed'
      }}
      onClick={() => userAddress ? handleOpenModal() : null}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}
    >
      <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
      {buttonText}
    </button>
  );
};


