import { useEffect, useState } from "react";
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { askPaymentDetails, checkNFT, mintNFT, createClaim, saveMegoPendingClaimProcessing, getMegoPendingClaimProcessingData, cleanMegoPendingClaimProcessing } from "../utils/BuyTicketUtils";
import { useAccount } from "wagmi";
import { Messages } from "../interfaces/messages-enums";
import { Loader } from "@/components/Loader";
import { PopupModality } from "../interfaces/popup-enum";
import { Stepper } from "../interfaces/interface-stepper";
import { signMessage } from "wagmi/actions";
import { config } from "@/components/Web3ClientProvider";
import { useWeb3Context } from "@/components/web3-context";


export const BuyTicketProcessing = () => {
    const { eventDetails, emailOfBuyer, openPopup, resetPaymentProcessing, claimMetadata, setStepper, setClaimData } = useBuyTicketContext()
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
                } else {
                    setMessage('Processing payment...')
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setStepper(Stepper.Payments)
                    return;
                }

                //Display and check NFT
                setMessage('Check NFT ...')
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
                    const res = await mintNFT(payment?.paymentId);
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
                        }
                        retry++;
                        await new Promise(resolve => setTimeout(resolve, 3000));
                    }
                    if(retry >= 15){
                        setMessage('Error minting NFT...')
                        openPopup({ title: 'Alert', message: 'Error minting NFT...', modality: PopupModality.Error, isOpen: true })
                        resetPaymentProcessing()
                        return;
                    }
                    //const res = await mintNFT(eventDetails?.event?.identifier,address);
                }
                
                let signature = "";
                if (isConnectedWithMego() && provider) {
                    await saveMegoPendingClaimProcessing(tokenId, emailOfBuyer || "", eventDetails?.event?.identifier, userAddress, `Claiming token ${tokenId}`, claimMetadata)
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
                const claim = await createClaim(signature, tokenId, emailOfBuyer || "", eventDetails?.event?.identifier, userAddress, `Claiming token ${tokenId}`, true, claimMetadata);

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
