import React, { useEffect, useState } from "react";
import "../mego-style.css";
import StripeIcon from "../icons/StripeIcon";
import CrossIcon from "../icons/CrossIcon";
import { processStripePayment } from "./PaymentUtils";
import MegoIcon from "../icons/MegoIcon";
import { ChainPayment, PaymentMethod, PaymentModalityProps } from "interfaces/PaymentMethod";
import { useAccount, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import { resolveChainIdByName, resolveChainImageByName } from "./CryptoUtils";
import { useWeb3Context } from "../web3-context";
interface Chain {
  name: string;
  chainId: number;
  icon: string;
}
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  image?: string;
  currency?: string;
  itemName: string;
  priceId: string;
  stripePublicKey?: string;
  receiverAddress?: string;
  onPaymentComplete?: (paymentId: string) => void;
  paymentModality?: PaymentModalityProps;
  chains?: ChainPayment;
}

export function PaymentModal({
  isOpen,
  onClose,
  amount,
  image,
  currency = "EUR",
  itemName,
  priceId,
  stripePublicKey,
  receiverAddress,
  paymentModality = {
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
  }
}: PaymentModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { isConnected } = useAccount();
  const { sendTransaction, isPending } = useSendTransaction();
  const { loggedAs, setServiceAutoChainChange, provider } = useWeb3Context();
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // Durata dell'animazione
  }

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
      // Imposta isProcessing a true all'inizio
      setIsProcessing(true);


      if (isConnected) {
        payWithRainbowkit(amount, chainId);
      } else if (loggedAs) {
        alert("Pagamento con MEGO a breve");
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
      //Check if connected to a wallet with rainbowkit
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

      //Prevent auto change chain
      setServiceAutoChainChange(false);

      try {
        // Switch to the correct chain
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (switchError) {
        console.error("Errore durante il cambio di catena:", switchError);
        setIsProcessing(false); // Reset in caso di errore nel cambio catena
        return;
      }
      //useSendTransaction for pay with crypto through rainbowkit (use etherium chain)
      sendTransaction({ to: receiverAddress as `0x${string}`, value: parseEther(amount.toString()), chainId: chainId });

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

  if (!isOpen && !isClosing) return null;

  return (
    <div className={`${isClosing ? "closing" : ""} mego-modal-container payment-modal`}>
      <div className="mego-modal-backdrop" onClick={handleClose}></div>
      <div
        className="mego-modal-wrapper payment-wrapper"
        style={{
          height: "50vh", // Arriva a metà schermo
          maxHeight: "50vh"
        }}
      >
        <div className="mego-modal-header">
          <div className="mego-modal-logo">
            <h3 className="payment-title">Pagamento</h3>
          </div>
          <div className="mego-modal-buttons">
            <div onClick={handleClose} style={{ marginRight: '0.5rem', marginTop: '0.5rem', cursor: 'pointer' }}>
              <CrossIcon onClick={handleClose} height={16} width={16} />
            </div>
          </div>
        </div>
        <div className="mego-modal-content payment-content">
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

              {
                Object.keys(paymentModality?.chains || {}).map((chainName) => {
                  return (
                    <button
                      key={chainName}
                      className="mego-modal-button payment-button"
                      onClick={() => handlePayment(
                        { type: chainName as keyof ChainPayment },
                        amount,
                        resolveChainIdByName(chainName as keyof ChainPayment)
                      )}
                      disabled={provider !== "walletConnect"}
                      style={{
                        opacity: provider === "walletConnect" ? 1 : 0.5,
                        cursor: provider === "walletConnect" ? "pointer" : "not-allowed"
                      }}
                    >
                      <img height={20} width={20} src={resolveChainImageByName(chainName as keyof ChainPayment)} alt="Chain" className="payment-chain-image" />
                      <p className="mego-font-medium">Paga con {chainName}</p>
                    </button>
                  )
                })
              }

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
          )
          }
        </div>
      </div>
    </div>
  );
}
