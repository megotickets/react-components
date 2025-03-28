import React, {useMemo} from 'react';
import styled from 'styled-components';

interface TicketHeaderProps {
  event: any;
  startDate: string;
  endDate: string;
}

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  padding: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Banner = styled.div`
  width: 50%;
  height: 300px;
  overflow: hidden;
  border-radius: 12px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #000;

  @media (max-width: 768px) {
    width: 100%;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    
  }
`;

const InfoSection = styled.div`
  padding: 1.5rem;
  width: 50%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const TicketHeader: React.FC<TicketHeaderProps> = ({ 
  event,
  startDate,
  endDate
}) => {


  return (
    <div>
      {/* Event Banner and Info Section */}
      <Container>
        <Banner>
          <img
            src={event.banner || event.image}
            alt={event.event_name}
          />
        </Banner>
        
        <InfoSection>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem',
            color: '#fff'
          }}>{event.event_name}</h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Event Date and Time */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.75rem', color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span style={{ color: '#E5E7EB', fontSize: '0.9rem' }}>{startDate} - {endDate}</span>
            </div>
            
            {/* Event Location */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.75rem', color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span style={{ color: '#E5E7EB', fontSize: '0.9rem' }}>{event.event_location}</span>
            </div>
            
            {/* Blockchain Network */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.75rem', color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span style={{ color: '#E5E7EB', fontSize: '0.9rem' }}>Network: {event.blockchain || 'Polygon'}</span>
            </div>
            
            {/* Hosted By */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.75rem', color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span style={{ color: '#E5E7EB', fontSize: '0.9rem' }}>Hosted by: {event?.event_owner ? `${event.event_owner.slice(0,4)}...${event.event_owner.slice(-4)}` : "Event organizer"}</span>
            </div>
            
            {/* Minted Info */}
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.75rem', color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: '500' }}>Minted: </span>
                <span>{event.minted || 0} / {event.supply || 0}</span>
              </div>
            </div>
          </div>
        </InfoSection>
      </Container>
    </div>
  );
};