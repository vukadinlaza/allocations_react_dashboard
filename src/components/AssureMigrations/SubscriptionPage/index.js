import { Grid } from '@material-ui/core';
import React, { useState } from 'react';
import StripeForm from '../Stripe';
import useStyles from '../styles';
import Congratulations from './Congratulations';
import SubscriptionDetails from './SubscriptionDetails';

export default function MigrationsSubscription() {
  const classes = useStyles();
  const [paymentMade, setPaymentMade] = useState(false);

  return (
    <Grid container spacing={0} className={classes.mainContainer}>
      <SubscriptionDetails />
      <Grid item xs={12} md={6} className={classes.subscriptionRightSide}>
        {!paymentMade ? <StripeForm setPaymentMade={setPaymentMade} /> : <Congratulations />}
      </Grid>
    </Grid>
  );
}
