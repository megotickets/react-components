import React, { useState } from 'react';
import '../css/pay.css';
interface MyTicketProps {
  tokenId: string;
  image?: string;
}

export const MyTicket: React.FC<MyTicketProps> = ({ tokenId, image }) => {
  const [isHovered, setIsHovered] = useState(false);

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
        alt={`Ticket #${tokenId}`} 
        className="ticket-image"
      />
    </div>
  );
}; 