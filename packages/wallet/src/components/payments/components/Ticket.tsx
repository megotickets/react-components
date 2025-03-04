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
      <div className="flex justify-center items-center p-8">
        <p>Caricamento in corso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (!eventDetails || !eventDetails.event) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
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
    <div className="flex flex-col rounded-lg overflow-hidden shadow-lg bg-white p-8">
      {/* Banner dell'evento */}
      <div className="relative w-full h-48">
        <img
          src={event.banner || event.image}
          alt={event.event_name}
          className="w-full h-full"
          style={{ objectFit: 'contain' }}
        />
      </div>
      
      {/* Contenuto principale */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">{event.event_name}</h1>
        
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-gray-700">{event.event_location}</span>
        </div>
        
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div className="text-gray-700">
            <div>Inizio: {startDate}</div>
            <div>Fine: {endDate}</div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="font-semibold text-lg mb-1">Descrizione:</div>
          <div dangerouslySetInnerHTML={{ __html: event.event_description }} className="text-gray-700" />
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="text-xl font-bold">{priceText}</div>
          {event.show_supply && (
            <div className="text-sm text-gray-600">{supplyText}</div>
          )}
        </div>
        
        {/* Tipo di evento */}
        <div className="mb-6">
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {event.event_type === 'physical' ? 'Evento Fisico' : 'Evento Virtuale'}
          </span>
          
          <span className={`inline-block ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
            event.event_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {event.event_status === 'active' ? 'Attivo' : 'Non attivo'}
          </span>
        </div>
        
        {/* Pulsante di acquisto */}
        <div className="mt-4">
          <ClaimTicketButton 
            eventDetails={eventDetails}
            buttonText={isPriceZero ? "Riscatta Biglietto" : "Acquista Biglietto"}
          />
        </div>
      </div>
    </div>
  );
};
