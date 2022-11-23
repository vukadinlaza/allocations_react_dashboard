import React from 'react';
import { PaymentElement } from '@stripe/react-stripe-js';

const CheckoutForm = () => {
  return (
    <form>
      <PaymentElement />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CheckoutForm;
