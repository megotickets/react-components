import { useEffect, useState } from "react";
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { loadStripe, Stripe, StripeElements } from "@stripe/stripe-js";
import { PopupModality } from "../interfaces/popup-enum";
import { Stepper } from "../interfaces/interface-stepper";

const BuyTicketWithStripe = () => {
    const { eventDetails, paymentsDetails, openPopup, setStepper } = useBuyTicketContext();
    const [stripeElements, setStripeElements] = useState<StripeElements | null>(null);
    const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    useEffect(() => {
        const clientSecret = paymentsDetails?.payment?.stripePayment?.client_secret;
        const stripePublishableKey = eventDetails?.event?.collectors?.stripe?.pub;
        
        if (!clientSecret) {
            console.error('No stripe client secret');
            return;
        }

        const initializeStripe = async () => {
            try {
                // Carica Stripe con la chiave pubblica (dovrebbe essere configurata nell'ambiente)
                const stripePromise = loadStripe(stripePublishableKey || "");
                const stripe = await stripePromise;
                
                if (!stripe) {
                    console.error('Impossibile caricare Stripe');
                    return;
                }
                
                // Crea gli elementi Stripe con il client secret
                const elements = stripe.elements({ clientSecret });
                
                // Crea l'elemento di pagamento e montalo nel DOM
                const paymentElement = elements.create("payment");
                const paymentElementContainer = document.getElementById('payment-element');
                
                if (paymentElementContainer) {
                    paymentElement.mount("#payment-element");
                    setStripeElements(elements);
                    setStripeInstance(stripe);
                } else {
                    throw new Error("Elemento di pagamento non trovato nel DOM");
                }
            } catch (error: any) {
                console.error("Errore nell'inizializzazione di Stripe:", error);
                openPopup({
                    title: 'Errore', 
                    message: `Errore nell'inizializzazione di Stripe: ${error.message || 'Errore sconosciuto'}`, 
                    modality: PopupModality.Error, 
                    isOpen: true
                });
            }
        };

        initializeStripe();
    }, [paymentsDetails, openPopup, eventDetails]);
    
    const handlePayment = async () => {
        if (!stripeInstance || !stripeElements) {
            openPopup({
                title: 'Errore', 
                message: 'Stripe non è stato inizializzato correttamente', 
                modality: PopupModality.Error, 
                isOpen: true
            });
            return;
        }

        try {
            setIsProcessing(true);
            
            // Conferma il pagamento senza redirect
            const { error, paymentIntent } = await stripeInstance.confirmPayment({
                elements: stripeElements,
                redirect: 'if_required',
                confirmParams: {
                    return_url: window.location.origin,
                }
            });

            if (error) {
                throw error;
            }

            console.log('paymentIntent', paymentIntent);

            // Se siamo qui, il pagamento è andato a buon fine
            if (paymentIntent && paymentIntent.status === 'succeeded') {
                console.log('Pagamento completato con successo!', paymentIntent);
                
                // Passa allo step successivo (NFT_Mint)
                setStepper(Stepper.NFT_Mint);
            } else if (paymentIntent && paymentIntent.status === 'processing') {
                // Il pagamento è in elaborazione
                openPopup({
                    title: 'Pagamento in elaborazione', 
                    message: 'Il tuo pagamento è in fase di elaborazione. Ti avviseremo quando sarà completato.', 
                    modality: PopupModality.Info, 
                    isOpen: true
                });
            } else {
                // Gestisci altri stati del pagamento
                setStepper(Stepper.NFT_Mint); // Per ora procediamo comunque al mint
            }
        } catch (error: any) {
            console.error("Errore durante il pagamento:", error);
            openPopup({
                title: 'Errore di pagamento', 
                message: error.message || 'Si è verificato un errore durante il pagamento', 
                modality: PopupModality.Error, 
                isOpen: true
            });
        } finally {
            setIsProcessing(false);
        }
    };
    
    return (
        <div>
            <div id="payment-element"></div>
            <button 
                onClick={handlePayment}
                disabled={isProcessing}
                style={{ 
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: isProcessing ? '#a0a0a0' : '#6772e5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isProcessing ? 'not-allowed' : 'pointer'
                }}
            >
                {isProcessing ? 'Elaborazione in corso...' : 'Paga ora'}
            </button>
        </div>
    );
};

export default BuyTicketWithStripe;