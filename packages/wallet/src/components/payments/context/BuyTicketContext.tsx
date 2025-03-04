import React, { createContext, useContext, useState, ReactNode } from 'react';
import MegoBuyTicketModal from '../components/MegoBuyTicketModal';
import { Stepper } from '../interfaces/interface-stepper';

interface BuyTicketContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;

  //Event details
  eventDetails: any;
  setEventDetails: (eventDetails: any) => void;

  //Stepper
  stepper: Stepper;
  setStepper: (stepper: Stepper) => void;

  //Claim metadata
  claimMetadata: any;
  setClaimMetadata: (claimMetadata: any) => void;

  //Email of buyer
  emailOfBuyer: string | null;
  setEmailOfBuyer: (emailOfBuyer: string | null) => void;
}

const BuyTicketContext = createContext<BuyTicketContextType | undefined>(undefined);

interface BuyTicketProviderProps {children: ReactNode}

export const BuyTicketProvider: React.FC<BuyTicketProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState<any>(null);

  //Stepper
  const [stepper, setStepper] = useState<Stepper>(Stepper.Form_data);
  const [claimMetadata, setClaimMetadata] = useState<any>(null);
  const [emailOfBuyer, setEmailOfBuyer] = useState<string | null>(null);

  const value = {
    isOpen,
    setIsOpen,

    //Event details
    eventDetails,
    setEventDetails,

    //Stepper
    stepper,
    setStepper,

    //Claim metadata
    claimMetadata,
    setClaimMetadata,

    //Email of buyer
    emailOfBuyer,
    setEmailOfBuyer,
  };

  return (
    <BuyTicketContext.Provider value={value}>
      <MegoBuyTicketModal />
      {children}
    </BuyTicketContext.Provider>
  );
};

export const useBuyTicketContext = (): BuyTicketContextType => {
  const context = useContext(BuyTicketContext);

  if (context === undefined) {
    throw new Error('useBuyTicketContext deve essere utilizzato all\'interno di un BuyTicketProvider');
  }

  return context;
};
