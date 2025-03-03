import React, { useState } from 'react';
import { PaymentModal, PaymentStatusModal } from '@megotickets/wallet';


export function PaymentPreview() {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const handlePaymentComplete = (paymentId: string) => {
        console.log("Pagamento completato con ID:", paymentId);
        // Qui puoi gestire il completamento del pagamento
    };

    return (
        <div>
            <h1>Test dei pagamenti</h1>
            <div className='flex flex-col gap-4'>
                <button
                    className='bg-blue-500 text-white px-4 py-2 rounded-md'
                    onClick={() => setIsPaymentModalOpen(true)}>
                    Acquista cubo
                </button>

                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    amount={50}
                    image="https://chinam.com.hk/media/catalog/product/placeholder/default/Product-Image-Coming-Soon.png"
                    itemName="Abbonamento Premium"
                    onPaymentComplete={handlePaymentComplete}
                    stripePublicKey={`pk_test_51QxVkcEbY9GFNTL1No0XY30bI0XmTkrTe86m1rcvJsrbA4TtoBjJpe4QbxVNEosIlaqnXwf4kYMzd4pQSfrnzJfq00rCdi9una`}
                    priceId="price_1QxW5jEbY9GFNTL1E2u3VPUl"
                />
                <PaymentStatusModal/>
            </div>
        </div>
    );
}
