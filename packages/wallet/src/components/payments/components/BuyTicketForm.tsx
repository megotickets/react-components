import { useState, useEffect } from 'react';
import { useBuyTicketContext } from '../context/BuyTicketContext';
import { Stepper } from '../interfaces/interface-stepper';

export const BuyTicketForm: React.FC = () => {
    const { eventDetails, setStepper, setClaimMetadata } = useBuyTicketContext();
    const [email, setEmail] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [shareEmail, setShareEmail] = useState(false);
    const [metadataValues, setMetadataValues] = useState<Record<string, string>>({});
    const [isFormValid, setIsFormValid] = useState(false);

    // Inizializza i campi di metadata quando eventDetails cambia
    useEffect(() => {
        if (eventDetails?.event?.claim_metadata && eventDetails.event.claim_metadata.length > 0) {
            const initialValues: Record<string, string> = {};
            eventDetails.event.claim_metadata.forEach((_: any, index: string | number) => {
                initialValues[index] = '';
            });
            setMetadataValues(initialValues);
        }
    }, [eventDetails]);

    const handleCheckout = () => {
        const isFreeTicket = eventDetails?.event?.price === 0;
        if(isFreeTicket) {
            setClaimMetadata(metadataValues);
            setStepper(Stepper.Processing);
        } else {
            alert("Buy ticket");
        }
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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className='flex flex-col items-center justify-center w-full'>
                <h1 className='text-center text-2xl font-bold'>{title}</h1>
                <p className='text-center text-sm text-gray-500'>Enter required information to continue</p>
            </div>

            <div className='flex flex-col items-center justify-center w-full'>
                {eventDetails?.event?.claim_metadata && eventDetails.event.claim_metadata.map((metadata: string, index: number) => {
                    // Determina se il campo richiede un input o una textarea in base alla lunghezza
                    const isLongText = metadata.length > 100;
                    const isFieldEmpty = !metadataValues[index] || metadataValues[index].trim() === '';
                    
                    return (
                        <div key={index} className="w-full mb-3">
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

            <div className="flex items-start mb-2 w-full">
                <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mr-2 mt-1"
                />
                <label htmlFor="terms" className="text-sm text-white">
                    I agree to the <a href="#" className="text-blue-400 underline">Terms and Conditions</a>.
                </label>
            </div>

            <div className="flex items-start mb-4 w-full">
                <input
                    type="checkbox"
                    id="shareEmail"
                    checked={shareEmail}
                    onChange={(e) => setShareEmail(e.target.checked)}
                    className="mr-2 mt-1"
                />
                <label htmlFor="shareEmail" className="text-sm text-white">
                    I accept to share my e-mail with event organizers.
                </label>
            </div>

            <button
                disabled={!isFormValid}
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-full hover:opacity-90 transition-opacity"
                style={{ 
                    opacity: !isFormValid ? 0.5 : 1, 
                    cursor: !isFormValid ? 'not-allowed' : 'pointer' 
                }}
            >
                Checkout
            </button>
        </div>
    );
};