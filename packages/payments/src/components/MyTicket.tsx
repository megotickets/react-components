import React, { useState } from 'react';
import '../css/pay.css';
import { signMessage, useLanguage } from '@megotickets/core';
import { createClaim } from '@/utils/BuyTicketUtils';
import { getLoginDataInfo } from '@/utils/LoginUtils';
import { useBuyTicketContext } from '@/context/BuyTicketContext';
import { Stepper } from '@/interfaces/interface-stepper';
interface MyTicketProps {
  tokenId: string;
  image?: string;
  nft?: any;
}

export const MyTicket: React.FC<MyTicketProps> = ({ tokenId, image, nft }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage()

  const { email, tier, customMetadata : claim_metadata } = nft.claim
  const { setEventDetails, setEmailOfBuyer, setClaimMetadata, setTokenIds, setAmountOfTicket, setIsOpen, setStepper } = useBuyTicketContext()


  const signAndClaimToken = async () => {
    // 1. Set partial info inside useBuyTicketContext
    setEventDetails({event: {identifier: tier}})
    setEmailOfBuyer(email)
    setClaimMetadata(claim_metadata)
    setTokenIds([tokenId])
    setAmountOfTicket(1)
    setStepper(Stepper.Claim_Generation)

    //Open the modal
    setIsOpen(true)
  }

  return (
    <div 
      onClick={signAndClaimToken}
      className="ticket-token-id-root"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="ticket-token-id-container font-satoshi"
      >
        #{tokenId}
      </div>
      <img 
        src={image} 
        alt={`${t('ticket', 'payments')} #${tokenId}`} 
        className="ticket-image"
      />
    </div>
  );
}; 


/*
{
    "signature": "0x8687c2e65451da309f074cdc7caf50fbe44920c346bda04d2240724ecbb57c947a4da5a816f4e4c21f2d1435d07742b88266d5658c10fe1762cceefa76f73e051c",
    "tokenId": "3552", (V)
    "email": "vincenzo.brunale@gmail.com", (V)
    "tier": "0xaF81EBE3e7_252716", (v)
    "address": "0x9A55e9ab73B4e2f0F14F5196dD07F4A0D5Fa7fF7", (v)
    "challenge": "Claiming token 3552", (v)
    "acceptNotification": true, (v)
    "claim_metadata": {
        "0": "Vincenzo Brunale",
        "1": "Yomi",
        "2": ""
    }, (v)
    "language": "it" (v)
}
*/