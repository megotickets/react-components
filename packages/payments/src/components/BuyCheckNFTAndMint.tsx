import { useState, useEffect } from "react"
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { checkNFT, mintNFT, cleanMegoPendingClaimProcessing, getAllNFTsOfUser, getNewTokenIdList } from "../utils/BuyTicketUtils";
import { Loader } from "@megotickets/core";
import { PopupModality } from "../interfaces/popup-enum";
import { Stepper } from "../interfaces/interface-stepper";
import "../css/pay.css";
import { useLanguage } from "@megotickets/core";
import { getLoginDataInfo } from "@/utils/LoginUtils";


export const BuyCheckNFTAndMint = () => {
    const { eventDetails, paymentsDetails, openPopup, resetPaymentProcessing, setStepper, setTokenIds, amountOfTicket } = useBuyTicketContext()
    const [message, setMessage] = useState<string>('Processing...')
    const { t } = useLanguage();
    let count = 0;

    const processing = async () => {
        try {
            const userAddress = getLoginDataInfo()?.loggedAs || ""

            setMessage(amountOfTicket > 1 ? t('mintingNFTs', 'payments') : t('mintingNFT', 'payments'))

            //Preleviamo tutti gli NFT dell'utente per l'evento specifico
            const userNFTsBeforeMint = await getAllNFTsOfUser(eventDetails?.event?.identifier, userAddress);
            const userNftsCountBeforeMint = userNFTsBeforeMint.owned.length;
            console.log('[MINT] userNFTsBeforeMint', userNFTsBeforeMint)
            console.log('[MINT] userNftsCountBeforeMint', userNftsCountBeforeMint)

            //Mint NFT
            const res = await mintNFT(paymentsDetails?.payment?.paymentId);
            const { error } = res;
            if (error) {
                setMessage(t('errorMintingNFT', 'payments'))
                openPopup({ title: 'Alert', message: t('errorMintingNFT', 'payments'), modality: PopupModality.Error, isOpen: true })
                resetPaymentProcessing()
                return;
            }
            setMessage(amountOfTicket > 1 ? t('waitingForMintingConfirmations', 'payments') : t('waitingForMintingConfirmation', 'payments'))
            //Re-check NFT while minting is completed
            let isMinted = false;
            let retry = 0;

            while (!isMinted && retry < 20) {
                //Verifichiamo che la blockchain abbia aggiornato la lista degli NFT dell'utente
                const afterMintUserNfts = await getAllNFTsOfUser(eventDetails?.event?.identifier, userAddress);
                const afterMintUserNftsCount = afterMintUserNfts.owned.length;

                //Se il numero di NFT dell'utente è uguale al numero di NFT prima del mint + il numero di biglietti comprati, allora il mint è stato completato
                if (afterMintUserNftsCount === userNftsCountBeforeMint + amountOfTicket) {
                    isMinted = true;
                    //Sono tutti i tokenId presenti solo nella lista dopo il mint dell'utente e che non sono presenti in prima del tentativo di mint
                    const tokenIdList = getNewTokenIdList(afterMintUserNfts, userNFTsBeforeMint)
                    setTokenIds(tokenIdList)
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