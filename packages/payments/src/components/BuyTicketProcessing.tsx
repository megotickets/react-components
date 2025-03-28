import { useEffect, useMemo, useState } from "react";
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { askPaymentDetails, cleanMegoPendingClaimProcessing } from "../utils/BuyTicketUtils";
import { useAccount } from '@megotickets/core';
import { Messages } from "../interfaces/messages-enums";
import { Loader } from '@megotickets/core';
import { PopupModality } from "../interfaces/popup-enum";
import { Stepper } from "../interfaces/interface-stepper";
import "../css/pay.css";


export const BuyTicketProcessing = () => {
    const { eventDetails, emailOfBuyer, openPopup, resetPaymentProcessing, setStepper, setPaymentsDetails, processor, discountCode } = useBuyTicketContext()
    const { address } = useAccount()

    const [message, setMessage] = useState<string>('Processing...')
    let count = 0;

    const userAddress = useMemo(() => {
        //Search loggedAs o signedAs nei params dell'url
        const urlParams = new URLSearchParams(window.location.search);
        const loggedAs = urlParams.get('loggedAs');
        const signedAs = urlParams.get('signedAs');
        return address || loggedAs || signedAs || ""
    }, [address, window.location.search])

    const processing = async () => {
        try {
            if(!processor){
                openPopup({title: 'Alert', message: 'No processor selected', modality: PopupModality.Error, isOpen: true})
                resetPaymentProcessing()
                return
            }
            setMessage('Asking for payment details...')
            if (userAddress) {
                const paymentDetails = await askPaymentDetails(processor, 1, eventDetails?.event?.identifier, userAddress, discountCode || "", eventDetails?.event?.currency, emailOfBuyer || "", eventDetails?.event?.donation_amount || 0)
                let { error, message, payment } = paymentDetails

                if (error && message !== Messages.PAYMENT_EXIST) {
                    setMessage('Error asking for payment details...')
                    openPopup({ title: 'Alert', message: message, modality: PopupModality.Error, isOpen: true })
                    resetPaymentProcessing()
                    return;
                }

                setPaymentsDetails(paymentDetails)

                //Quit if the user can't buy more tickets
                if (message === Messages.CANT_BUY_MORE_TICKETS) {
                    setMessage(Messages.CANT_BUY_MORE_TICKETS)
                    openPopup({ title: 'Alert', message: Messages.CANT_BUY_MORE_TICKETS, modality: PopupModality.Error, isOpen: true })
                    resetPaymentProcessing()
                }

                //Display free ticket (reason: discount code 100% off or free ticket)
                if (eventDetails?.event?.price <= 0 || message === "Free ticket claimed correctly.") {
                    setMessage('Claiming free ticket...')
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setStepper(Stepper.NFT_Mint)
                    return;
                } else {
                    setMessage('Processing payment...')
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
                    title: 'Alert',
                    message: 'Please connect your wallet',
                    modality: PopupModality.Error,
                    isOpen: true
                })
                resetPaymentProcessing()
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            setMessage('Error processing payment...')
            openPopup({
                title: 'Alert',
                message: 'Error processing payment...',
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
