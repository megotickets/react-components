import { Ticket } from "@megotickets/payments";
import React from "react";

interface CustomTicketProps {
  imageUrl?: string;
  title?: string;
  description?: string;
}

export const CustomTicket: React.FC<CustomTicketProps> = ({
  imageUrl = "https://picsum.photos/400/200",
  title = "Nome Evento",
  description = "Descrizione dell'evento. Questo è un esempio di testo descrittivo che potrebbe essere più lungo e contenere dettagli importanti sull'evento.",
}) => {
  return (
    <div className="bg-blue-50 p-4 rounded-xl mb-4 w-full">
      <img src={imageUrl} alt="Evento" className="w-full rounded-lg mb-4" />
      <h3 className="text-blue-900 text-xl font-semibold mb-2">{title}</h3>
      <p className="text-blue-700 text-sm leading-relaxed">{description}</p>
      <Ticket
        ticketId={
          process.env.NEXT_PUBLIC_TICKET_ID ??
          "6f057f40-0cb5-42bb-b068-77e7b5fa4ed2"
        }
        showOnlyButton={true}
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        overrideButton={
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Ottieni
          </button>
        }
      />
    </div>
  );
};

export const customJSX = <CustomTicket />;
