import { useEffect, useState } from "react";
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { askPaymentDetails, createClaim, getMegoPendingClaimProcessingData, cleanMegoPendingClaimProcessing } from "../utils/BuyTicketUtils";
import { useAccount } from "wagmi";
import { Messages } from "../interfaces/messages-enums";
import { Loader } from "@/components/Loader";
import { PopupModality } from "../interfaces/popup-enum";
import { Stepper } from "../interfaces/interface-stepper";
import { useWeb3Context } from "@/components/web3-context";


export const BuyTicketProcessing = () => {
    const { eventDetails, emailOfBuyer, openPopup, resetPaymentProcessing, claimMetadata, setStepper, setClaimData, setPaymentsDetails } = useBuyTicketContext()
    const { address } = useAccount()
    const { loggedAs, isConnectedWithMego, provider, signMessageWithGoogle, signMessageWithApple } = useWeb3Context()

    const [message, setMessage] = useState<string>('Processing...')
    let count = 0;

    const processing = async () => {
        try {
            setMessage('Asking for payment details...')
            const processor = "stripe"
            const userAddress = address || loggedAs || ""
            if (userAddress) {
                const paymentDetails = await askPaymentDetails(processor, 1, eventDetails?.event?.identifier, userAddress, eventDetails?.event?.discount_code || "", eventDetails?.event?.currency, emailOfBuyer || "", eventDetails?.event?.donation_amount || 0)
                let { error, message, payment } = paymentDetails

                if (error) {
                    setMessage('Error asking for payment details...')
                    openPopup({ title: 'Alert', message: 'Error asking for payment details...', modality: PopupModality.Error, isOpen: true })
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

                //Display free ticket or payment message
                if (eventDetails?.event?.price <= 0) {
                    setMessage('Claiming free ticket...')
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setStepper(Stepper.NFT_Mint)
                    return;
                } else {
                    setMessage('Processing payment...')
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setStepper(Stepper.Payments)
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

    const claimProcessingWithMego = async () => {
        setMessage('Creating claim...')
        const data = await getMegoPendingClaimProcessingData()
        //Take query params signature from url
        const urlParams = new URLSearchParams(window.location.search);
        const signature = urlParams.get('signature') || "";

        if(!signature){
            setMessage('Signature error')
            openPopup({ title: 'Signature error', message: 'Signature not found', modality: PopupModality.Error, isOpen: true })
            cleanMegoPendingClaimProcessing()
            resetPaymentProcessing()
            return;
        }

        const claim = await createClaim(
            signature,
            data?.tokenId || "",
            data?.emailOfBuyer || "",
            data?.identifier || "",
            data?.userAddress || "",
            data?.message || "",
            true,
            data?.claim_metadata || []
        );

        if (claim.error) {
            setMessage('Error creating claim...')
            openPopup({ title: 'Alert', message: 'Error creating claim...', modality: PopupModality.Error, isOpen: true })
            cleanMegoPendingClaimProcessing()
            resetPaymentProcessing()
            return;
        }
        setClaimData(claim)
        setStepper(Stepper.Claim)
        cleanMegoPendingClaimProcessing()
    }


    useEffect(() => {
        //Prevent strict mode to run the processing twice
        if (count === 0) {
            const MP_func = localStorage.getItem("MP_func")
            MP_func === "claim_processing" ? claimProcessingWithMego() : processing()
            count++;
        }
    }, [])


    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <Loader message={message} />
        </div>
    );
};
