import React, { useState } from 'react';
import { PaymentModal, PaymentStatusModal } from '@megotickets/wallet';


export function PaymentPreview() {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const handlePaymentComplete = (paymentId: string) => {
        console.log("Pagamento completato con ID:", paymentId);
        // Qui puoi gestire il completamento del pagamento
    };

    return (
        <div className='flex flex-col gap-4 border border-gray-300 rounded-md p-4'>
            <h2>Test dei pagamenti</h2>
            <div className='flex flex-col gap-4'>
    
                <div className='flex flex-col sm:flex-row items-start justify-between'>
                    <div className='flex items-center md:items-start flex-col sm:items-center sm:flex-row gap-4 w-full'>
                        <img src="https://chinam.com.hk/media/catalog/product/placeholder/default/Product-Image-Coming-Soon.png" alt="Prodotto" className='w-16 h-16 object-cover rounded-full mb-4'/>
                        <div>
                            <h3 className='text-lg font-bold'>Prodotto di esempio</h3>
                            <p className='text-sm text-white-600'>50€</p>
                        </div>
                    </div>
                    <div className='w-full sm:w-auto'>
                        <button
                            className='bg-blue-500 text-white px-4 py-2 rounded-md mt-4 w-full'
                            onClick={() => setIsPaymentModalOpen(true)}>
                            Acquista di esempio
                        </button>
                    </div>
                </div>

                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    amount={50}
                    image="https://chinam.com.hk/media/catalog/product/placeholder/default/Product-Image-Coming-Soon.png"
                    itemName="Abbonamento Premium"
                    onPaymentComplete={handlePaymentComplete}
                    stripePublicKey={`pk_test_51QxVkcEbY9GFNTL1No0XY30bI0XmTkrTe86m1rcvJsrbA4TtoBjJpe4QbxVNEosIlaqnXwf4kYMzd4pQSfrnzJfq00rCdi9una`}
                    priceId="price_1QxW5jEbY9GFNTL1E2u3VPUl"
                    paymentModality={{
                        allowStripe: true,
                        allowMetamask: false,
                        allowErc20: false
                    }}
                />
                <PaymentStatusModal/>
            </div>
        </div>
    );
}
