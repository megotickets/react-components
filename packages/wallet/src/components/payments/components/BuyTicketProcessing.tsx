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


export const BuyTicketProcessing = () => {
    const { eventDetails, emailOfBuyer, openPopup, resetPaymentProcessing, claimMetadata, setStepper, setClaimData } = useBuyTicketContext()
    const { address } = useAccount()

    const [message, setMessage] = useState<string>('Processing...')


    const processing = async () => {
        try {
            
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
                let { message } = paymentDetails

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
                if(eventDetails?.event?.price <= 0){
                    setMessage('Claiming free ticket...')
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }else{
                    setMessage('Processing payment...')
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setStepper(Stepper.Payments)
                    return;
                }

                //Display and check NFT
                setMessage('Check NFT ...')
                const res = await checkNFT(eventDetails?.event?.identifier,address);
                console.log(res)
                const { tokenId } = res;

                if(tokenId !== ""){
                    setMessage('User has NFT...')
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }else {
                    setMessage('Minting NFT...')
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    //const res = await mintNFT(eventDetails?.event?.identifier,address);
                    return;
                }

                //Display creating Claim
                setMessage('Creating claim...')
                await new Promise(resolve => setTimeout(resolve, 1000));
                const signature = await signMessage(config, {message: `Claiming token ${tokenId}`})
                if(!signature){
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
                const claim = await createClaim(
                    signature,
                    tokenId,
                    emailOfBuyer || "",
                    eventDetails?.event?.identifier,
                    address,
                    `Claiming token ${tokenId}`,
                    true,
                    claimMetadata
                );
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
        processing()
    }, [])


    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <Loader message={message} />
        </div>
    );
};
