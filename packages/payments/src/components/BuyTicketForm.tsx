import { useState, useEffect, useMemo } from 'react';
import { useBuyTicketContext } from '../context/BuyTicketContext';
import { Stepper } from '../interfaces/interface-stepper';
import { PaymentsCollectors } from './PaymentsCollectors';
import { checkNFT } from '../utils/BuyTicketUtils';
import { PopupModality } from '../interfaces/popup-enum';
import { useAccount } from '@megotickets/core';
import { Loader } from '@megotickets/core';
import { isConnectedWithMego } from '../utils/utils';


const fastDebug = true

export const BuyTicketForm: React.FC = () => {
    const { eventDetails, setStepper, setClaimMetadata, setEmailOfBuyer, setProcessor, openPopup, resetPaymentProcessing } = useBuyTicketContext();
    const [email, setEmail] = useState(fastDebug ? "test@test.com" : '');
    const [termsAccepted, setTermsAccepted] = useState(fastDebug ? true : false);
    const [shareEmail, setShareEmail] = useState(fastDebug ? true : false);
    const [metadataValues, setMetadataValues] = useState<Record<string, string>>({});
    const [isFormValid, setIsFormValid] = useState(false);
    const { address } = useAccount();
    const [isNFTCheckLoading, setIsNFTCheckLoading] = useState(false);

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

            // Check nft before processing other steps
            setIsNFTCheckLoading(true);
            const res = await checkNFT(eventDetails?.event?.identifier, userAddress);
            let tokenId = res.tokenId;
            if (tokenId !== null) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                openPopup({ title: 'Ticket already minted', message: 'You already have a ticket for this payment.', modality: PopupModality.Error, isOpen: true })
                resetPaymentProcessing()
                return;
            }

            //Check is mego
            if(isConnectedWithMego() && eventDetails?.event?.price > 0){
                await new Promise(resolve => setTimeout(resolve, 1000));
                openPopup({ title: 'Mego wallet not supported', message: 'Please connect your traditional wallet to continue', modality: PopupModality.Error, isOpen: true })
                resetPaymentProcessing()
                return;
            }

            // Ogni ticket gratuito deve essere pagato con Stripe (0)
            if (eventDetails?.event?.price === 0) {
                setProcessor('stripe');
            }
        } catch (error) {
            openPopup({ title: 'Errore', message: 'Errore generale', modality: PopupModality.Error, isOpen: true })
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

        // Verifica se tutti i campi di metadata sono stati compilati
        let areMetadataFieldsValid = true;

        if (eventDetails?.event?.claim_metadata && eventDetails.event.claim_metadata.length > 0) {
            const metadataLength = eventDetails.event.claim_metadata.length;

            for (let i = 0; i < metadataLength; i++) {
                const value = metadataValues[i];
                if (value === undefined || value.trim() === '') {
                    areMetadataFieldsValid = false;
                    break;
                }
            }
        }

        console.log({
            isEmailValid,
            areTermsAccepted,
            areMetadataFieldsValid,
            metadataValues,
            metadataLength: eventDetails?.event?.claim_metadata?.length || 0,
            filledMetadataCount: Object.keys(metadataValues).length
        });

        setIsFormValid(isEmailValid && areTermsAccepted && areMetadataFieldsValid);
    }, [email, termsAccepted, shareEmail, metadataValues, eventDetails]);

    const title = eventDetails?.event?.price === 0 ? "Claim your free ticket" : "Buy your ticket";

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            {
                !isNFTCheckLoading &&
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <h1 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>{title}</h1>
                        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6B7280' }}>Enter required information to continue</p>
                    </div>

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
                                            style={{
                                                marginBottom: '10px',
                                                width: '100%',
                                                borderRadius: '20px',
                                                border: `1px solid ${isFieldEmpty ? '#FCA5A5' : 'white'}`,
                                                backgroundColor: 'black',
                                                color: 'white',
                                                padding: '8px 16px',
                                                resize: 'vertical'
                                            }}
                                            rows={4}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            placeholder={metadata}
                                            value={metadataValues[index] || ''}
                                            onChange={(e) => handleMetadataChange(index, e.target.value)}
                                            style={{
                                                marginBottom: '10px',
                                                width: '100%',
                                                borderRadius: '20px',
                                                border: `1px solid ${isFieldEmpty ? '#FCA5A5' : 'white'}`,
                                                backgroundColor: 'black',
                                                color: 'white',
                                                padding: '8px 16px'
                                            }}
                                        />
                                    )}
                                </div>
                            );
                        })}

                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                marginBottom: '10px',
                                width: '100%',
                                borderRadius: '20px',
                                border: `1px solid ${!email || !email.includes('@') ? '#FCA5A5' : 'white'}`,
                                backgroundColor: 'black',
                                color: 'white',
                                padding: '8px 16px'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem', width: '100%' }}>
                        <input
                            type="checkbox"
                            id="terms"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            style={{ marginRight: '0.5rem', marginTop: '0.25rem' }}
                        />
                        <label htmlFor="terms" style={{ fontSize: '0.875rem', color: 'white' }}>
                            I agree to the <a href="#" style={{ color: '#60A5FA', textDecoration: 'underline' }}>Terms and Conditions</a>.
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
                        <label htmlFor="shareEmail" style={{ fontSize: '0.875rem', color: 'white' }}>
                            I accept to share my e-mail with event organizers.
                        </label>
                    </div>

                    <PaymentsCollectors />

                    <button
                        disabled={!isFormValid}
                        onClick={handleCheckout}
                        style={{
                            width: '100%',
                            background: 'black',
                            color: 'white',
                            fontWeight: 'bold',
                            padding: '0.5rem 1rem',
                            borderRadius: '9999px',
                            border: '1px solid white',
                            opacity: !isFormValid ? 0.5 : 1,
                            cursor: !isFormValid ? 'not-allowed' : 'pointer',
                            transition: 'opacity 0.3s'
                        }}
                    >
                        Checkout
                    </button>
                </div>
            }
            {
                isNFTCheckLoading && 
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
                    <Loader message={"Checking NFT..."} />
                </div>
            }
        </div>
    );
};

