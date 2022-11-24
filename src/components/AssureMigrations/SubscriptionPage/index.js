import { Grid } from '@material-ui/core';
import React from 'react';
import useStyles from '../styles';
import Congratulations from './Congratulations';
import SubscriptionDetails from './SubscriptionDetails';

export default function MigrationsSubscription() {
  const classes = useStyles();

  return (
    <Grid container spacing={0} className={classes.mainContainer}>
      <SubscriptionDetails />
      <Grid item xs={12} md={6} className={classes.subscriptionRightSide}>
        <Congratulations />
      </Grid>
    </Grid>
  );
}
