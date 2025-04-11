import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;

  constructor() {
    this.stripePromise = this.initializeStripe('your_stripe_public_key'); // Replace with your actual public key
  }

  private async initializeStripe(publicKey: string): Promise<Stripe | null> {
    try {
      return await loadStripe(publicKey);
    } catch (error) {
      console.error('Error loading Stripe:', error);
      return null;
    }
  }

  public async redirectToCheckout(sessionId: string): Promise<void> {
    const stripe = await this.stripePromise;
    if (!stripe) {
      console.error('Stripe not initialized.');
      return;
    }

    try {
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        console.error('Stripe checkout error:', result.error);
      }
    } catch (error) {
      console.error('Error redirecting to Stripe checkout:', error);
    }
  }
}