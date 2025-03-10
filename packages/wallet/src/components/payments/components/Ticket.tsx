import React, { useEffect, useState } from 'react';
import { ClaimTicketButton } from './ClaimTicketButton';
import { getEventDetails } from '../utils/BuyTicketUtils';

interface TicketProps {
  ticketId: string;
}

export const Ticket: React.FC<TicketProps> = ({ ticketId }) => {
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const details = await getEventDetails(ticketId);
        setEventDetails(details);
        setLoading(false);
      } catch (err) {
        console.error('Errore nel recupero dei dettagli dell\'evento:', err);
        setError('Impossibile caricare i dettagli dell\'evento');
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [ticketId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <p>Caricamento in corso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        backgroundColor: '#FEE2E2', 
        border: '1px solid #F87171', 
        color: '#B91C1C', 
        padding: '0.75rem 1rem', 
        borderRadius: '0.25rem' 
      }}>
        <p>{error}</p>
      </div>
    );
  }

  if (!eventDetails || !eventDetails.event) {
    return (
      <div style={{ 
        backgroundColor: '#FEF3C7', 
        border: '1px solid #F59E0B', 
        color: '#92400E', 
        padding: '0.75rem 1rem', 
        borderRadius: '0.25rem' 
      }}>
        <p>Nessun dettaglio disponibile per questo evento</p>
      </div>
    );
  }

  const event = eventDetails.event;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    
    // Formattazione manuale della data in italiano
    const giorno = date.getDate().toString().padStart(2, '0');
    const mesi = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
    const mese = mesi[date.getMonth()];
    const anno = date.getFullYear();
    const ore = date.getHours().toString().padStart(2, '0');
    const minuti = date.getMinutes().toString().padStart(2, '0');
    
    return `${giorno} ${mese} ${anno}, ${ore}:${minuti}`;
  };

  const startDate = formatDate(event.timestamp_start);
  const endDate = formatDate(event.timestamp_end);
  
  const isPriceZero = event.price === 0;
  const priceText = isPriceZero ? 'Gratuito' : `${event.price} ${event.currency.toUpperCase()}`;
  
  const availableTickets = event.supply - event.minted;
  const supplyText = event.show_supply ? `${availableTickets} / ${event.supply} ticket disponibili` : '';

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      borderRadius: '0.5rem', 
      overflow: 'hidden', 
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', 
      backgroundColor: 'white', 
      padding: '2rem' 
    }}>
      {/* Banner dell'evento */}
      <p style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#000' }}>Prezzo: {priceText}</p>
      <div style={{ position: 'relative', width: '100%', height: '12rem' }}>
        <img
          src={event.banner || event.image}
          alt={event.event_name}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
      
      {/* Contenuto principale */}
      <div style={{ padding: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{event.event_name}</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem', color: '#6B7280' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span style={{ color: '#4B5563' }}>{event.event_location}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.25rem', width: '1.25rem', marginRight: '0.5rem', color: '#6B7280' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div style={{ color: '#4B5563' }}>
            <div>Inizio: {startDate}</div>
            <div>Fine: {endDate}</div>
          </div>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.25rem' }}>Descrizione:</div>
          <div dangerouslySetInnerHTML={{ __html: event.event_description }} style={{ color: '#4B5563' }} />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{priceText}</div>
          {event.show_supply && (
            <div style={{ fontSize: '0.875rem', color: '#4B5563' }}>{supplyText}</div>
          )}
        </div>
        
        {/* Tipo di evento */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ 
            display: 'inline-block', 
            backgroundColor: '#DBEAFE', 
            color: '#1E40AF', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '9999px', 
            fontSize: '0.875rem', 
            fontWeight: '600' 
          }}>
            {event.event_type === 'physical' ? 'Evento Fisico' : 'Evento Virtuale'}
          </span>
          
          <span style={{ 
            display: 'inline-block', 
            marginLeft: '0.5rem', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '9999px', 
            fontSize: '0.875rem', 
            fontWeight: '600',
            backgroundColor: event.event_status === 'active' ? '#D1FAE5' : '#FEE2E2',
            color: event.event_status === 'active' ? '#065F46' : '#B91C1C'
          }}>
            {event.event_status === 'active' ? 'Attivo' : 'Non attivo'}
          </span>
        </div>
        
        {/* Pulsante di acquisto */}
        <div style={{ marginTop: '1rem' }}>
          <ClaimTicketButton 
            eventDetails={eventDetails}
            buttonText={isPriceZero ? "Riscatta Biglietto" : "Acquista Biglietto"}
          />
        </div>
      </div>
    </div>
  );
};
