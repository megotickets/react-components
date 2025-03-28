import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
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

// Styled components
const TicketContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  background-color: #000000; /* Nero pece */
  color: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const ErrorContainer = styled.div`
  background-color: #FEE2E2;
  border: 1px solid #F87171;
  color: #B91C1C;
  padding: 0.75rem 1rem;
  border-radius: 0.25rem;
  margin: 1rem;
`;

const NoDetailsContainer = styled.div`
  background-color: #FEF3C7;
  border: 1px solid #F59E0B;
  color: #92400E;
  padding: 0.75rem 1rem;
  border-radius: 0.25rem;
  margin: 1rem;
`;

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
      <LoadingContainer>
        <p style={{ color: '#808080' }}>Caricamento in corso...</p>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <p>{error}</p>
      </ErrorContainer>
    );
  }

  if (!eventDetails || !eventDetails.event) {
    return (
      <NoDetailsContainer>
        <p>Nessun dettaglio disponibile per questo evento</p>
      </NoDetailsContainer>
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
    <TicketContainer>
      <TicketHeader
        event={event}
        startDate={startDate}
        endDate={endDate}
      />
      <TicketPayment
        eventDetails={eventDetails}
        isPriceZero={isPriceZero}
        priceText={priceText}
        supplyText={supplyText}
        overrideButton={overrideButton}
      />
      <TicketLocation
        event={event}
      />
      <TicketUserNFT userId={ticketId} eventIdentifier={event.identifier} />
    </TicketContainer>
  );
};
