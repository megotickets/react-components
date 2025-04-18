import React from 'react';
import { ClaimTicketButton } from './ClaimTicketButton';
import { useLanguage } from '@megotickets/core';
import '../css/pay.css';
import { MegoMetadataFieldConfig } from "../interfaces/metadata";
import { useBuyTicketContext } from '@/context/BuyTicketContext';

interface TicketPaymentProps {
  eventDetails: any;
  isPriceZero: boolean;
  priceText: string;
  supplyText: string;
  overrideButton?: React.ReactNode;
  metadataConfig?: MegoMetadataFieldConfig[];
}


export const TicketPayment: React.FC<TicketPaymentProps> = ({
  eventDetails,
  isPriceZero,
  priceText,
  supplyText,
  overrideButton,
}) => {
  const { t } = useLanguage()
  const { amountOfTicket } = useBuyTicketContext()
  return (
    <div className="ticketPaymentContainer">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="ticketPriceTitle font-satoshi">
            {`${t('price', 'payments')}: ${priceText}`}
          </div>
        </div>
        <ClaimTicketButton
          eventDetails={eventDetails}
          buttonText={isPriceZero ? t('claimFreeTicket', 'payments') : amountOfTicket > 1 ? t('buyTickets', 'payments') : t('buyTicket', 'payments')}
          overrideButton={overrideButton}
        />
      </div>
    </div>
  );
};