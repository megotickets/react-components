import React from 'react';
import { Ticket } from '@megotickets/payments';
import { CustomTicket } from '../CustomTicket';
export function PaymentPreview() {


    return (
        <div className='flex flex-col gap-4 lg:p-4 justify-center items-center'>
            <h2 className='text-xl font-bold mb-4'>Lista degli eventi</h2>
            <div className='flex flex-col gap-4 max-w-[1000px] w-full'>
                <CustomTicket
                    title='Spaghetteth Associate'
                    description='Test associazione'
                />

                <Ticket
                    ticketId='f8e4bc90-aaf3-42ba-a9c3-514af7131c4a'
                />

                {
                    /* 
                    <Ticket ticketId='b5af9d49-d865-4238-a4e3-9dc48ed280d0' />
                    <Ticket ticketId='61770ee4-f170-468f-8074-59fb4ca88912' /> 
                    */
                }
            </div>
        </div>
    );
}
