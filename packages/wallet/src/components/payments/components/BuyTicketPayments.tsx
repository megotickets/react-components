import React, { useState, useEffect } from "react";
import { useBuyTicketContext } from "../context/BuyTicketContext";
import { ChainPayment, PaymentMethod, PaymentModalityProps } from "interfaces/PaymentMethod";
import { processStripePayment } from "../utils/PaymentUtils";
import { resolveAmountbyChain, resolveChainIdByName, resolveChainImageByName } from "../utils/CryptoUtils";
import { useAccount, useSendTransaction, useSwitchChain } from "wagmi";
import { parseEther } from "viem";
import { useWeb3Context } from "../../web3-context";
import StripeIcon from "../../icons/StripeIcon";
import MegoIcon from "../../icons/MegoIcon";
import { Stepper } from "../interfaces/interface-stepper";

export const BuyTicketPayments = () => {
    const { eventDetails, setStepper } = useBuyTicketContext();
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Dati di pagamento estratti da eventDetails
    const amount = eventDetails?.event.price || 0;
    const currency = eventDetails?.event.currency || "EUR";
    const itemName = eventDetails?.event.name || "Biglietto";
    const image = eventDetails?.event.image;
    const priceId = eventDetails?.event.priceId || "";
    const stripePublicKey = eventDetails?.event.stripePublicKey || "";
    const receiverAddress = eventDetails?.event.receiverAddress || "";
    
    // Modalità di pagamento disponibili
    const paymentModality: PaymentModalityProps = eventDetails?.paymentModality || {
        stripe: true,
        erc20: true,
        chains: {
            eth: true,
            optimism: true,
            arbitrum: true,
            polygon: true,
            usdcETH: true,
            usdcPolygon: true,
            usdtEthereum: true,
            daiETH: true
        }
    };

    const { isConnected } = useAccount();
    const { sendTransaction, isPending } = useSendTransaction();
    const { loggedAs, setServiceAutoChainChange, provider, forceChainId } = useWeb3Context();
    const { switchChain } = useSwitchChain();

    // Ripristina l'auto chain change quando il pagamento è completato
    useEffect(() => {
        if (!isPending && !isProcessing) {
            setServiceAutoChainChange(true);
            if (forceChainId !== 0) {
                switchChain({ chainId: forceChainId });
            }
            setIsProcessing(false);
        }
    }, [isPending]);

    function handlePayment(paymentMethod: PaymentMethod, amount?: number, chainId?: number) {
        if (paymentMethod.type === "stripe") {
            handleStripePayment();
            return;
        }

        if (Object.keys(paymentModality?.chains || {}).includes(paymentMethod.type)) {
            if (!amount || !chainId) {
                alert("Si prega di fornire l'importo e la catena di rete");
                return;
            }
            handlePayWithCrypto(amount, chainId);
            return;
        }

        if (paymentMethod.type === "erc20") {
            handleErc20Payment();
            return;
        }
    }

    function handleStripePayment() {
        try {
            if (!priceId) {
                alert("Si prega di fornire il priceId del prodotto");
            } else {
                setIsProcessing(true);
                processStripePayment({
                    priceId: priceId,
                    stripePublicKey: stripePublicKey || ""
                });
                
                // Passa allo step successivo dopo l'avvio del pagamento
                setStepper(Stepper.Processing);
            }
        } catch (error) {
            console.error("Errore durante il pagamento:", error);
            alert("Si è verificato un errore durante il pagamento");
        } finally {
            setIsProcessing(false);
        }
    }

    async function handlePayWithCrypto(amount: number, chainId: number) {
        try {
            setIsProcessing(true);

            if (isConnected) {
                payWithRainbowkit(amount, chainId);
            } else {
                alert("Pagamento non disponibile in questo momento");
            }
        } catch (error) {
            console.error("Errore durante il pagamento:", error);
            alert("Si è verificato un errore durante il pagamento");
            setIsProcessing(false);
        }
    }

    const payWithRainbowkit = async (amount: number, chainId: number) => {
        try {
            if (!isConnected) {
                alert("Si prega di connettere un wallet con Rainbowkit");
                setIsProcessing(false);
                return;
            }

            if (!receiverAddress) {
                alert("Si prega di fornire l'indirizzo del ricevente");
                setIsProcessing(false);
                return;
            }

            // Impedisce il cambio automatico di catena
            setServiceAutoChainChange(false);

            try {
                // Passa alla catena corretta
                switchChain({ chainId: chainId });
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (switchError) {
                console.error("Errore durante il cambio di catena:", switchError);
                setServiceAutoChainChange(true);
                setIsProcessing(false);
                return;
            }
            
            // Invia la transazione
            sendTransaction({ 
                to: receiverAddress as `0x${string}`, 
                value: parseEther(amount.toString()), 
                chainId: chainId 
            });
            
            // Passa allo step successivo dopo l'avvio del pagamento
            setStepper(Stepper.Processing);
        } catch (error) {
            console.error("Errore durante il pagamento:", error);
            alert("Si è verificato un errore durante il pagamento");
        } finally {
            setIsProcessing(false);
        }
    }

    function handleErc20Payment() {
        alert("Funzionalità non disponibile");
    }

    return (
        <div className="payment-container">
            <div className="payment-details">
                <div className="payment-image-container">
                    {image && <img src={image} alt="Item" className="payment-image" />}
                </div>

                <h2 className="payment-item-name">{itemName}</h2>
                <p className="payment-amount">{amount.toFixed(2)} {currency}</p>
            </div>

            {isProcessing || isPending ? (
                <div className="mego-loader-div">
                    <div className="mego-loader" />
                    <p className="mego-login-text mego-font-medium" style={{ marginTop: '1rem' }}>
                        Elaborazione del pagamento...
                    </p>
                </div>
            ) : (
                <div className="payment-methods">
                    {/* Stripe */}
                    {paymentModality?.stripe && (
                        <button
                            className="mego-modal-button payment-button"
                            onClick={() => handlePayment({ type: "stripe" })}
                        >
                            <StripeIcon height={20} width={20} style={{ marginRight: '0.5rem' }} />
                            <p className="mego-font-medium">Paga con Stripe</p>
                        </button>
                    )}

                    {/* Opzioni di pagamento con criptovalute */}
                    {Object.keys(paymentModality?.chains || {}).map((chainName) => {
                        return (
                            <button
                                key={chainName}
                                className="mego-modal-button payment-button"
                                onClick={async () => handlePayment(
                                    { type: chainName as keyof ChainPayment },
                                    await resolveAmountbyChain(chainName as keyof ChainPayment, amount),
                                    resolveChainIdByName(chainName as keyof ChainPayment)
                                )}
                                disabled={provider !== "walletConnect"}
                                style={{
                                    opacity: provider === "walletConnect" ? 1 : 0.5,
                                    cursor: provider === "walletConnect" ? "pointer" : "not-allowed"
                                }}
                            >
                                <img 
                                    height={20} 
                                    width={20} 
                                    src={resolveChainImageByName(chainName as keyof ChainPayment)} 
                                    alt="Chain" 
                                    className="payment-chain-image" 
                                />
                                <p className="mego-font-medium">Paga con {chainName}</p>
                            </button>
                        )
                    })}

                    {/* ERC20 */}
                    {paymentModality?.erc20 && (
                        <button
                            className="mego-modal-button payment-button"
                            onClick={() => handlePayment({ type: "erc20" })}
                        >
                            <MegoIcon height={20} width={20} style={{ marginRight: '0.5rem' }} />
                            <p className="mego-font-medium">Paga con ERC20</p>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}