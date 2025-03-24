import React, { useState } from 'react';

interface MyTicketProps {
  tokenId: string;
  image?: string;
}

export const MyTicket: React.FC<MyTicketProps> = ({ tokenId, image }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{ 
        position: 'relative',
        margin: '0.5rem',
        width: '250px',
        height: '250px',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '5px 10px',
          borderRadius: '4px',
          color: 'white',
          fontWeight: 'bold',
          zIndex: 1
        }}
      >
        #{tokenId}
      </div>
      <img 
        src={image} 
        alt={`Ticket #${tokenId}`} 
        style={{ 
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.3s ease-in-out'
        }}
      />
    </div>
  );
}; 