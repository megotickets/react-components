import React, { useState } from 'react';
import '../css/pay.css';
import { useLanguage } from '@megotickets/core';
interface MyTicketProps {
  tokenId: string;
  image?: string;
}

export const MyTicket: React.FC<MyTicketProps> = ({ tokenId, image }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage()
  return (
    <div 
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