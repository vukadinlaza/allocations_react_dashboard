import React from 'react';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutFrom';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY);
console.log(process.env.REACT_APP_STRIPE_API_KEY, 'KEY');

export default function Stripe() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
