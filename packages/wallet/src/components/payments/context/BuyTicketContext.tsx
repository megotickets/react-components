import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import MegoBuyTicketModal from '../components/MegoBuyTicketModal';
import { Stepper } from '../interfaces/interface-stepper';
import { PopupModality } from '../interfaces/popup-enum';
import { MegoPopup, MegoPopupData } from '@/components/MegoPopup';
import { cleanMegoPendingClaimProcessing, getMegoPendingClaimProcessingData } from '../utils/BuyTicketUtils';

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

  //Popup
  openPopup: (popupData: MegoPopupData) => void;

  //Reset payment processing
  resetPaymentProcessing: () => void;

  //Claim data
  claimData: any;
  setClaimData: (claimData: any) => void;
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

  //Claim data
  const [claimData, setClaimData] = useState<any>(null);

  const [popup, setPopup] = useState<MegoPopupData>({
    isOpen: false,
    message: '',
    title: '',
    modality: PopupModality.Info,
    autoCloseTime: 5000
  });
  
  const openPopup = (popupData: MegoPopupData) => {
    setPopup(popupData)
  }

  const resetPaymentProcessing = () => {
    setStepper(Stepper.Form_data)
    setEventDetails(null)
    setClaimMetadata(null)
    setEmailOfBuyer(null)
    setIsOpen(false)
    setClaimData(null)
  }

  const restoreClaimProcessing = async () => {
    setIsOpen(true)
    setStepper(Stepper.Processing)
  }

  const restorePaymentProcessing = async () => {
    //TODO: Implement
  }

  //Restore the claim processing started with mego
  useEffect(()=>{
    //Restore MP_func from local storage
    const MP_func = localStorage.getItem("MP_func")
    if(MP_func === "claim_processing"){
       restoreClaimProcessing()
    } else if(MP_func === "payment_processing"){  
      restorePaymentProcessing()
    } else {
      cleanMegoPendingClaimProcessing()
    }
  },[])

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

    //Popup
    openPopup,

    //Reset payment processing
    resetPaymentProcessing,

    //Claim data
    claimData,
    setClaimData
  };

  return (
    <BuyTicketContext.Provider value={value}>
      <MegoBuyTicketModal />
      <MegoPopup 
        popupData={popup}
        onClose={() => setPopup({
          isOpen: false,
          message: '',
          title: '',
          modality: PopupModality.Info,
          autoCloseTime: 5000
        })}
      />
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
