import React, { useEffect, useState } from 'react';
import { getEventDetails } from '../utils/BuyTicketUtils';
import { formatDate } from '../utils/DateUtils';
import { TicketHeader } from './TicketHeader';
import { TicketPayment } from './TicketPayment';
import { TicketLocation } from './TicketLocation';
import { TicketUserNFT } from './TicketUserNFT';
import { ClaimTicketButton } from './ClaimTicketButton';

interface TicketProps {
  ticketId: string;
  showOnlyButton?: boolean;
  overrideButton?: React.ReactNode;
}

export const Ticket: React.FC<TicketProps> = ({ ticketId, showOnlyButton, overrideButton }) => {
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
        <p style={{ color: '#808080' }}>Caricamento in corso...</p>
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
        borderRadius: '0.25rem',
        margin: '1rem'
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
        borderRadius: '0.25rem',
        margin: '1rem'
      }}>
        <p>Nessun dettaglio disponibile per questo evento</p>
      </div>
    );
  }

  const event = eventDetails.event;

  console.log('Event Details:', event);

  const startDate = formatDate(event.timestamp_start);
  const endDate = formatDate(event.timestamp_end);

  const isPriceZero = event.price === 0;
  const priceText = isPriceZero ? 'Gratuito' : `${event.price} ${event.currency.toUpperCase()}`;

  const availableTickets = event.supply - event.minted;
  const supplyText = event.show_supply ? `${availableTickets} / ${event.supply} ticket disponibili` : '';

  if (showOnlyButton) {
    return (
      <div>
        <ClaimTicketButton
          eventDetails={eventDetails}
          buttonText={isPriceZero ? "Claim Free Ticket" : "Buy Ticket"}
          overrideButton={overrideButton}
        />
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      margin: '0 auto',
      backgroundColor: '#121212',
      color: '#fff',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    }}>
      {/* Header Section with Banner and Event Info */}
      <TicketHeader
        event={event}
        startDate={startDate}
        endDate={endDate}
      />

      {/* Price and Buy Button Section */}
      <TicketPayment
        eventDetails={eventDetails}
        isPriceZero={isPriceZero}
        priceText={priceText}
        supplyText={supplyText}
        overrideButton={overrideButton}
      />

      {/* Event Location and Details Section */}
      <TicketLocation
        event={event}
      />

      {/* User's NFT Tickets Section (at the bottom) */}
      <TicketUserNFT userId={ticketId} eventIdentifier={event.identifier} />
    </div>
  );
};
