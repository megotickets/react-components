import React, { useMemo } from 'react';
import '../css/pay.css'; // Importa il CSS
import { MegoButton, useLanguage } from '@megotickets/core';
import { useBuyTicketContext } from '@/context/BuyTicketContext';
import { Stepper } from '@/interfaces/interface-stepper';

const BuyTicketSummary: React.FC = () => {
    const { setStepper, amountOfTicket, resetPaymentProcessing, paymentsDetails } = useBuyTicketContext();
    console.log('paymentsDetails', paymentsDetails);

    const finalAmount = useMemo(() => {
        return paymentsDetails?.payment?.amount ?? 0;
    }, [paymentsDetails?.payment?.amount]);

    const currency = useMemo(() => {
        return paymentsDetails?.payment?.stripePayment?.currency?.toUpperCase() ?? 'EUR';
    }, [paymentsDetails?.payment?.stripePayment?.currency]);

    const discount = useMemo(() => {
        try {
            const discountValue = paymentsDetails?.payment?.discount || paymentsDetails?.discount;
            if (!discountValue || discountValue === 'NONE') {
                return 0;
            }
            const parsedDiscount = parseFloat(discountValue);
            return isNaN(parsedDiscount) ? 0 : parsedDiscount;
        } catch (error) {
            console.error('Errore nel calcolo dello sconto:', error);
            return 0;
        }
    }, [paymentsDetails?.payment?.discount]);

    const subtotal = useMemo(() => {
        return finalAmount + discount;
    }, [finalAmount, discount]);

    const { t } = useLanguage();

    const handleCheckout = () => {
        setStepper(Stepper.Payments_Stripe)
    };
    const handleCancel = () => {
        localStorage.removeItem("_func");
        resetPaymentProcessing();
    }

    return (
        <div className="payment-stepper-stripe" style={{ flexGrow: 1 }}>
            <div className="ticket-summary-container">
                <h3 className="ticket-summary-title">{t('summary', 'payments')}</h3>
                <div className="ticket-summary-row">
                    <span className="ticket-summary-label">{t('ticketQuantity', 'payments')}:</span>
                    <span className="ticket-summary-value">{amountOfTicket}</span>
                </div>
                <div className="ticket-summary-row">
                    <span className="ticket-summary-label">{t('subtotal', 'payments')}:</span>
                    <span className="ticket-summary-value">{subtotal.toFixed(2)} {currency}</span>
                </div>
                {discount > 0 ? (
                    <div className="ticket-summary-row ticket-summary-discount">
                        <span className="ticket-summary-label">{t('discount', 'payments')}:</span>
                        <span className="ticket-summary-value">- {discount.toFixed(2)} {currency}</span>
                    </div>
                ) : <span className="ticket-summary-no-discount">{t('noAppliedDiscount', 'payments')}</span>}
                <hr className="ticket-summary-divider" />
                <div className="ticket-summary-row ticket-summary-total">
                    <span className="ticket-summary-label">{t('totalToPay', 'payments')}:</span>
                    <span className="ticket-summary-value">{finalAmount.toFixed(2)} {currency}</span>
                </div>
            </div>
            <div className="chooseType-btn-container">
                <MegoButton
                    onClick={handleCheckout}
                    className="font-satoshi chooseType-btn cancel-btn"
                >
                    {t('checkout', 'payments')}
                </MegoButton>
            </div>
            <div className="chooseType-btn-container">
                <MegoButton
                    onClick={handleCancel}
                    className="font-satoshi chooseType-btn cancel-btn"
                >
                    {t('cancelOperation', 'payments')}
                </MegoButton>

            </div>
        </div>
    );
};

export default BuyTicketSummary; 