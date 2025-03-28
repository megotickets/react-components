import { useEffect, useMemo, useState } from "react";
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { loadStripe, Stripe, StripeElements } from "@stripe/stripe-js";
import { PopupModality } from "../interfaces/popup-enum";
import { Stepper } from "../interfaces/interface-stepper";
import { checkPayment, getPayment } from "../utils/BuyTicketUtils";
import { useAccount } from "@megotickets/core";
import { Loader } from "@megotickets/core";
import "../css/pay.css";

const BuyTicketWithStripe = () => {
    const { eventDetails, paymentsDetails, openPopup, setStepper, savePendingProcess, resetPaymentProcessing } = useBuyTicketContext();
    const [stripeElements, setStripeElements] = useState<StripeElements | null>(null);
    const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const { address } = useAccount();
    const [message, setMessage] = useState<string>("");

    const [waitForPaymentConfirmation, setWaitForPaymentConfirmation] = useState<boolean>(false);
    const [isCanceledAllowed, setIsCanceledAllowed] = useState<boolean>(true);

    console.log('paymentsDetails', paymentsDetails);
    console.log('eventDetails', eventDetails);

    const userAddress = useMemo(() => {
        //Search loggedAs o signedAs nei params dell'url
        const urlParams = new URLSearchParams(window.location.search);
        const loggedAs = urlParams.get('loggedAs');
        const signedAs = urlParams.get('signedAs');
        return address || loggedAs || signedAs || ""
    }, [address, window.location.search])

    const handleCancel = () => {
        localStorage.removeItem("_func");
        setIsProcessing(false);
        resetPaymentProcessing();
    }

    const waitBackendConfirmationOfPayment = async () => {
        try {
            setWaitForPaymentConfirmation(true);
            setIsCanceledAllowed(false);
            setMessage("Attendere la conferma del pagamento...")
            //Check params from url
            const urlParams = new URLSearchParams(window.location.search);
            const uuid = urlParams.get("uuid");
            const account = urlParams.get("account");
            const payment_intent = urlParams.get("payment_intent");
            const payment_intent_client_secret = urlParams.get("payment_intent_client_secret");

            console.log('uuid', uuid);
            console.log('payment_intent', payment_intent);
            console.log('payment_intent_client_secret', payment_intent_client_secret);
            console.log('account', account);
            console.log('urlParams', urlParams);

            if (uuid && payment_intent && payment_intent_client_secret) {
                setMessage("Ottenimento dei dettagli del pagamento...")
                const payment = await getPayment(uuid);
                console.log('payment', payment);
                if (payment.error == false) {
                    console.log("Dati del pagamento ritrovati! .. check dello stato del pagamento")
                    //Check if payment is completed
                    const interval = setInterval(async () => {
                        console.log('checkPayment with uuid:', uuid);
                        const result = await checkPayment(uuid);
                        console.log('checkPayment:', result);
                        if (result.error == false) {
                            clearInterval(interval);
                            localStorage.removeItem("_func");
                            setStepper(Stepper.NFT_Mint);
                        } else {
                            console.log("Ancore error = false")
                        }
                    }, 5000);
                } else {
                    openPopup({
                        title: 'Errore',
                        message: `Errore nell'attesa della conferma del pagamento: ${payment.message || 'Errore sconosciuto'}`,
                        modality: PopupModality.Error,
                        isOpen: true
                    });
                    setIsProcessing(false);
                }
            } else {
                // C'era _func ma non c'erano i parametri di pagamento quindi si cancella il processo e si riparte dall'inizio
                console.log("C'era _func ma non c'erano i parametri di pagamento quindi si cancella il processo e si riparte dall'inizio")
                setIsProcessing(false);
                localStorage.removeItem("_func");
                initializeStripe();
            }
        } catch (error: any) {
            console.error("Errore nell'attesa della conferma del pagamento:", error);
            openPopup({
                title: 'Errore',
                message: `Errore nell'attesa della conferma del pagamento: ${error.message || 'Errore sconosciuto'}`,
                modality: PopupModality.Error,
                isOpen: true
            });
            setIsProcessing(false);
        } finally {
            localStorage.removeItem("_func");
        }
    };

    const initializeStripe = async () => {
        try {
            const clientSecret = paymentsDetails?.payment?.stripePayment?.client_secret;
            const stripePublishableKey = eventDetails?.event?.collectors?.stripe?.pub;

            if (!clientSecret) {
                console.error('No stripe client secret');
                return;
            }
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

    //Al mount si verifica se c'è un processo di pagamento in sospeso oppure no
    useEffect(() => {

        const label = localStorage.getItem("_func");
        if (!label) {
            initializeStripe();
        }

        if (label === "stripe_payment") {
            console.log("Abbiamo trovato un processo di pagamento in sospeso ..")
            waitBackendConfirmationOfPayment();
        }

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
            savePendingProcess("stripe_payment"); //For redirect
            // Conferma il pagamento con redirect personalizzato
            const { error } = await stripeInstance.confirmPayment({
                elements: stripeElements,
                confirmParams: {
                    return_url: window.location.origin +
                        window.location.pathname +
                        "?uuid=" +
                        paymentsDetails?.payment?.paymentId +
                        "&account=" +
                        userAddress,
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
            localStorage.removeItem("_func");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="payment-stepper-stripe">
            <div id="payment-element" className="ticket-stripe-form-container"></div>
            {
                !waitForPaymentConfirmation && <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="checkout-btn font-satoshi"
                    style={{
                        cursor: isProcessing ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isProcessing ? 'Elaborazione in corso...' : 'Paga ora'}
                </button>
            }
            {
                waitForPaymentConfirmation &&
                <div className="loader">
                    <Loader message={message} />
                </div>
            }
            {
                isCanceledAllowed &&
                <button
                    onClick={handleCancel}
                    className="ticket-stripe-cancel-btn font-satoshi"
            >
                    Annulla operazione
                </button>
            }
        </div>
    );
};

export default BuyTicketWithStripe;