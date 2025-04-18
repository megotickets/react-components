import { useState, useEffect, useMemo } from 'react';
import { useBuyTicketContext } from '../context/BuyTicketContext';
import { Stepper } from '../interfaces/interface-stepper';
import { PaymentsCollectors } from './PaymentsCollectors';
import { PopupModality } from '../interfaces/popup-enum';
import { MegoButton, useAccount, useLanguage } from '@megotickets/core';
import { Loader } from '@megotickets/core';
import "../css/pay.css";
import { MegoMetadataInputType } from '../interfaces/metadata';
import { ShareEmailOptions } from '@/interfaces/interface-share-email';
import { isConnectedWithMego } from "@/utils/utils";
import { getLoginDataInfo } from '@/utils/LoginUtils';

const fastDebug = false

export const BuyTicketForm: React.FC = () => {
    const { eventDetails, setStepper, setClaimMetadata, setEmailOfBuyer, setProcessor, openPopup, resetPaymentProcessing, discountCode, setDiscountCode, termsAndConditionsLink, metadataConfig, shareEmail: shareEmailContext, amountOfTicket, setAmountOfTicket } = useBuyTicketContext();
    const [email, setEmail] = useState(fastDebug ? "test@test.com" : '');
    const [termsAccepted, setTermsAccepted] = useState(fastDebug ? true : false);
    const [shareEmail, setShareEmail] = useState(fastDebug ? true : false);
    const [metadataValues, setMetadataValues] = useState<Record<string, string>>({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [isNFTCheckLoading, setIsNFTCheckLoading] = useState(false);
    const { t } = useLanguage()

    console.log(eventDetails)

    let count = 0;

    useEffect(() => {
        if (shareEmailContext === ShareEmailOptions.DISABLED) {
            setShareEmail(true) //Into disable mode, the field is invisible but checked
        }
    }, [shareEmailContext]);

    //Auto fill email if connected with MEgo
    useEffect(() => {
        if (isConnectedWithMego()) {
            const _email = getLoginDataInfo()?.email || ""
            setEmail(_email)
        }
    }, [])


    const init = async () => {
        try {

            if (eventDetails?.event?.claim_metadata && eventDetails.event.claim_metadata.length > 0) {
                const initialValues: Record<string, string> = {};
                eventDetails.event.claim_metadata.forEach((_: any, index: number) => {
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

    const handleMetadataChange = (key: number, value: string) => {
        setMetadataValues(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Verifica se tutti i campi sono stati compilati
    useEffect(() => {
        const isEmailValid = email.trim() !== '' && email.includes('@');
        const areTermsValid = termsAccepted;
        let isSharedEmailValid = true;

        console.log("shareEmailContext", shareEmailContext)

        if (!shareEmailContext || shareEmailContext === ShareEmailOptions.MANDATORY) {
            isSharedEmailValid = shareEmail;
        }

        console.log({
            isEmailValid,
            areTermsValid,
            isSharedEmailValid,
            metadataValues,
            metadataLength: eventDetails?.event?.claim_metadata?.length || 0,
            filledMetadataCount: Object.keys(metadataValues).length
        });

        setIsFormValid(isEmailValid && areTermsValid && isSharedEmailValid);
    }, [email, termsAccepted, shareEmail, metadataValues, eventDetails, shareEmailContext]);

    const title = eventDetails?.event?.price === 0 ? t('claimYourFreeTicket', 'payments') 
    : amountOfTicket > 1 ? t('buyYourTickets', 'payments') : t('buyYourTicket', 'payments');

    return (
        <div className="payment-form-container">
            {
                !isNFTCheckLoading &&
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>


                    <div>
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
                            {eventDetails?.event?.claim_metadata && eventDetails.event.claim_metadata.map((metadataString: string, index: number) => {

                                const fieldId = `metadata-${index}-${metadataString}`;
                                let matchingConfig = metadataConfig?.find(config => config.metadata === fieldId);

                                let fieldElement: React.ReactNode = null;

                                if (matchingConfig && matchingConfig.type === MegoMetadataInputType.SELECT && matchingConfig.options) {
                                    fieldElement = (
                                        <select
                                            id={fieldId}
                                            value={metadataValues[index] || ''}
                                            onChange={(e) => handleMetadataChange(index, e.target.value)}
                                            className="input-field"
                                        >
                                            <option value="" disabled>{matchingConfig.placeholder || `${t('selectOption', 'payments')} (${metadataString})`}</option>
                                            {matchingConfig.options.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    );
                                } else if (matchingConfig && matchingConfig.type === MegoMetadataInputType.TEXTAREA) {
                                    fieldElement = (
                                        <textarea
                                            id={fieldId}
                                            placeholder={matchingConfig.placeholder || metadataString}
                                            value={metadataValues[index] || ''}
                                            onChange={(e) => handleMetadataChange(index, e.target.value)}
                                            className="ticket-form-textarea"
                                            rows={4}
                                        />
                                    );
                                } else {
                                    const isLongText = metadataString.length > 100;
                                    fieldElement = isLongText ? (
                                        <textarea
                                            id={fieldId}
                                            placeholder={metadataString}
                                            value={metadataValues[index] || ''}
                                            onChange={(e) => handleMetadataChange(index, e.target.value)}
                                            className="ticket-form-textarea"
                                            rows={4}
                                        />
                                    ) : (
                                        <input
                                            id={fieldId}
                                            type="text"
                                            placeholder={metadataString}
                                            value={metadataValues[index] || ''}
                                            onChange={(e) => handleMetadataChange(index, e.target.value)}
                                            className="input-field"
                                        />
                                    );
                                }

                                return (
                                    <div key={index} style={{ width: '100%', marginBottom: '0.75rem' }}>
                                        {fieldElement}
                                    </div>
                                );
                            })}

                            {!isConnectedWithMego() && <input
                                type="email"
                                id="email"
                                placeholder={t('email', 'payments')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                style={{
                                    border: `1px solid ${!email || !email.includes('@') ? '#FCA5A5' : 'white'}`,
                                }}
                            />}
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

                        {shareEmailContext !== ShareEmailOptions.DISABLED &&
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
                        }

                        {/* Amount of ticket using select 1 - 10 */}
                        <div style={{ width: '100%', marginBottom: '0.75rem' }}>
                            <label className="font-satoshi" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                {t('selectTicketQuantity', 'payments')}
                            </label>
                            <select
                                id="ticketQuantity"
                                value={amountOfTicket || 1}
                                onChange={(e) => setAmountOfTicket(parseInt(e.target.value))}
                                className="input-field"
                            >
                                {Array.from({ length: 10 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                        </div>

                        <PaymentsCollectors />
                    </div>

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
                    <Loader message={amountOfTicket > 1 ? t('checkingNFTs', 'payments') : t('checkingNFT', 'payments')} />
                </div>
            }
        </div>
    );
};

