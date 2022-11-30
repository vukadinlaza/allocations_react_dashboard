/* eslint-disable import/no-cycle */
import React, { useEffect, useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { Grid, Paper, Typography } from '@material-ui/core';
import { useLocation } from 'react-router';
import { toast } from 'react-toastify';

import { Input, Logo, Button, Modal } from '@allocations/design-system';
import { validateEmail } from '@allocations/nextjs-common';

import PaymentMethods from './PaymentMethods';
import QuantityContainer from './QuantityContainer';

import { currentPrice, fields } from './constants';
import useStyles from '../styles';

const useQuery = () => {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
};

export default function StripeForm({ setPaymentMade }) {
  const stripe = useStripe();

  const classes = useStyles();
  const query = useQuery();
  const { quantity: spv_count, email } = Object.fromEntries(query);
  const [errors, setErrors] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('card');
  const [form, setForm] = useState({});
  const [openMandateConfirmationModal, setOpenMandateConfirmationModal] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState(undefined);

  useEffect(() => {
    const newState = { email: form.email || email };
    setQuantity(Number(spv_count) || 1);
    setForm(newState);
  }, [method]);

  const formatValue = (fieldName, value) => {
    if (!value) return value;
    if (fieldName === 'expiration' && value.length >= 3) {
      return value
        .replace('/', '')
        .split('')
        .map((x, i) => (i === 1 ? `${x}/` : x))
        .join('');
    }
    return value;
  };

  const updateForm = (target) => {
    const value = ['expiration', 'card_number'].includes(target.name)
      ? target.value.replace(/\//g, '')
      : target.value;
    setForm({ ...form, [target.name]: value });
  };

  const validateFields = () => {
    let validated = true;
    const errorsFound = {};

    const validate = ({ field, validCondition, errorMessage }) => {
      const isValid = validCondition;
      if (!isValid) {
        errorsFound[field.name] = errorMessage;
      } else {
        errorsFound[field.name] = '';
      }
      return isValid;
    };

    const isNumeric = (value) => {
      return /^\d+$/.test(value);
    };

    fields[method].forEach((field) => {
      if (validated) {
        if (field.name === 'email') {
          validated = validate({
            field,
            validCondition: !!validateEmail(form[field.name]),
            errorMessage: 'Email is not valid',
          });
        } else if (field.type === 'number') {
          validated = validate({
            field,
            validCondition: isNumeric(form[field.name]),
            errorMessage: 'This field has to be a number',
          });
        } else if (field.name === 'expiration') {
          validated = validate({
            field,
            validCondition: isNumeric(form[field.name]),
            errorMessage: 'This is not a valid expiration Date',
          });
        } else {
          validated = validate({
            field,
            validCondition: !!form[field.name],
            errorMessage: 'This field is required',
          });
        }
      }
    });
    if (errorsFound) setErrors(errorsFound);
    return validated;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;
    try {
      setLoading(true);

      if (method === 'card') {
        const response = await fetch(
          `${process.env.REACT_APP_STRIPE_API}/api/stripe/create-checkout-session`,
          {
            method: 'POST',
            headers: {
              'X-API-TOKEN': process.env.REACT_APP_ALLOCATIONS_TOKEN,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              payment_type: 'card',
              quantity,
              email: form.email,
              card: {
                number: form.card_number,
                exp_month: Number(form.expiration.slice(0, 2)),
                exp_year: Number(form.expiration.slice(2, 6)),
                cvc: Number(form.cvc),
              },
            }),
          },
        );
        const res = await response.json();

        setLoading(false);

        if (res.error) {
          throw new Error(res.error);
        }

        setPaymentMade(true);
      }

      if (method === 'bank') {
        const response = await fetch(
          `${process.env.REACT_APP_STRIPE_API}/api/stripe/create-payment-intent`,
          {
            method: 'POST',
            headers: {
              'X-API-TOKEN': process.env.REACT_APP_ALLOCATIONS_TOKEN,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              payment_type: 'us_bank_account',
              email: form.email,
              amount: quantity * currentPrice,
            }),
          },
        );
        const res = await response.json();

        setLoading(false);

        if (res.error) {
          throw new Error(res.error);
        }

        stripe
          .collectBankAccountForPayment({
            clientSecret: res.clientSecret,
            params: {
              payment_method_type: 'us_bank_account',
              payment_method_data: {
                billing_details: {
                  name: form.full_name,
                  email: form.email,
                },
              },
            },
            expand: ['payment_method'],
          })
          .then(({ paymentIntent, error }) => {
            if (error) {
              toast.error(error.message);
            } else if (paymentIntent.status === 'requires_confirmation') {
              setPaymentIntent(paymentIntent);
              setOpenMandateConfirmationModal(true);
            }
          });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Paper className={classes.paymentForm}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div style={{ height: '100px', display: 'flex', justifyContent: 'center' }}>
              <Logo width={300} />
            </div>
            <PaymentMethods setMethod={setMethod} method={method} />
          </Grid>
          {fields[method].map((field, index) => (
            <Grid
              item
              xs={12}
              md={field.md}
              key={`field-${field.name}-${index}`}
              className={classes.input}
            >
              <Input
                onChange={({ target }) => updateForm(target)}
                label={field.label}
                name={field.name}
                type="text"
                value={formatValue(field.name, form[field.name])}
                error={!!errors[field.name]}
                helperText={errors[field.name]}
                fullWidth={field.name !== 'phone'}
                placeholder={field.placeholder}
                inputProps={{ maxLength: field.maxLength }}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <QuantityContainer quantity={quantity} setQuantity={setQuantity} />
          </Grid>
          <Grid item xs={12} style={{ marginTop: '12px' }}>
            <Button
              onClick={handleSubmit}
              text={loading ? 'Processing...' : 'Subscribe'}
              fullWidth
            />
          </Grid>
        </Grid>
      </Paper>

      <Modal
        open={openMandateConfirmationModal}
        onClose={() => setOpenMandateConfirmationModal(false)}
        modalTitle="Mandate Confirmation"
        withSecondaryButton
        secondaryButtonProps={{
          text: 'Cancel',
          onClick: () => setOpenMandateConfirmationModal(false),
        }}
        primaryButtonProps={{
          text: 'Accept',
          onClick: () => {
            stripe
              .confirmUsBankAccountPayment(paymentIntent.client_secret)
              .then(({ paymentIntent, error }) => {
                if (error) {
                  toast.error(error.message);
                } else if (paymentIntent.status === 'requires_payment_method') {
                  toast.error(
                    'Confirmation failed. Attempt again with a different payment method.',
                  );
                } else if (paymentIntent.status === 'processing') {
                  toast.success('Confirmation succeeded! The account will be debited');
                  setPaymentMade(true);
                } else if (paymentIntent.next_action?.type === 'verify_with_microdeposits') {
                  toast.info('The account needs to be verified via microdeposits');
                }

                setOpenMandateConfirmationModal(false);
              });
          },
        }}
      >
        <Grid container spacing={2}>
          <Typography variant="body1" style={{ marginBottom: '12px' }}>
            By clicking Accept, you authorize Allocations to debit the bank account specified above
            for any amount owed for charges arising from your use of Allocations’ services and/or
            purchase of products from Allocations, pursuant to Allocations’ website and terms, until
            this authorization is revoked. You may amend or cancel this authorization at any time by
            providing notice to Allocations with 30 (thirty) days notice.
          </Typography>
        </Grid>
      </Modal>
    </>
  );
}
