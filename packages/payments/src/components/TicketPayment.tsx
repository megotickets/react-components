import React from 'react';
import { ClaimTicketButton } from './ClaimTicketButton';
import { useLanguage } from '@megotickets/core';
import '../css/pay.css';
import { MegoMetadataFieldConfig } from "../interfaces/metadata";
import { useBuyTicketContext } from '@/context/BuyTicketContext';
import { TicketCustomStyle } from '../interfaces/TicketCustomStyle';

interface TicketPaymentProps {
  eventDetails: any;
  isPriceZero: boolean;
  priceText: string;
  supplyText: string;
  overrideButton?: React.ReactNode;
  metadataConfig?: MegoMetadataFieldConfig[];
  customStyle?: TicketCustomStyle;
  customButtonText?: string;
}


export const TicketPayment: React.FC<TicketPaymentProps> = ({
  eventDetails,
  isPriceZero,
  priceText,
  supplyText,
  overrideButton,
  customStyle,
  customButtonText,
}) => {
  const { t } = useLanguage()
  const { amountOfTicket } = useBuyTicketContext()
  return (
    <div 
      className="ticketPaymentContainer"
      style={{
        backgroundColor: customStyle?.paymentBackgroundColor,
        ...customStyle?.paymentContainerStyle
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div 
            className="ticketPriceTitle font-satoshi"
            style={{
              color: customStyle?.primaryTextColor || customStyle?.priceStyle?.color,
              ...customStyle?.priceStyle
            }}
          >
            {`${t('price', 'payments')}: ${priceText}`}
          </div>
        </div>
        <ClaimTicketButton
          eventDetails={eventDetails}
          buttonText={customButtonText || (isPriceZero ? t('claimFreeTicket', 'payments') : amountOfTicket > 1 ? t('buyTickets', 'payments') : t('buyTicket', 'payments'))}
          overrideButton={overrideButton}
          customStyle={customStyle}
        />
      </div>
    </div>
  );
};