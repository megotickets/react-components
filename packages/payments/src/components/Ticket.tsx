import React, { useEffect, useState } from 'react';
import { getEventDetails } from '../utils/BuyTicketUtils';
import { formatDate } from '../utils/DateUtils';
import { TicketHeader } from './TicketHeader';
import { TicketPayment } from './TicketPayment';
import { TicketLocation } from './TicketLocation';
import { TicketUserNFT } from './TicketUserNFT';
import { ClaimTicketButton } from './ClaimTicketButton';
import { useLanguage } from '@megotickets/core';
import { MegoMetadataFieldConfig } from '../interfaces/metadata';
import { ShareEmailOptions } from '../interfaces/interface-share-email';
import { useBuyTicketContext } from '@/context/BuyTicketContext';
interface TicketProps {
  ticketId: string;
  showOnlyButton?: boolean;
  overrideButton?: React.ReactNode;
  onTicketLoad?: (data: any) => void;
  metadataConfig?: MegoMetadataFieldConfig[];
  shareEmail?: ShareEmailOptions;
  redirectUrl?: string;
}

export const Ticket: React.FC<TicketProps> = ({ ticketId, showOnlyButton, overrideButton, onTicketLoad, metadataConfig, shareEmail, redirectUrl }) => {
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage()

  const { setShareEmail, setMetadataConfig, setRedirectUrl } = useBuyTicketContext();

  //Sync context with props
  useEffect(() => {
    setShareEmail(shareEmail || null);
    setMetadataConfig(metadataConfig || null);
    setRedirectUrl(redirectUrl || null);
  }, [metadataConfig, shareEmail, redirectUrl]);


  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const details = await getEventDetails(ticketId);
        setEventDetails(details);
        if (onTicketLoad) {
          onTicketLoad(details);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error in retrieving event details:', err);
        setError(t('unableToLoadEventDetails', 'payments'));
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [ticketId, t]);

  if (loading) {
    return (
      <div className="ticket-loading-container">
        <p className="font-satoshi" style={{ color: '#808080' }}>{t('loading', 'payments')}</p>
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
        <p className="font-satoshi">{t('noDetailsAvailableForThisEvent', 'payments')}</p>
      </div>
    );
  }

  const event = eventDetails.event;

  /* console.log('Event Details:', event); */

  const startDate = formatDate(event.timestamp_start);
  const endDate = formatDate(event.timestamp_end);

  const isPriceZero = event.price === 0;
  const priceText = isPriceZero ? 'Free' : `${event.price} ${event.currency.toUpperCase()}`;

  const availableTickets = event.supply - event.minted;
  const supplyText = event.show_supply ? `${availableTickets} / ${event.supply} ${t('availableTickets', 'payments')}` : '';

  if (showOnlyButton) {
    return (
      <div>
        <ClaimTicketButton
          eventDetails={eventDetails}
          buttonText={isPriceZero ? t('claimFreeTicket', 'payments') : t('buyTicket', 'payments')}
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
