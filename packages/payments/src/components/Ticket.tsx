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
      <div className="ticket-loading-container">
        <p className="font-satoshi" style={{ color: '#808080' }}>Caricamento in corso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ticket-error-container">
        <p className="font-satoshi">{error}</p>
      </div>
    );
  }

  if (!eventDetails || !eventDetails.event) {
    return (
      <div className="ticket-details-container">
        <p className="font-satoshi">Nessun dettaglio disponibile per questo evento</p>
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
    <div className="ticket-container">
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
    </div>
  );
};
