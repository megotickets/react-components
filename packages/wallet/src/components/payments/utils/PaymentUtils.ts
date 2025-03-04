import { loadStripe } from "@stripe/stripe-js";

interface StripeRedirectOptions {
  stripePublicKey: string;
  priceId: string;
}

/**
 * Reindirizza l'utente alla pagina di pagamento Stripe
 * @param options - Opzioni di configurazione per il reindirizzamento a Stripe
 */
export const processStripePayment = async (options: StripeRedirectOptions): Promise<void> => {
  const {
    stripePublicKey,
    priceId
  } = options;

  try {
    const stripePromise = loadStripe(stripePublicKey);
    const stripe = await stripePromise;
    if (!stripe) {
      alert("Errore durante la configurazione di Stripe");
      return;
    }

    //Count query params (for create correct url)
    const urlParams = new URLSearchParams(window.location.search);
    const qC = urlParams.size;

    // Checkout
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{price: priceId,quantity: 1,}],
      mode: 'payment',
      successUrl: `${window.location.href}${qC > 0 ? '&' : '?'}payment_success=true`,
      cancelUrl: `${window.location.href}${qC > 0 ? '&' : '?'}payment_canceled=true`,
    });

    if (error) {
      alert('Errore durante il reindirizzamento a Stripe:');
    }

  } catch (e) {
    console.error("Errore durante il reindirizzamento a Stripe:", e);
  }
};


