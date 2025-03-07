import { useEffect, useState } from "react";
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { askPaymentDetails, checkNFT, mintNFT, createClaim } from "../utils/BuyTicketUtils";
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
    const { loggedAs, isConnectedWithMego } = useWeb3Context()

    const [message, setMessage] = useState<string>('Processing...')
    let count = 0;

    const processing = async () => {
        try {

            setMessage('Asking for payment details...')
            const processor = "stripe"
            const userAddress = address || loggedAs || ""
            if (userAddress) {
                const paymentDetails = await askPaymentDetails(
                    processor,
                    1,
                    eventDetails?.event?.identifier,
                    userAddress,
                    eventDetails?.event?.discount_code || "", // Da capire
                    eventDetails?.event?.currency,
                    emailOfBuyer || "",
                    eventDetails?.event?.donation_amount || 0
                )
                let { error, message, payment } = paymentDetails

                if(error){
                    setMessage('Error asking for payment details...')
                    openPopup({
                        title: 'Alert',
                        message: 'Error asking for payment details...',
                        modality: PopupModality.Error,
                        isOpen: true
                    })
                    resetPaymentProcessing()
                    return;
                }

                //Quit if the user can't buy more tickets
                if (message === Messages.CANT_BUY_MORE_TICKETS) {
                    setMessage(Messages.CANT_BUY_MORE_TICKETS)
                    openPopup({
                        title: 'Alert',
                        message: Messages.CANT_BUY_MORE_TICKETS,
                        modality: PopupModality.Error,
                        isOpen: true
                    })
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

                if(isConnectedWithMego()){
                    openPopup({
                        title: 'Mego not implemented',
                        message: 'Mego is not implemented yet',
                        modality: PopupModality.Info,
                        isOpen: true
                    })
                    resetPaymentProcessing()
                    return;
                }

                //Display and check NFT
                setMessage('Check NFT ...')
                const res = await checkNFT(eventDetails?.event?.identifier, userAddress);
                console.log(res)
                let tokenId = res.tokenId;
                if (tokenId !== null) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    openPopup({
                        title: 'Ticket already minted',
                        message: 'You already have a ticket for this payment.',
                        modality: PopupModality.Error,
                        isOpen: true
                    })
                    resetPaymentProcessing()
                    return;
                } else {
                    setMessage('Minting NFT...')
                    //Mint NFT
                    const res = await mintNFT(payment?.paymentId);
                    const { error } = res;
                    if (error) {
                        setMessage('Error minting NFT...')
                        openPopup({
                            title: 'Alert',
                            message: 'Error minting NFT...',
                            modality: PopupModality.Error,
                            isOpen: true
                        })
                        resetPaymentProcessing()
                        return;
                    }
                    setMessage('Waiting for minting confirmation..')
                    //Re-check NFT while minting is completed
                    let isMinted = false;
                    let retry = 0;
                    while (!isMinted && retry < 10) {
                        const res = await checkNFT(eventDetails?.event?.identifier, userAddress);
                        if (res.tokenId !== null) {
                            isMinted = true;
                            tokenId = res.tokenId;
                        }
                        retry++;
                        await new Promise(resolve => setTimeout(resolve, 3000));
                    }
                    setMessage('Please confirm subscription to attend the event.')
                    //const res = await mintNFT(eventDetails?.event?.identifier,address);
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
                const signature = await signMessage(config, { message: `Claiming token ${tokenId}` })
                if (!signature) {
                    setMessage('Error creating claim...')
                    openPopup({
                        title: 'Alert',
                        message: 'Error creating claim...',
                        modality: PopupModality.Error,
                        isOpen: true,
                    })
                    resetPaymentProcessing()
                    return;
                }

                //Create claim
                setMessage('Creating claim...')
                const claim = await createClaim(
                    signature,
                    tokenId,
                    emailOfBuyer || "",
                    eventDetails?.event?.identifier,
                    userAddress,
                    `Claiming token ${tokenId}`,
                    true,
                    claimMetadata
                );

                if(claim.error){
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
        }
    }


    useEffect(() => {
        //Prevent strict mode to run the processing twice
        if(count === 0){
            processing()
            count++;
        }
    }, [])


    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <Loader message={message} />
        </div>
    );
};
