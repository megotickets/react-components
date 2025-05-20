import { useState, useEffect, useMemo } from "react"
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { cleanMegoPendingClaimProcessing, createClaim, getMegoPendingClaimProcessingData, saveMegoPendingClaimProcessing } from "../utils/BuyTicketUtils";
import { signWithMego, useAccount, useLanguage } from "@megotickets/core";
import { Loader } from "@megotickets/core";
import { PopupModality } from "../interfaces/popup-enum";
import { Stepper } from "../interfaces/interface-stepper";
import { signMessage } from "@megotickets/core";
import { config } from "@megotickets/core";
import { isConnectedWithMego, getProvider } from "../utils/utils";
import { signMessageWithGoogle, signMessageWithApple } from "@megotickets/core";
import "../css/pay.css";
import { getLoginDataInfo } from "@/utils/LoginUtils";

export const BuyTicketClaimGeneration = () => {
    const { t } = useLanguage()
    const { eventDetails, openPopup, resetPaymentProcessing, setStepper, emailOfBuyer, setClaimData, claimMetadata, tokenIds, amountOfTicket } = useBuyTicketContext()
    const [message, setMessage] = useState<string>(t('processing', 'payments'))

    let count = 0;

    const processing = async () => {
        try {
            const userAddress = getLoginDataInfo()?.loggedAs || ""
            const provider = getLoginDataInfo()?.provider || ""
            const session = getLoginDataInfo()?.session || ""

            if (!tokenIds || tokenIds.length === 0) {
                setMessage(t('noTokensToClaim', 'payments'))
                openPopup({ title: 'Alert', message: t('noTokensToClaim', 'payments'), modality: PopupModality.Error, isOpen: true })
                resetPaymentProcessing()
                return;
            }


            const signatures: Array<{ signature: string, tokenId: string }> = []
            if (tokenIds && tokenIds.length > 0) {
                for (const tokenId of tokenIds) {
                    let sig = { signature: "", tokenId: tokenId }

                    let sigRetrieved = false;
                    let retryCount = 0;
                    const maxRetries = 5;
                    const retryDelay = 2000;


                    while (sigRetrieved == false && retryCount < maxRetries) {
                        console.log('[CLAIM] Prelevamento della signature per il tokenId (tentativo', retryCount, ')', tokenId)
                        if(retryCount > 0){
                            await new Promise(resolve => setTimeout(resolve, retryDelay));
                        }
                        try {
                            if (isConnectedWithMego() && provider) {

                                //MEGO CASE
                                let sigResponse = await signWithMego(session, `Claiming token ${tokenId}`)
                                if (sigResponse.error) {
                                    console.log('[CLAIM] Errore nel prendere la signature per il tokenId', tokenId)
                                    sigRetrieved = false
                                    retryCount++;
                                } else {
                                    console.log('[CLAIM] Signature prelevata per il tokenId', tokenId)
                                    sig = { signature: sigResponse.signature, tokenId: tokenId }
                                    sigRetrieved = true
                                    signatures.push(sig)
                                }
                            } else {
                                setMessage(t('pleaseConfirmSubscriptionToAttendTheEvent', 'payments'))

                                //METAMASK CASE
                                const _sig = await signMessage(config, { message: `Claiming token ${tokenId}` })
                                sig = { signature: _sig, tokenId: tokenId }
                                //TODO: La signature può essere respinta in teoria, quindi bisogna gestire questo caso!
                                sigRetrieved = true
                                signatures.push(sig)
                            }
                        } catch (error) {
                            retryCount++;
                        }
                    }

                    if (sigRetrieved == false || retryCount >= maxRetries) {
                        //TODO: Si potrebbe gestire in altro modo ancora?
                        setMessage(t('error', 'payments'))
                        openPopup({ title: 'Alert', message: t('errorCreatingClaim', 'payments'), modality: PopupModality.Error, isOpen: true, })
                        resetPaymentProcessing()
                        return;
                    }
                }
            }

            await new Promise(resolve => setTimeout(resolve, 1000));

            if (signatures.length !== tokenIds.length) {
                setMessage(t('errorCreatingClaim', 'payments'))
                openPopup({ title: 'Alert', message: t('errorCreatingClaim', 'payments'), modality: PopupModality.Error, isOpen: true, })
                resetPaymentProcessing()
                //TODO: Come gestiamo questa situazione? 
            }

            //Create claim
            setMessage(amountOfTicket > 1 ? t('creatingClaims', 'payments') : t('creatingClaim', 'payments'))

            //Create claims for every signature
            const claims = []
            for (const signature of signatures) {

                let claimRetrieved = false;
                let retryCount = 0;
                const maxRetries = 5;
                const retryDelay = 2000;

                while (claimRetrieved == false && retryCount < maxRetries) {
                    if(retryCount > 0){
                        await new Promise(resolve => setTimeout(resolve, retryDelay));
                    }
                    try {
                        console.log('[CLAIM] Creazione del claim per il tokenId (tentativo', retryCount, ')', signature.tokenId)
                        const claim = await createClaim(signature.signature, signature.tokenId || "", emailOfBuyer || "", eventDetails?.event?.identifier, userAddress, `Claiming token ${signature.tokenId}`, true, claimMetadata);
                        if (claim.error) {
                            console.log('[CLAIM] Errore nel creare il claim per il tokenId', signature.tokenId)
                            claimRetrieved = false
                            retryCount++;
                        } else {
                            claims.push(claim)
                            claimRetrieved = true
                        }
                    } catch (error) {
                        retryCount++;
                    }
                }

                if (claimRetrieved == false || retryCount >= maxRetries) {
                    //TODO: Si potrebbe gestire in altro modo ancora?
                    setMessage(t('errorCreatingClaim', 'payments'))
                    openPopup({
                        title: 'Alert',
                        message: t('errorCreatingClaim', 'payments'),
                        modality: PopupModality.Error,
                        isOpen: true
                    })
                    resetPaymentProcessing()
                    return;
                }   
            }

            setClaimData(claims)
            setStepper(Stepper.Claim)
            return;
        }
        catch (error) {
            openPopup({ title: 'Alert', message: t('errorCreatingClaim', 'payments'), modality: PopupModality.Error, isOpen: true })
        }
    }

    const claimProcessingWithMego = async () => {
        setMessage(amountOfTicket > 1 ? t('creatingClaims', 'payments') : t('creatingClaim', 'payments'))
        const data = await getMegoPendingClaimProcessingData()
        //Take query params signature from url
        const urlParams = new URLSearchParams(window.location.search);
        const signature = urlParams.get('signature') || "";

        if (!signature) {
            setMessage(t('signatureError', 'payments'))
            openPopup({ title: t('signatureError', 'payments'), message: t('signatureNotFound', 'payments'), modality: PopupModality.Error, isOpen: true })
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
            setMessage(t('errorCreatingClaim', 'payments'))
            openPopup({ title: 'Alert', message: t('errorCreatingClaim', 'payments'), modality: PopupModality.Error, isOpen: true })
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