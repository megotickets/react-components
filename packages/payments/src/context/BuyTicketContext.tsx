import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import MegoBuyTicketModal from '../components/MegoBuyTicketModal';
import { Stepper } from '../interfaces/interface-stepper';
import { cleanMegoPendingClaimProcessing } from '../utils/BuyTicketUtils';
import { MegoPopup } from '@megotickets/core';
import { PopupModality } from '../interfaces/popup-enum';
import { MegoPopupData } from '@megotickets/core';
import { MegoMetadataFieldConfig } from '../interfaces/metadata';
import { ShareEmailOptions } from '@/interfaces/interface-share-email';

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

  //Payments details
  paymentsDetails: any;
  setPaymentsDetails: (paymentsDetails: any) => void;

  //Token id
  tokenIds: string[] | null;
  setTokenIds: (tokenId: string[] | null) => void;

  //processor
  processor: string | null;
  setProcessor: (processor: string | null) => void;


  //Restore
  savePendingProcess: (label?: string) => void;
  restorePendingProcess: () => void;

  //Discount code
  discountCode: string | null;
  setDiscountCode: (discountCode: string | null) => void;

  //Terms and conditions link
  termsAndConditionsLink: string;

  // Metadata Config (Aggiunto)
  metadataConfig: MegoMetadataFieldConfig[] | null;
  setMetadataConfig: (config: MegoMetadataFieldConfig[] | null) => void;

  //Share email
  shareEmail: ShareEmailOptions | null;
  setShareEmail: (shareEmail: ShareEmailOptions | null) => void;

  //Redirect url
  redirectUrl: string | null;
  setRedirectUrl: (redirectUrl: string | null) => void;

  //Amount of ticket
  amountOfTicket: number;
  setAmountOfTicket: (amountOfTicket: number) => void;
}

const BuyTicketContext = createContext<BuyTicketContextType | undefined>(undefined);

interface BuyTicketProviderProps {children: ReactNode}

export const BuyTicketProvider: React.FC<BuyTicketProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [paymentsDetails, setPaymentsDetails] = useState<any>(null);

  //Stepper
  const [stepper, setStepper] = useState<Stepper>(Stepper.Form_data);
  const [claimMetadata, setClaimMetadata] = useState<any>(null);
  const [emailOfBuyer, setEmailOfBuyer] = useState<string | null>(null);
  const [tokenIds, setTokenIds] = useState<string[] | null>(null);

  //Claim data
  const [claimData, setClaimData] = useState<any>(null);

  //Processor
  const [processor, setProcessor] = useState<string | null>(null);

  //Discount code
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  // Stato per Metadata Config (Aggiunto)
  const [metadataConfig, setMetadataConfig] = useState<MegoMetadataFieldConfig[] | null>(null);

  //Share email
  const [shareEmail, setShareEmail] = useState<ShareEmailOptions | null>(null);

  //Redirect url
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  //Amount of ticket
  const [amountOfTicket, setAmountOfTicket] = useState<number>(1);

  const [popup, setPopup] = useState<MegoPopupData>({
    isOpen: false,
    message: '',
    title: '',
    modality: PopupModality.Info,
    autoCloseTime: 5000
  });

  //Terms and conditions link
  const termsAndConditionsLink = "https://www.iubenda.com/terms-and-conditions/84994680"
  
  const openPopup = (popupData: MegoPopupData) => {
    setPopup(popupData)
  }

  //Reset the entire process for obtain ticket (free & paid scenario)
  const resetPaymentProcessing = () => {
    setStepper(Stepper.Form_data)
    setEventDetails(null)
    setClaimMetadata(null)
    setEmailOfBuyer(null)
    setIsOpen(false)
    setClaimData(null)
    setPaymentsDetails(null)
    setTokenIds(null)
    setProcessor(null)
    setDiscountCode(null)
    setAmountOfTicket(1)
  }

  const restoreClaimProcessing = async () => {
    setIsOpen(true)
    setStepper(Stepper.Claim_Generation)
  }

  const restorePaymentProcessing = async () => {
    setIsOpen(true)
    setStepper(Stepper.Payments)
  }

  //Save all variable for restore process after redirect operations
  const savePendingProcess = (label?: string) => {
    const pendingProcess = {
      eventDetails: JSON.stringify(eventDetails),
      paymentsDetails: JSON.stringify(paymentsDetails),
      stepper: JSON.stringify(stepper),
      claimMetadata: JSON.stringify(claimMetadata),
      emailOfBuyer: JSON.stringify(emailOfBuyer),
      tokenIds: JSON.stringify(tokenIds),
      claimData: JSON.stringify(claimData),
      processor: JSON.stringify(processor)
    }
    localStorage.setItem("pendingProcess", JSON.stringify(pendingProcess))
    //Is variable for understand why the process was suspended
    if(label){
      localStorage.setItem("_func", label)
    }
  }

  //Restore all variable for restore process after redirect operations
  const restorePendingProcess = () => {
    const _pendingProcess = localStorage.getItem("pendingProcess")
    if(_pendingProcess){
      const pendingProcess = JSON.parse(_pendingProcess)
      if(pendingProcess?.eventDetails){
        setEventDetails(JSON.parse(pendingProcess.eventDetails))
      }
      if(pendingProcess?.paymentsDetails){
        setPaymentsDetails(JSON.parse(pendingProcess.paymentsDetails))
      }
      if(pendingProcess?.stepper){
        setStepper(JSON.parse(pendingProcess.stepper))
      }
      if(pendingProcess?.claimMetadata){
        setClaimMetadata(JSON.parse(pendingProcess.claimMetadata))
      }
      if(pendingProcess?.emailOfBuyer){
        setEmailOfBuyer(JSON.parse(pendingProcess.emailOfBuyer))
      }
      if(pendingProcess?.tokenIds){
        setTokenIds(JSON.parse(pendingProcess.tokenIds))
      }
      if(pendingProcess?.claimData){
        setClaimData(JSON.parse(pendingProcess.claimData))
      }
      if(pendingProcess?.processor){
        setProcessor(JSON.parse(pendingProcess.processor))
      }
      localStorage.removeItem("pendingProcess")
      setIsOpen(true) // Re-open the modal for restore process
    }
  } 

  const checkDiscountCode = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const promoCode = urlParams.get('promo');
    if(promoCode && !discountCode){
      setDiscountCode(promoCode)
    }
  }

  //Restore the claim processing started with mego
  useEffect(()=>{
    checkDiscountCode()
    //Restore MP_func from local storage
    const MP_func = localStorage.getItem("MP_func")
    if(MP_func === "claim_processing"){
       restoreClaimProcessing()
    } else if(MP_func === "payment_processing"){  
      restorePaymentProcessing()
    } else {
      cleanMegoPendingClaimProcessing()
    }

    restorePendingProcess()
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
    setClaimData,

    //Payments details
    paymentsDetails,
    setPaymentsDetails,

    //Token id
    tokenIds,
    setTokenIds,

    //Processor
    processor,  
    setProcessor,

    //Restore
    savePendingProcess,
    restorePendingProcess,

    //Discount code
    discountCode,
    setDiscountCode,

    //Terms and conditions link
    termsAndConditionsLink,

    // Metadata Config (Aggiunto)
    metadataConfig,
    setMetadataConfig,

    //Share email
    shareEmail,
    setShareEmail,

    //Redirect url
    redirectUrl,
    setRedirectUrl,

    //Amount of ticket
    amountOfTicket,
    setAmountOfTicket
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
