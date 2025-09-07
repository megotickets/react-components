import React from "react";
import { Ticket } from "@megotickets/payments";
import { CustomTicket } from "../CustomTicket";
export function PaymentPreview() {
  return (
    <div className="flex flex-col gap-4 lg:p-4 justify-center items-center">
      <h2 className="text-xl font-bold mb-4">Lista degli eventi</h2>
      <div className="flex flex-col gap-4 max-w-[1000px] w-full">
        <CustomTicket
          title="Spaghetteth Associate"
          description="Test associazione"
        />

        <Ticket
          showLocation={false}
          showUserNFT={false}
          showPayment={false}
          ticketId={
            process.env.NEXT_PUBLIC_TICKET_ID ??
            "6f057f40-0cb5-42bb-b068-77e7b5fa4ed2"
          }
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        />
      </div>
    </div>
  );
}
