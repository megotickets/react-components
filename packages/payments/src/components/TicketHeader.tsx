import React, {useMemo} from 'react';
import "../css/pay.css";
import { useLanguage } from '@megotickets/core';
interface TicketHeaderProps {
  event: any;
  startDate: string;
  endDate: string;
}


export const TicketHeader: React.FC<TicketHeaderProps> = ({ 
  event,
  startDate,
  endDate
}) => {
  const { t } = useLanguage()

  return (
    <div>
      {/* Event Banner and Info Section */}
      <div className="ticker-header-container">
        <div className="ticket-banner-container">
          <img
            src={event.banner || event.image}
            alt={event.event_name}
          />
        </div>
        
        <div className="ticket-info-container">
            <h1 className="ticket-event-name font-satoshi">{event.event_name}</h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Event Date and Time */}
            <div className="ticket-event-date-container font-satoshi">
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.75rem', color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-satoshi" style={{ color: '#E5E7EB', fontSize: '0.9rem' }}>{startDate} - {endDate}</span>
            </div>
            
            {/* Event Location */}
            {event.event_location && (
            <div className="ticket-event-location-container font-satoshi">
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.75rem', color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-satoshi" style={{ color: '#E5E7EB', fontSize: '0.9rem' }}>{event.event_location}</span>
            </div>
            )}
            
            {/* Blockchain Network */}
            <div className="ticket-event-blockchain-container font-satoshi">
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.75rem', color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-satoshi" style={{ color: '#E5E7EB', fontSize: '0.9rem' }}>{t('blockchainNetwork', 'payments')}: {event.network?.toUpperCase() || 'Polygon'}</span>
            </div>
            
            {/* Hosted By */}
            <div className="ticket-event-hosted-by-container font-satoshi">
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.75rem', color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-satoshi" style={{ color: '#E5E7EB', fontSize: '0.9rem' }}>{t('hostedBy', 'payments')}: {event?.event_owner ? `${event.event_owner.slice(0,4)}...${event.event_owner.slice(-4)}` : t('eventOrganizer', 'payments')}</span>
            </div>
            
            {/* Minted Info */}
            <div className="ticket-event-minted-info-container font-satoshi">
              <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.75rem', color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="font-satoshi" style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: '500' }}>{t('minted', 'payments')}: </span>
                <span>{event.minted || 0} / {event.supply || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};