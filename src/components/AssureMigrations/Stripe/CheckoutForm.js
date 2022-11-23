import React, { useState } from 'react';

import { Button, ButtonGroup, Grid, Paper } from '@material-ui/core';
import { Logo, Button as AllocationsButton } from '@allocations/design-system';
import useStyles from '../styles';
import CardCheckout from './CardCheckout';
import BankCheckout from './BankCheckout';

const CheckoutForm = () => {
  const styles = useStyles();
  const [selectedForm, setSelectedForm] = useState('bank');
  const [quantity, setQuantity] = useState(1);

  const forms = {
    card: CardCheckout,
    bank: BankCheckout,
  };

  const handleSubscribe = async () => {
    setQuantity(1);
    console.log(process.env.REACT_APP_STRIPE_API, 'API ENV VAR');
    await fetch(`${process.env.REACT_APP_STRIPE_API}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'X-API-TOKEN': process.env.REACT_APP_ALLOCATIONS_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity,
        email: 'chase.abbott@allocations.com',
        payment_type: 'card',
        card: {
          number: '4242424242424242',
          exp_month: 11,
          exp_year: 2023,
          cvc: '314',
        },
      }),
    });
  };
  return (
    <Paper style={{ height: '600px' }}>
      <Grid container style={{ padding: '30px' }}>
        <Grid item xs={12} className={styles.gridItem}>
          <Logo width={300} />
        </Grid>
        <Grid item xs={12}>
          <ButtonGroup
            classes={{
              groupedOutlinedHorizontal: styles.groupedOutlinedHorizontalOverride,
              groupedHorizontal: styles.groupedHorizontalOverride,
            }}
          >
            {[
              { label: 'US Bank Account', value: 'bank', logo: '🏦' },
              { label: 'Card', value: 'card', logo: '💳' },
            ].map((choice) => (
              <Button
                key={choice.value}
                name={choice.value}
                variant={selectedForm === choice.value ? 'contained' : 'outlined'}
                color="primary"
                className={styles.button}
                classes={{
                  containedPrimary: styles.containedOverride,
                  root: styles.rootOverride,
                }}
                onClick={() => {
                  setSelectedForm(choice.value);
                }}
              >
                <Grid item>{choice.logo}</Grid>
                <Grid item>{choice.label}</Grid>
              </Button>
            ))}
          </ButtonGroup>
        </Grid>
        <Grid item xs={12}>
          {forms[selectedForm]}
        </Grid>
        <AllocationsButton text="Subscribe" onClick={() => handleSubscribe()} fullWidth />
      </Grid>
    </Paper>
  );
};

export default CheckoutForm;
