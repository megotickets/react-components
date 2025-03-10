import { useEffect, useState } from "react";
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { loadStripe, Stripe, StripeElements } from "@stripe/stripe-js";
import { PopupModality } from "../interfaces/popup-enum";

const BuyTicketWithStripe = () => {
    const { eventDetails, paymentsDetails, openPopup } = useBuyTicketContext();
    const [stripeElements, setStripeElements] = useState<StripeElements | null>(null);
    const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);

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
    }, [paymentsDetails, openPopup]);
    
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
            const { error } = await stripeInstance.confirmPayment({
                elements: stripeElements,
                confirmParams: {
                    return_url: window.location.origin + "/payment-confirmation",
                }
            });

            if (error) {
                throw error;
            }
        } catch (error: any) {
            console.error("Errore durante il pagamento:", error);
            openPopup({
                title: 'Errore di pagamento', 
                message: error.message || 'Si è verificato un errore durante il pagamento', 
                modality: PopupModality.Error, 
                isOpen: true
            });
        }
    };
    
    return (
        <div>
            <div id="payment-element"></div>
            <button 
                onClick={handlePayment}
                style={{ 
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#6772e5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Paga ora
            </button>
        </div>
    );
};

export default BuyTicketWithStripe;

/*

"stripePayment": {
            "amount_details": {
                "tip": {}
            },
            "metadata": {
                "identifier": "0xaF81EBE3e7_044539",
                "purchase_address": "0xd0137252d603a39a191ad0db21EfdA66Be120679",
                "tierId": "254054d2-ae01-4fb9-9fde-9cd4c8ae72d3",
                "email": "test@test.com",
                "paymentId": "2f3b278f-5eeb-4c70-b7e2-03f47a9faf39",
                "isMego": "true"
            },
            "livemode": true,
            "canceled_at": null,
            "amount_capturable": 0,
            "description": null,
            "source": null,
            "uuid": "2f3b278f-5eeb-4c70-b7e2-03f47a9faf39",
            "statement_descriptor": null,
            "transfer_data": {
                "destination": "acct_1NDHliICu16Wv12M"
            },
            "latest_charge": null,
            "shipping": null,
            "automatic_payment_methods": {
                "allow_redirects": "always",
                "enabled": true
            },
            "review": null,
            "currency": "eur",
            "id": "pi_3R13iwEspoeoo84m1mVwChiL",
            "client_secret": "pi_3R13iwEspoeoo84m1mVwChiL_secret_ODHR4h8Ut0CH4ckE2816r4mRo",
            "payment_method_options": {
                "link": {
                    "persistent_token": null
                },
                "card": {
                    "mandate_options": null,
                    "installments": null,
                    "request_three_d_secure": "automatic",
                    "network": null
                }
            },
            "payment_method": null,
            "capture_method": "manual",
            "amount": 10000,
            "transfer_group": null,
            "on_behalf_of": "acct_1NDHliICu16Wv12M",
            "created": 1741603098,
            "payment_method_types": [
                "card",
                "link"
            ],
            "amount_received": 0,
            "setup_future_usage": null,
            "confirmation_method": "automatic",
            "cancellation_reason": null,
            "payment_method_configuration_details": {
                "parent": "pmc_1NIljsEspoeoo84mYsAMP7Zk",
                "id": "pmc_1NIlmaICu16Wv12MZjkzfVrp"
            },
            "application": null,
            "receipt_email": null,
            "last_payment_error": null,
            "next_action": null,
            "processing": null,
            "invoice": null,
            "statement_descriptor_suffix": null,
            "application_fee_amount": 880,
            "object": "payment_intent",
            "customer": null,
            "status": "requires_payment_method"
        },

*/