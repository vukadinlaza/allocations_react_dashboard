import { Input, Logo, Button } from '@allocations/design-system';
import { validateEmail } from '@allocations/nextjs-common';
import { Grid, Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { toast } from 'react-toastify';
import useStyles from '../styles';
// import PaymentMethods from './PaymentMethods';
import QuantityContainer from './QuantityContainer';

const fields = {
  // bank: [
  //   {
  //     name: 'email',
  //     label: 'Email',
  //   },
  //   {
  //     name: 'full_name',
  //     label: 'Full name',
  //   },
  //   {
  //     name: 'bank_account',
  //     label: 'Bank account',
  //     placeholder: 'Search your bank account by name',
  //   },
  // ],
  card: [
    {
      name: 'email',
      label: 'Email',
    },
    {
      name: 'card_number',
      label: 'Card number',
      type: 'number',
      maxLength: 16,
    },
    {
      name: 'expiration',
      label: 'Expiration',
      type: 'number',
      placeholder: 'MM/YYYY',
      maxLength: 7,
      md: 6,
    },
    {
      name: 'cvc',
      label: 'CVC',
      type: 'number',
      maxLength: 3,
      md: 6,
    },
    // {
    //   name: 'country',
    //   label: 'Country',
    //   md: 6,
    // },
    // {
    //   name: 'zip_code',
    //   label: 'ZIP',
    //   type: 'number',
    //   md: 6,
    // },
  ],
};

const useQuery = () => {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
};

export default function StripeForm({ setPaymentMade }) {
  const classes = useStyles();
  const query = useQuery();
  const { quantity: spv_count, email } = Object.fromEntries(query);
  const [errors, setErrors] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  // const [method, setMethod] = useState('card');
  const method = 'card';
  const [form, setForm] = useState({});

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
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Paper className={classes.paymentForm}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div style={{ height: '100px', display: 'flex', justifyContent: 'center' }}>
            <Logo width={300} />
          </div>
          {/* <PaymentMethods setMethod={setMethod} method={method} /> */}
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
          <Button onClick={handleSubmit} text={loading ? 'Processing...' : 'Subscribe'} fullWidth />
        </Grid>
      </Grid>
    </Paper>
  );
}
