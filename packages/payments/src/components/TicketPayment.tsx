import React from 'react';
import { ClaimTicketButton } from './ClaimTicketButton';

interface TicketPaymentProps {
  eventDetails: any;
  isPriceZero: boolean;
  priceText: string;
  supplyText: string;
}

export const TicketPayment: React.FC<TicketPaymentProps> = ({ 
  eventDetails, 
  isPriceZero, 
  priceText, 
  supplyText 
}) => {
  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#1E1E1E', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: '#9CA3AF', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Ticket Price</div>
          <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '700' }}>{priceText}</div>
        </div>
        <ClaimTicketButton 
          eventDetails={eventDetails}
          buttonText={isPriceZero ? "Claim Free Ticket" : "Buy Ticket"}
        />
      </div>
    </div>
  );
};