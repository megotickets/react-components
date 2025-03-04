import React, { useEffect, useState } from "react";
import "../../mego-style.css";
import CrossIcon from "../../icons/CrossIcon";
import CheckIcon from "../../icons/CheckIcon";
import ErrorIcon from "../../icons/ErrorIcon";

export function PaymentStatusModal() {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'canceled' | null>(null);

  useEffect(() => {
    console.log("PaymentStatusModal");
    // Controlla i parametri dell'URL
    const searchParams = new URLSearchParams(window.location.search);
    console.log(searchParams);
    const paymentSuccess = searchParams.get('payment_success');
    const paymentCanceled = searchParams.get('payment_canceled');

    if (paymentSuccess === 'true') {
      setPaymentStatus('success');
      setIsVisible(true);
    } else if (paymentCanceled === 'true') {
      setPaymentStatus('canceled');
      setIsVisible(true);
    }

    // Chiudi automaticamente dopo 2 secondi se il modal è visibile
    if (paymentSuccess === 'true' || paymentCanceled === 'true') {
      const timer = setTimeout(() => {
        handleClose();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      // Rimuovi i parametri dall'URL senza ricaricare la pagina
      const url = new URL(window.location.href);
      url.searchParams.delete('payment_success');
      url.searchParams.delete('payment_canceled');
      window.history.replaceState({}, document.title, url.pathname + url.search);
      
      setIsVisible(false);
      setIsClosing(false);
    }, 300); // Durata dell'animazione
  }

  if (!isVisible || !paymentStatus) return null;

  return (
    <div className={`${isClosing ? "closing" : ""} mego-modal-content payment-modal`}>
      <div className="mego-modal-backdrop" onClick={handleClose}></div>
      <div
        className="mego-modal-wrapper payment-wrapper"
        style={{
          minHeight: "auto",
          maxHeight: "90vh"
        }}
      >
        <div className="mego-modal-header">
          <div className="mego-modal-logo">
            <h3 className="payment-title">
              {paymentStatus === 'success' ? 'Pagamento completato' : 'Pagamento annullato'}
            </h3>
          </div>
          <div className="mego-modal-buttons">
            <div onClick={handleClose} style={{ marginRight: '0.5rem', marginTop: '0.5rem', cursor: 'pointer' }}>
              <CrossIcon onClick={handleClose} height={16} width={16} />
            </div>
          </div>
        </div>
        <div className="mego-modal-content payment-content">
          <div className="payment-details" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
            {paymentStatus === 'success' ? (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <CheckIcon height={64} width={64} color="#4CAF50" />
                </div>
                <h2 style={{ color: '#4CAF50', marginBottom: '0.5rem', textAlign: 'center' }}>Pagamento completato con successo!</h2>
                <p style={{ textAlign: 'center' }}>Grazie per il tuo acquisto.</p>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <ErrorIcon height={64} width={64} color="#F44336" />
                </div>
                <h2 style={{ color: '#F44336', marginBottom: '0.5rem', textAlign: 'center' }}>Pagamento annullato</h2>
                <p style={{ textAlign: 'center' }}>Il pagamento è stato annullato.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
