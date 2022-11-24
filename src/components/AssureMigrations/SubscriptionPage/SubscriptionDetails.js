import { colors, Typography } from '@allocations/design-system';
import { Grid } from '@material-ui/core';
import React from 'react';
import { SubscriptionTextCheck } from '../common';
import useStyles from '../styles';

export default function SubscriptionDetails() {
  const classes = useStyles();

  return (
    <Grid item xs={12} md={6} className={classes.leftSide}>
      <Typography
        content="Subscribe Now!"
        variant="heading3"
        fontWeight={700}
        fontColor={colors.white[100]}
      />
      <div className={classes.titleUnderline} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography
            content="Secure Cloud Storage and Self-Service"
            variant="heading4"
            fontWeight={700}
            fontColor={colors.white[100]}
          />
          <Typography
            content="Fund Administration Platform 🚀"
            variant="heading4"
            fontWeight={700}
            fontColor={colors.white[100]}
          />
          <div style={{ marginTop: '8px' }}>
            <Typography
              content="$99.00/month per SPV"
              variant="paragraph2"
              fontWeight={400}
              fontColor={colors.white[100]}
            />
          </div>
        </Grid>
        <SubscriptionTextCheck text="Secure Cloud Stoage" style={{ marginTop: '8px' }} />
        <SubscriptionTextCheck text="Self-Service Data Entry" style={{ marginTop: '8px' }} />
        <SubscriptionTextCheck
          text="Fund Manager Dashboard"
          description="Metrics including Total AUM, Total Raised, Estimated Multiple, Total Private Funds, Total Investors, itemized list of SPVs (name, status, total raised)"
          style={{ marginTop: '8px' }}
        />
        <SubscriptionTextCheck
          text="Investor Dashboard"
          description="Display high level data e.g. Total AUM, Total Raised, Estimated Multiple, Total Private Funds, Total Investors"
          style={{ marginTop: '8px' }}
        />
        <SubscriptionTextCheck
          text="Investor Records"
          description="Display investor records e.g., subscription documents, Forms W-9 and W-8 and current investor banking and personal information, side letters"
          style={{ marginTop: '8px' }}
        />
        <SubscriptionTextCheck
          text="Investment Record Ledger"
          description="Display investor records e.g., subscription documents, Forms W-9 and W-8 and current investor banking and personal information, side letters"
          style={{ marginTop: '8px' }}
        />
      </Grid>
    </Grid>
  );
}
