import { useState, useEffect } from "react"
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { createClaim, saveMegoPendingClaimProcessing } from "../utils/BuyTicketUtils";
import { useAccount } from "wagmi";
import { Loader } from "@/components/Loader";
import { PopupModality } from "../interfaces/popup-enum";
import { Stepper } from "../interfaces/interface-stepper";
import { useWeb3Context } from "@/components/web3-context";
import { signMessage } from "wagmi/actions";
import { config } from "@/components/Web3ClientProvider";

export const BuyTicketClaimGeneration = () => {
    const { eventDetails, openPopup, resetPaymentProcessing, setStepper, emailOfBuyer, setClaimData, claimMetadata, tokenId } = useBuyTicketContext()
    const [message, setMessage] = useState<string>('Processing...')
    const { address } = useAccount()
    const { loggedAs, isConnectedWithMego, provider, signMessageWithGoogle, signMessageWithApple } = useWeb3Context()

    let count = 0;

    const processing = async () => {
        try {
            const userAddress = address || loggedAs || ""
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

    useEffect(() => {
        if (count === 0) {
            processing()
            count++
        }
    }, [])

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <Loader message={message} />
        </div>
    )
}