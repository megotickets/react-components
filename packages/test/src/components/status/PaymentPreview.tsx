import React from 'react';
import { Ticket } from '@megotickets/payments';

export function PaymentPreview() {

    return (
        <div className='flex flex-col gap-4 p-4'>
            <h2 className='text-xl font-bold mb-4'>Dettagli Evento</h2>
            <Ticket ticketId='694b4ce9-9f0c-4756-8dcb-ad0889078da6' />
            <Ticket ticketId='f8e4bc90-aaf3-42ba-a9c3-514af7131c4a' />
        </div>
    );
}
