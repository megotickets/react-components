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
import { TicketCustomStyle } from '../interfaces/TicketCustomStyle';
interface TicketProps {
  ticketId: string;
  showOnlyButton?: boolean;
  overrideButton?: React.ReactNode;
  onTicketLoad?: (data: any) => void;
  metadataConfig?: MegoMetadataFieldConfig[];
  shareEmail?: ShareEmailOptions;
  redirectUrl?: string;
  googleMapsApiKey?: string;
  showHeader?: boolean;
  showPayment?: boolean;
  showLocation?: boolean;
  showUserNFT?: boolean;
  customStyle?: TicketCustomStyle;
  customButtonText?: string;
}

export const Ticket: React.FC<TicketProps> = ({ 
  ticketId, 
  showOnlyButton, 
  overrideButton, 
  onTicketLoad, 
  metadataConfig, 
  shareEmail, 
  redirectUrl, 
  googleMapsApiKey,
  showHeader = true,
  showPayment = true,
  showLocation = true,
  showUserNFT = true,
  customStyle,
  customButtonText  
}) => {
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage()

  const { setShareEmail, setMetadataConfig, setRedirectUrl, amountOfTicket } = useBuyTicketContext();

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
          buttonText={isPriceZero ? t('claimFreeTicket', 'payments') : amountOfTicket > 1 ? t('buyTickets', 'payments') : t('buyTicket', 'payments')}
          overrideButton={overrideButton}
        />
      </div>
    )
  }

  return (
    <div 
      className="ticket-container"
    >
      {showHeader && (
        <TicketHeader
          event={event}
          startDate={startDate}
          endDate={endDate}
          customStyle={customStyle}
        />
      )}
      {showPayment && (
        <TicketPayment
          eventDetails={eventDetails}
          isPriceZero={isPriceZero}
          priceText={priceText}
          supplyText={supplyText}
          overrideButton={overrideButton}
          customStyle={customStyle}
          customButtonText={customButtonText}
        />
      )}
      {showLocation && (
        <TicketLocation
          event={event}
          googleMapsApiKey={googleMapsApiKey}
          customStyle={customStyle}
        />
      )}
      {showUserNFT && (
        <TicketUserNFT 
          userId={ticketId} 
          eventIdentifier={event.identifier} 
          customStyle={customStyle}
        />
      )}
    </div>
  );
};
