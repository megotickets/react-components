import { useEffect, useMemo, useState } from "react";
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { loadStripe, Stripe, StripeElements } from "@stripe/stripe-js";
import { PopupModality } from "../interfaces/popup-enum";
import { Stepper } from "../interfaces/interface-stepper";
import { checkPayment, getPayment } from "../utils/BuyTicketUtils";
import { useAccount } from "@megotickets/core";
import { Loader, MegoButton, useLanguage } from "@megotickets/core";
import "../css/pay.css";
import { getLoginDataInfo } from "@/utils/LoginUtils";

const BuyTicketWithStripe = () => {
    const { eventDetails, paymentsDetails, openPopup, setStepper, savePendingProcess, resetPaymentProcessing } = useBuyTicketContext();
    const [stripeElements, setStripeElements] = useState<StripeElements | null>(null);
    const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const { address } = useAccount();
    const [message, setMessage] = useState<string>("");
    const { t, language } = useLanguage()
    const [waitForPaymentConfirmation, setWaitForPaymentConfirmation] = useState<boolean>(false);
    const [isCanceledAllowed, setIsCanceledAllowed] = useState<boolean>(true);

    console.log('paymentsDetails', paymentsDetails);
    console.log('eventDetails', eventDetails);

    const handleCancel = () => {
        localStorage.removeItem("_func");
        setIsProcessing(false);
        setWaitForPaymentConfirmation(false);
        resetPaymentProcessing();
    }

    const waitBackendConfirmationOfPayment = async (): Promise<(() => void) | undefined> => {
        let intervalIdInternal: NodeJS.Timeout | null = null;
        const cleanup = () => {
            if (intervalIdInternal) {
                clearInterval(intervalIdInternal);
                console.log("Cleaned up payment check interval.");
            }
        };

        try {
            setWaitForPaymentConfirmation(true);
            setIsCanceledAllowed(false);
            setMessage(t('waitingForPaymentConfirmation', 'payments'))
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
                setMessage(t('gettingPaymentDetails', 'payments'))
                const payment = await getPayment(uuid);
                console.log('payment', payment);
                if (payment.error == false) {
                    console.log("Payment details found! .. check payment status")
                    intervalIdInternal = setInterval(async () => {
                        console.log('checkPayment with uuid:', uuid);
                        const result = await checkPayment(uuid);
                        console.log('checkPayment:', result);
                        if (result.error == false) {
                            cleanup();
                            localStorage.removeItem("_func");
                            setStepper(Stepper.NFT_Mint);
                        } else {
                            console.log("Payment not confirmed yet...");
                        }
                    }, 5000);
                    return cleanup;
                } else {
                    openPopup({
                        title: t('error', 'payments'),
                        message: t('errorWaitingForPaymentConfirmation', 'payments') + payment.message || t('unknownError', 'payments'),
                        modality: PopupModality.Error,
                        isOpen: true
                    });
                    localStorage.removeItem("_func");
                    setIsProcessing(false);
                    setWaitForPaymentConfirmation(false);
                    return undefined;
                }
            } else {
                console.log("There was _func but no payment parameters so the process is cancelled and we start over")
                localStorage.removeItem("_func");
                setIsProcessing(false);
                setWaitForPaymentConfirmation(false);
                return undefined;
            }
        } catch (error: any) {
            console.error("Error waiting for payment confirmation:", error);
            openPopup({
                title: t('error', 'payments'),
                message: t('errorWaitingForPaymentConfirmation', 'payments') + error.message || t('unknownError', 'payments'),
                modality: PopupModality.Error,
                isOpen: true
            });
            localStorage.removeItem("_func");
            setIsProcessing(false);
            setWaitForPaymentConfirmation(false);
            return undefined;
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
            if (!stripePublishableKey) {
                console.error('No stripe publishable key');
                return;
            }

            const stripePromise = loadStripe(stripePublishableKey);
            const stripe = await stripePromise;

            if (!stripe) {
                console.error('Unable to load Stripe');
                openPopup({
                    title: t('error', 'payments'),
                    message: t('errorInStripeInitialization', 'payments') + " (Unable to load Stripe)",
                    modality: PopupModality.Error,
                    isOpen: true
                });
                return;
            }

            const elements = stripe.elements({
                clientSecret,
                locale: language ?? "en",
                appearance: {
                    variables: {
                        fontFamily: "Sohne, system-ui, sans-serif",
                        fontWeightNormal: "450",
                        borderRadius: "8px",
                        colorBackground: "transparent",
                        colorPrimary: "#00251d",
                        colorPrimaryText: "#fff",
                        colorText: "#ffffff",
                        colorTextSecondary: "#ffffff",
                        colorTextPlaceholder: "#e6e6e6",
                        colorIconTab: "white",
                        colorIconTabHover: "white",
                        colorLogo: "dark",
                    },
                    rules: {
                        ".Input, .Block": {
                            backgroundColor: "transparent",
                            border: "1px solid white",
                            padding: "15px 20px",
                            boxShadow: "0",
                        },
                        ".Tab": {
                            backgroundColor: "transparent",
                        },
                        ".Tab--selected": {
                            backgroundColor: "#ffffff",
                        },
                        ".p-Tab .Tab .p-Tab--selected .Tab--selected": {
                            backgroundColor: "#ffffff",
                        },
                        ".Tab:hover": {
                            color: "white",
                        },
                        ".p-TabIcon": {
                            color: "black",
                        },
                        ".RedirectText": {
                            color: "white",
                        },
                    },
                },
            });

            const paymentElement = elements.create("payment");
            const paymentElementContainer = document.getElementById('payment-element');

            if (paymentElementContainer) {
                paymentElement.mount("#payment-element");
                setStripeElements(elements);
                setStripeInstance(stripe);
                console.log("Stripe initialized and mounted.");
            } else {
                console.warn("Payment element container not found when trying to initialize Stripe. This might be expected if waiting for payment confirmation.");
            }
        } catch (error: any) {
            console.error("Error in Stripe initialization:", error);
            openPopup({
                title: t('error', 'payments'),
                message: t('errorInStripeInitialization', 'payments') + error.message || t('unknownError', 'payments'),
                modality: PopupModality.Error,
                isOpen: true
            });
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        let cleanupFunction: (() => void) | undefined;

        const initOrWait = async () => {
            const label = localStorage.getItem("_func");
            if (!label) {
                if (!waitForPaymentConfirmation) {
                    if(paymentsDetails?.payment?.stripePayment?.client_secret && eventDetails?.event?.collectors?.stripe?.pub) {
                         initializeStripe();
                    } else {
                        console.log("Waiting for payment/event details before initializing Stripe...");
                    }
                } else {
                     console.log("Waiting for payment confirmation, skipping Stripe initialization.");
                }
            } else if (label === "stripe_payment") {
                console.log("Found pending payment process, starting wait...");
                cleanupFunction = await waitBackendConfirmationOfPayment();
            }
        };

        initOrWait();

        return () => {
            if (cleanupFunction) {
                console.log("Running cleanup from useEffect...");
                cleanupFunction();
            }
        };

    }, [paymentsDetails, eventDetails, waitForPaymentConfirmation, language]);

    const handlePayment = async () => {
        if (!stripeInstance || !stripeElements) {
            openPopup({
                title: t('error', 'payments'),
                message: t('stripeWasNotInitializedCorrectly', 'payments'),
                modality: PopupModality.Error,
                isOpen: true
            });
            return;
        }

        try {
            setIsProcessing(true);
            savePendingProcess("stripe_payment");
            const userAddress = getLoginDataInfo()?.loggedAs || address || ""
            if (!userAddress) {
                 console.error("User address not found for redirect.");
                 throw new Error("User address not available.");
            }
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
                console.error("Stripe confirmPayment error:", error);
                throw error;
            }
        } catch (error: any) {
            console.error("Error during payment confirmation:", error);
            openPopup({
                title: t('error', 'payments'),
                message: error.message || t('anErrorOccurredDuringPayment', 'payments'),
                modality: PopupModality.Error,
                isOpen: true
            });
            localStorage.removeItem("_func");
            setIsProcessing(false);
        }
    };

    return (
        <div className="payment-stepper-stripe" style={{ flexGrow: 1 }}>
            {
                !waitForPaymentConfirmation &&
                (paymentsDetails?.payment?.stripePayment?.client_secret && eventDetails?.event?.collectors?.stripe?.pub) &&
                <div id="payment-element" className="ticket-stripe-form-container"></div>
            }
            {
                 !waitForPaymentConfirmation &&
                 !(paymentsDetails?.payment?.stripePayment?.client_secret && eventDetails?.event?.collectors?.stripe?.pub) &&
                 <div className="ticket-stripe-form-container">
                    <p>{t('loadingStripeConfiguration', 'payments')}</p>
                 </div>
            }
            {
                waitForPaymentConfirmation &&
                <div className="loader">
                    <Loader message={message} />
                </div>
            }
            <div className="chooseType-btn-container">
                {
                    !waitForPaymentConfirmation && stripeInstance && stripeElements && !isProcessing &&
                    <MegoButton
                        onClick={handlePayment}
                        className={"font-satoshi chooseType-btn"}
                    >
                       {t('payNow', 'payments')}
                    </MegoButton>
                }
                {
                     !waitForPaymentConfirmation && isProcessing &&
                     <MegoButton
                         disabled={true}
                         className={"font-satoshi disabled chooseType-btn"}
                     >
                        {t('processing', 'payments')}
                     </MegoButton>
                }
            </div>
            <div className="chooseType-btn-container">
                {
                    isCanceledAllowed && !waitForPaymentConfirmation &&
                    <MegoButton
                        onClick={handleCancel}
                        className="font-satoshi chooseType-btn cancel-btn"
                    >
                        {t('cancelOperation', 'payments')}
                    </MegoButton>
                }
            </div>
        </div>

    );
};

export default BuyTicketWithStripe;