import React from 'react';

interface TicketUserNFTProps {
  // This component is a placeholder for now, so we'll keep the props minimal
  userId?: string;
}

export const TicketUserNFT: React.FC<TicketUserNFTProps> = ({ userId }) => {
  return (
    <div style={{ 
      padding: '2rem',
      backgroundColor: '#1A1A1A',
      borderRadius: '0.5rem',
      margin: '1rem 0'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '1rem' 
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.75rem', color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <div style={{ color: '#9CA3AF', fontSize: '1rem', fontWeight: '600' }}>My Tickets</div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '3rem',
        backgroundColor: '#121212',
        borderRadius: '0.375rem',
        border: '1px dashed #333'
      }}>
        <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>No tickets available yet</p>
      </div>
    </div>
  );
};