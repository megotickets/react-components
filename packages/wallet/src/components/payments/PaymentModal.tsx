import React, { useEffect, useState } from "react";
import "../mego-style.css";
import StripeIcon from "../icons/StripeIcon";
import WalletIcon from "../icons/WalletConnect";
import CrossIcon from "../icons/CrossIcon";
import { processStripePayment } from "./PaymentUtils";
import MegoIcon from "../icons/MegoIcon";
import { PaymentMethod } from "interfaces/PaymentMethod";

/**
 * Props for the PaymentModal component
 * @param isOpen - If the modal is open
 * @param onClose - Function to call when the modal is closed
 * @param amount - Amount to pay
 * @param image - Image to display
 * @param currency - Currency of the payment
 * @param itemName - Name of the item to pay for
 * @param priceId - Price ID of the item to pay for
 */
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  image?: string;
  currency?: string;
  itemName: string;
  priceId: string;
  stripePublicKey?: string;
  onPaymentComplete?: (paymentId: string) => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  amount,
  image,
  currency = "EUR",
  itemName,
  priceId,
  stripePublicKey
}: PaymentModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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

  function handlePayment(paymentMethod: PaymentMethod) {
    setIsProcessing(true);
    switch (paymentMethod.type) {
      case "stripe":
        handleStripePayment();
        break;
      case "metamask":
        handleMetamaskPayment();
        break;
      case "erc20":
        handleErc20Payment();
        break;
    }
  }

  function handleStripePayment() {
    if (!priceId) {
      alert("Si prega di fornire il priceId del prodotto");
    } else {
      setIsProcessing(true);
      processStripePayment({
        priceId: priceId,
        stripePublicKey: stripePublicKey || ""
      });
    }
  }

  function handleMetamaskPayment() {
    alert("Funzionalità non disponibile");
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

          {isProcessing ? (
            <div className="mego-loader-div">
              <div className="mego-loader" />
              <p className="mego-login-text mego-font-medium" style={{ marginTop: '1rem' }}>
                Elaborazione del pagamento...
              </p>
            </div>
          ) : (
            <div className="payment-methods">
              {/* Stripe */}
              <button
                className="mego-modal-button payment-button"
                onClick={() => handlePayment({ type: "stripe" })}
              >
                <StripeIcon height={20} width={20} style={{ marginRight: '0.5rem' }} />
                <p className="mego-font-medium">Paga con Stripe</p>
              </button>

              {/* Metamask */}
              <button
                className="mego-modal-button payment-button"
                onClick={() => handlePayment({ type: "metamask" })}
              >
                <WalletIcon height={20} width={20} style={{ marginRight: '0.5rem' }} />
                <p className="mego-font-medium">Paga con Metamask</p>
              </button>

              {/* ERC20 */}
              <button
                className="mego-modal-button payment-button"
                onClick={() => handlePayment({ type: "erc20" })}
              >
                <MegoIcon height={20} width={20} style={{ marginRight: '0.5rem' }} />
                <p className="mego-font-medium">Paga con ERC20</p>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
