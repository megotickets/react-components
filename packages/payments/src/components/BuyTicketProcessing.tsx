import { useEffect, useMemo, useState } from "react";
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { askPaymentDetails, cleanMegoPendingClaimProcessing } from "../utils/BuyTicketUtils";
import { useAccount, useLanguage } from '@megotickets/core';
import { Messages } from "../interfaces/messages-enums";
import { Loader } from '@megotickets/core';
import { PopupModality } from "../interfaces/popup-enum";
import { Stepper } from "../interfaces/interface-stepper";
import "../css/pay.css";
import { getLoginDataInfo } from "@/utils/LoginUtils";

export const BuyTicketProcessing = () => {
    const { eventDetails, emailOfBuyer, openPopup, resetPaymentProcessing, setStepper, setPaymentsDetails, processor, discountCode } = useBuyTicketContext()
    const { address } = useAccount()
    const { t } = useLanguage()

    const [message, setMessage] = useState<string>(t('processing', 'payments'))
    let count = 0;

    const processing = async () => {
        try {
            if(!processor){
                openPopup({title: t('alert', 'payments'), message: t('noProcessorSelected', 'payments'), modality: PopupModality.Error, isOpen: true})
                resetPaymentProcessing()
                return
            }
            setMessage(t('askingForPaymentDetails', 'payments'))
            const userAddress = getLoginDataInfo()?.loggedAs || ""
            if (userAddress) {
                const paymentDetails = await askPaymentDetails(processor, 1, eventDetails?.event?.identifier, userAddress, discountCode || "", eventDetails?.event?.currency, emailOfBuyer || "", eventDetails?.event?.donation_amount || 0)
                let { error, message, payment } = paymentDetails

                if (error && message !== Messages.PAYMENT_EXIST) {
                    setMessage(t('errorAskingForPaymentDetails', 'payments'))
                    openPopup({ title: t('alert', 'payments'), message: message, modality: PopupModality.Error, isOpen: true })
                    resetPaymentProcessing()
                    return;
                }

                setPaymentsDetails(paymentDetails)

                //Quit if the user can't buy more tickets
                if (message === Messages.CANT_BUY_MORE_TICKETS) {
                    setMessage(Messages.CANT_BUY_MORE_TICKETS)
                    openPopup({ title: t('alert', 'payments'), message: Messages.CANT_BUY_MORE_TICKETS, modality: PopupModality.Error, isOpen: true })
                    resetPaymentProcessing()
                }

                //Display free ticket (reason: discount code 100% off or free ticket)
                if (eventDetails?.event?.price <= 0 || message === "Free ticket claimed correctly.") {
                    setMessage(t('claimingFreeTicket', 'payments'))
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setStepper(Stepper.NFT_Mint)
                    return;
                } else {
                    setMessage(t('processingPayment', 'payments'))
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    if(processor === 'stripe'){
                        console.log('Stripe processor')
                        setStepper(Stepper.Payments_Stripe)
                    } else {
                        console.log('Other processor')
                        setStepper(Stepper.Payments_crypto)
                    }
                    return;
                }
            } else {
                openPopup({
                    title: t('alert', 'payments'),
                    message: t('pleaseConnectYourWallet', 'payments'),
                    modality: PopupModality.Error,
                    isOpen: true
                })
                resetPaymentProcessing()
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            setMessage(t('errorProcessingPayment', 'payments'))
            openPopup({
                title: t('alert', 'payments'),
                message: t('errorProcessingPayment', 'payments'),
                modality: PopupModality.Error,
                isOpen: true
            })
            cleanMegoPendingClaimProcessing()
            resetPaymentProcessing()
            return;
        }
    }

    useEffect(() => {
        if (count === 0) {
            processing()
            count++
        }
    }, [])


    return (
        <div className="loader">
            <Loader message={message} />
        </div>
    );
};
