import { useState, useEffect } from "react"
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { checkNFT, mintNFT, cleanMegoPendingClaimProcessing } from "../utils/BuyTicketUtils";
import { useAccount } from "@megotickets/core";
import { Loader } from "@megotickets/core";
import { PopupModality } from "../interfaces/popup-enum";
import { Stepper } from "../interfaces/interface-stepper";
import "../css/pay.css";
import { useLanguage } from "@megotickets/core";
import { getLoginDataInfo } from "@/utils/LoginUtils";


export const BuyCheckNFTAndMint = () => {
    const { eventDetails, paymentsDetails, openPopup, resetPaymentProcessing, setStepper, setTokenId } = useBuyTicketContext()
    const [message, setMessage] = useState<string>('Processing...')
    const { t } = useLanguage();
    let count = 0;

    const processing = async () => {
        try {
            const userAddress = getLoginDataInfo()?.loggedAs || ""

            setMessage(t('mintingNFT', 'payments'))
            //Mint NFT
            const res = await mintNFT(paymentsDetails?.payment?.paymentId);
            const { error } = res;
            if (error) {
                setMessage(t('errorMintingNFT', 'payments'))
                openPopup({ title: 'Alert', message: t('errorMintingNFT', 'payments'), modality: PopupModality.Error, isOpen: true })
                resetPaymentProcessing()
                return;
            }
            setMessage(t('waitingForMintingConfirmation', 'payments'))
            //Re-check NFT while minting is completed
            let isMinted = false;
            let retry = 0;
            while (!isMinted && retry < 15) {
                const res = await checkNFT(eventDetails?.event?.identifier, userAddress);
                if (res.tokenId !== null) {
                    isMinted = true;
                    setTokenId(res.tokenId)
                }
                retry++;
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
            if (retry >= 15) {
                setMessage(t('errorMintingNFT', 'payments'))
                openPopup({ title: 'Alert', message: t('errorMintingNFT', 'payments'), modality: PopupModality.Error, isOpen: true })
                resetPaymentProcessing()
                return;
            }

            console.log('Stepper.Claim_Generation')
            setStepper(Stepper.Claim_Generation)
        }
        catch (error) {
            console.error(error)
            openPopup({ title: 'Alert', message: t('errorMintingNFT', 'payments'), modality: PopupModality.Error, isOpen: true })
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
    )
}