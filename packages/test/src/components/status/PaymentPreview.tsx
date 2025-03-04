import React, { useEffect, useState } from 'react';
import { Ticket } from '@megotickets/wallet';

export function PaymentPreview() {

    return (
        <div className='flex flex-col gap-4 p-4'>
            <h2 className='text-xl font-bold mb-4'>Dettagli Evento</h2>
            <Ticket ticketId='694b4ce9-9f0c-4756-8dcb-ad0889078da6' />
        </div>
    );
}
