import { useEffect, useState } from "react";
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { askPaymentDetails } from "../utils/BuyTicketUtils";
import { useAccount } from "wagmi";
import { Messages } from "../interfaces/messages-enums";
import { Loader } from "@/components/Loader";

export const BuyTicketProcessing = () => {
    const { eventDetails, emailOfBuyer } = useBuyTicketContext()
    const { address } = useAccount()


    const [message, setMessage] = useState<string>('Processing...')

    if (eventDetails?.event?.price !== 0) {
        return (
            <div>
                <h1>Payment</h1>
                <p>Under construction ....</p>
            </div>
        )
    }

    const processing = async () => {
        setMessage('Asking for payment details...')
        const processor = "stripe"
        if (address) {
            const paymentDetails = await askPaymentDetails(
                processor,
                1,
                eventDetails?.event?.identifier,
                address,
                eventDetails?.event?.discount_code || "", // Da capire
                eventDetails?.event?.currency,
                emailOfBuyer || "",
                eventDetails?.event?.donation_amount || 0
            )
            const { message } = paymentDetails
            if (message === Messages.CANT_BUY_MORE_TICKETS) {
                setMessage(Messages.CANT_BUY_MORE_TICKETS)
            }
        } else {
            console.error('Address is undefined');
        }
    }

    useEffect(() => {
        processing()
    }, [])


    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <Loader message={message} />
        </div>
    );
};