import { useState, useEffect, useMemo } from "react"
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { cleanMegoPendingClaimProcessing, createClaim, getMegoPendingClaimProcessingData, saveMegoPendingClaimProcessing } from "../utils/BuyTicketUtils";
import { useAccount } from "@megotickets/core";
import { Loader } from "@megotickets/core";
import { PopupModality } from "../interfaces/popup-enum";
import { Stepper } from "../interfaces/interface-stepper";
import { signMessage } from "@megotickets/core";
import { config } from "@megotickets/core";
import { isConnectedWithMego, getProvider } from "../utils/utils";
import { signMessageWithGoogle, signMessageWithApple } from "@megotickets/core";
import "../css/pay.css";
export const BuyTicketClaimGeneration = () => {
    const { eventDetails, openPopup, resetPaymentProcessing, setStepper, emailOfBuyer, setClaimData, claimMetadata, tokenId } = useBuyTicketContext()
    const [message, setMessage] = useState<string>('Processing...')
    const { address } = useAccount()


    let count = 0;

    const provider = useMemo(() => {
        return getProvider()
    }, [window.location.search])

    //UseMemo for resolve address
    const userAddress = useMemo(() => {
        //Search loggedAs o signedAs nei params dell'url
        const urlParams = new URLSearchParams(window.location.search);
        const loggedAs = urlParams.get('loggedAs');
        const signedAs = urlParams.get('signedAs');
        return address || loggedAs || signedAs || ""
    }, [address, window.location.search])



    const processing = async () => {
        try {
            let signature = ""
            if (isConnectedWithMego() && provider) {
                await saveMegoPendingClaimProcessing(tokenId || "", emailOfBuyer || "", eventDetails?.event?.identifier, userAddress, `Claiming token ${tokenId}`, claimMetadata)
                const redirectUrl = window.location.origin
                if (provider.includes("google")) {
                    signMessageWithGoogle(redirectUrl, `Claiming token ${tokenId}`);
                } else if (provider.includes("apple")) {
                    signMessageWithApple(redirectUrl, `Claiming token ${tokenId}`);
                }
                return;
            } else {
                setMessage('Please confirm subscription to attend the event.')
                signature = await signMessage(config, { message: `Claiming token ${tokenId}` })
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
            if (!signature) {
                setMessage('Error creating claim...')
                openPopup({ title: 'Alert', message: 'Error creating claim...', modality: PopupModality.Error, isOpen: true, })
                resetPaymentProcessing()
                return;
            }

            //Create claim
            setMessage('Creating claim...')
            const claim = await createClaim(signature, tokenId || "", emailOfBuyer || "", eventDetails?.event?.identifier, userAddress, `Claiming token ${tokenId}`, true, claimMetadata);

            if (claim.error) {
                setMessage('Error creating claim...')
                openPopup({
                    title: 'Alert',
                    message: 'Error creating claim...',
                    modality: PopupModality.Error,
                    isOpen: true
                })
                resetPaymentProcessing()
                return;
            }
            setClaimData(claim)
            setStepper(Stepper.Claim)
            return; 
        }
        catch (error) {
            openPopup({ title: 'Alert', message: 'Error creating claim...', modality: PopupModality.Error, isOpen: true })
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
        <div className="loader">
            <Loader message={message} />
        </div>
    )
}