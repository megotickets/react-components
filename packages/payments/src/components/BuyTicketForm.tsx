import { useState, useEffect, useMemo } from 'react';
import { useBuyTicketContext } from '../context/BuyTicketContext';
import { Stepper } from '../interfaces/interface-stepper';
import { PaymentsCollectors } from './PaymentsCollectors';
import { PopupModality } from '../interfaces/popup-enum';
import { MegoButton, useAccount, useLanguage } from '@megotickets/core';
import { Loader } from '@megotickets/core';
import "../css/pay.css";


const fastDebug = false

export const BuyTicketForm: React.FC = () => {
    const { eventDetails, setStepper, setClaimMetadata, setEmailOfBuyer, setProcessor, openPopup, resetPaymentProcessing, discountCode, setDiscountCode, termsAndConditionsLink } = useBuyTicketContext();
    const [email, setEmail] = useState(fastDebug ? "test@test.com" : '');
    const [termsAccepted, setTermsAccepted] = useState(fastDebug ? true : false);
    const [shareEmail, setShareEmail] = useState(fastDebug ? true : false);
    const [metadataValues, setMetadataValues] = useState<Record<string, string>>({});
    const [isFormValid, setIsFormValid] = useState(false);
    const { address } = useAccount();
    const [isNFTCheckLoading, setIsNFTCheckLoading] = useState(false);
    const { t } = useLanguage()

    console.log(eventDetails)

    let count = 0;

    const userAddress = useMemo(() => {
        //Search loggedAs o signedAs nei params dell'url
        const urlParams = new URLSearchParams(window.location.search);
        const loggedAs = urlParams.get('loggedAs');
        const signedAs = urlParams.get('signedAs');
        return address || loggedAs || signedAs || ""
    }, [address, window.location.search])


    const init = async () => {
        try {

            if (eventDetails?.event?.claim_metadata && eventDetails.event.claim_metadata.length > 0) {
                const initialValues: Record<string, string> = {};
                eventDetails.event.claim_metadata.forEach((_: any, index: string | number) => {
                    initialValues[index] = '';
                });
                setMetadataValues(initialValues);
            }

            // Ogni ticket gratuito deve essere pagato con Stripe (0)
            if (eventDetails?.event?.price === 0) {
                setProcessor('stripe');
            }
        } catch (error) {
            openPopup({ title: t('error', 'payments'), message: t('generalError', 'payments'), modality: PopupModality.Error, isOpen: true })
            resetPaymentProcessing()
            return;
        } finally {
            setIsNFTCheckLoading(false);
        }
    }

    // Inizializza i campi di metadata quando eventDetails cambia
    useEffect(() => {
        if (count === 0) {
            init();
            count++;
        }
    }, [count]);

    const handleCheckout = () => {
        setEmailOfBuyer(email);
        setClaimMetadata(metadataValues);
        setStepper(Stepper.Processing);
    };

    const handleMetadataChange = (index: number, value: string) => {
        setMetadataValues(prev => ({
            ...prev,
            [index]: value
        }));
    };

    // Verifica se tutti i campi sono stati compilati
    useEffect(() => {
        const isEmailValid = email.trim() !== '' && email.includes('@');
        const areTermsAccepted = termsAccepted && shareEmail;

        console.log({
            isEmailValid,
            areTermsAccepted,
            metadataValues,
            metadataLength: eventDetails?.event?.claim_metadata?.length || 0,
            filledMetadataCount: Object.keys(metadataValues).length
        });

        setIsFormValid(isEmailValid && areTermsAccepted);
    }, [email, termsAccepted, shareEmail, metadataValues, eventDetails]);

    const title = eventDetails?.event?.price === 0 ? t('claimYourFreeTicket', 'payments') : t('buyYourTicket', 'payments');

    return (
        <div className="payment-stepper-container">
            {
                !isNFTCheckLoading &&
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <div className="title-subtitle-container">
                        <h1 className="font-satoshi title">{title}</h1>
                        <p className="font-satoshi subtitle">{t('enterRequiredInformationToContinue', 'payments')}</p>
                    </div>

                    {eventDetails?.event?.price > 0 && (
                        <div style={{ width: '100%', marginBottom: '0.75rem' }}>
                            <input
                                type="text"
                                placeholder={t('discountCode', 'payments')}
                                value={discountCode || ''}
                                onChange={(e) => setDiscountCode(e.target.value)}
                                className="input-field"
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        {eventDetails?.event?.claim_metadata && eventDetails.event.claim_metadata.map((metadata: string, index: number) => {
                            // Determina se il campo richiede un input o una textarea in base alla lunghezza
                            const isLongText = metadata.length > 100;
                            const isFieldEmpty = !metadataValues[index] || metadataValues[index].trim() === '';

                            return (
                                <div key={index} style={{ width: '100%', marginBottom: '0.75rem' }}>
                                    {isLongText ? (
                                        <textarea
                                            placeholder={metadata}
                                            value={metadataValues[index] || ''}
                                            onChange={(e) => handleMetadataChange(index, e.target.value)}
                                            className="ticket-form-textarea"
                                            rows={4}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            placeholder={metadata}
                                            value={metadataValues[index] || ''}
                                            onChange={(e) => handleMetadataChange(index, e.target.value)}
                                            className="input-field"
                                        />
                                    )}
                                </div>
                            );
                        })}

                        <input
                            type="email"
                            id="email"
                            placeholder={t('email', 'payments')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            style={{
                                border: `1px solid ${!email || !email.includes('@') ? '#FCA5A5' : 'white'}`,
                            }}
                        />
                    </div>

                    <div className="ticket-form-checkbox-container">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            style={{ marginRight: '0.5rem', marginTop: '0.25rem' }}
                        />
                        <label htmlFor="terms" className="font-satoshi checkbox-label">
                            {t('iAcceptThe', 'payments')} <a href={termsAndConditionsLink} target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA', textDecoration: 'underline' }}>{t('termsAndConditions', 'payments')}</a>.
                        </label>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1rem', width: '100%' }}>
                        <input
                            type="checkbox"
                            id="shareEmail"
                            checked={shareEmail}
                            onChange={(e) => setShareEmail(e.target.checked)}
                            style={{ marginRight: '0.5rem', marginTop: '0.25rem' }}
                        />
                        <label htmlFor="shareEmail" className="font-satoshi checkbox-label">
                            {t('iAcceptToShareMyEmail', 'payments')}
                        </label>
                    </div>

                    <PaymentsCollectors />

                    <MegoButton
                        disabled={!isFormValid}
                        onClick={handleCheckout}
                        className="font-satoshi"
                        style={{
                            opacity: !isFormValid ? 0.5 : 1,
                            cursor: !isFormValid ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {t('checkout', 'payments')}
                    </MegoButton>
                </div>
            }
            {
                isNFTCheckLoading &&
                <div className="loader">
                    <Loader message={t('checkingNFT', 'payments')} />
                </div>
            }
        </div>
    );
};

