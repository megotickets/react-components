interface PaymentDetails {
    paymentId: string;
    amount: number;
    currency?: string;
  }
  
  interface StripeRedirectOptions {
    payment: PaymentDetails;
    eventIdentifier: string;
    accountAddress: string;
    stripeProductLink: string;
    baseUrl?: string;
    onStart?: () => void;
    onComplete?: () => void;
  }
  
  /**
   * Reindirizza l'utente alla pagina di pagamento Stripe
   * @param options - Opzioni di configurazione per il reindirizzamento a Stripe
   */
  export const processStripePayment = (options: StripeRedirectOptions): void => {
    const {
      payment,
      eventIdentifier,
      accountAddress,
      stripeProductLink,
      baseUrl = window.location.href.split("?")[0],
      onStart,
      onComplete
    } = options;
  
    try {
      // Notifica inizio processo
      if (onStart) onStart();
      const testCheckoutUrl = stripeProductLink;
      
      // Apri Stripe nella stessa finestra
      window.location.replace(testCheckoutUrl);
      
      // Simuliamo un completamento del pagamento dopo 5 secondi (solo per test)
      setTimeout(() => {
        console.log("Simulazione di pagamento completato");
        // Qui potresti reindirizzare l'utente o aggiornare l'interfaccia
        if (onComplete) onComplete();
      }, 5000);
      
    } catch (e) {
      console.error("Errore durante il reindirizzamento a Stripe:", e);
    }
  };