import { useState, useEffect } from "react"
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { checkNFT, mintNFT, cleanMegoPendingClaimProcessing } from "../utils/BuyTicketUtils";
import { useAccount } from "@megotickets/core";
import { Loader } from "@megotickets/core";
import { PopupModality } from "../interfaces/popup-enum";
import { Stepper } from "../interfaces/interface-stepper";

export const BuyCheckNFTAndMint = () => {
    const { eventDetails, paymentsDetails, openPopup, resetPaymentProcessing, setStepper, setTokenId } = useBuyTicketContext()
    const [message, setMessage] = useState<string>('Processing...')
    const { address } = useAccount()

    let count = 0;

    const processing = async () => {
        try {
            //Search loggedAs o signedAs nei params dell'url
            const urlParams = new URLSearchParams(window.location.search);
            const loggedAs = urlParams.get('loggedAs');
            const signedAs = urlParams.get('signedAs');
            const userAddress = address || loggedAs || signedAs || ""
            const res = await checkNFT(eventDetails?.event?.identifier, userAddress);
            let tokenId = res.tokenId;
            if (tokenId !== null) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                openPopup({ title: 'Ticket already minted', message: 'You already have a ticket for this payment.', modality: PopupModality.Error, isOpen: true })
                resetPaymentProcessing()
                return;
            } else {
                setMessage('Minting NFT...')
                //Mint NFT
                const res = await mintNFT(paymentsDetails?.payment?.paymentId);
                const { error } = res;
                if (error) {
                    setMessage('Error minting NFT...')
                    openPopup({ title: 'Alert', message: 'Error minting NFT...', modality: PopupModality.Error, isOpen: true })
                    resetPaymentProcessing()
                    return;
                }
                setMessage('Waiting for minting confirmation..')
                //Re-check NFT while minting is completed
                let isMinted = false;
                let retry = 0;
                while (!isMinted && retry < 15) {
                    const res = await checkNFT(eventDetails?.event?.identifier, userAddress);
                    if (res.tokenId !== null) {
                        isMinted = true;
                        tokenId = res.tokenId;
                        setTokenId(tokenId)
                    }
                    retry++;
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
                if (retry >= 15) {
                    setMessage('Error minting NFT...')
                    openPopup({ title: 'Alert', message: 'Error minting NFT...', modality: PopupModality.Error, isOpen: true })
                    resetPaymentProcessing()
                    return;
                }
            }
            console.log('Stepper.Claim_Generation')
            setStepper(Stepper.Claim_Generation)
        }
        catch (error) {
            console.error(error)
            openPopup({ title: 'Alert', message: 'Error minting NFT...', modality: PopupModality.Error, isOpen: true })
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <Loader message={message} />
        </div>
    )
}