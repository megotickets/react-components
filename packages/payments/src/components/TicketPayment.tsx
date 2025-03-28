import React from 'react';
import { ClaimTicketButton } from './ClaimTicketButton';

import '../css/pay.css';
interface TicketPaymentProps {
  eventDetails: any;
  isPriceZero: boolean;
  priceText: string;
  supplyText: string;
  overrideButton?: React.ReactNode;
}


export const TicketPayment: React.FC<TicketPaymentProps> = ({
  eventDetails,
  isPriceZero,
  priceText,
  supplyText,
  overrideButton
}) => {
  return (
    <div className="ticketPaymentContainer">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="ticketPriceTitle font-satoshi">
            {`Price: ${priceText}`}
          </div>
        </div>
        <ClaimTicketButton
          eventDetails={eventDetails}
          buttonText={isPriceZero ? "Claim Free Ticket" : "Buy Ticket"}
          overrideButton={overrideButton}
        />
      </div>
    </div>
  );
};