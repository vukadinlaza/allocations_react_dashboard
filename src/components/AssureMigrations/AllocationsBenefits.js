import { colors, Typography } from '@allocations/design-system';
import { Grid } from '@material-ui/core';
import React from 'react';
import { TextCheck } from './common';
import useStyles from './styles';

export default function AllocationsBenefits() {
  const classes = useStyles();

  return (
    <Grid item xs={12} md={6} className={classes.leftSide}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography
            content="Welcome Assure Clients."
            variant="heading4"
            fontWeight={700}
            fontColor={colors.white[100]}
          />
          <Typography
            content="Migrate to Allocations in a few clicks 🚀"
            variant="heading4"
            fontWeight={700}
            fontColor={colors.white[100]}
          />
          <div style={{ marginTop: '8px' }}>
            <Typography
              content="Simple, fast and efficient process"
              variant="paragraph2"
              fontWeight={400}
              fontColor={colors.white[100]}
            />
          </div>
        </Grid>
        <TextCheck
          text="Technology platform with GP / LP dashboard"
          style={{ marginTop: '20px' }}
        />
        <TextCheck text="Professional services including" style={{ marginTop: '8px' }} />
        <Grid item xs={12} className={classes.subChecks}>
          <Grid container spacing={2}>
            <TextCheck text="Fund administration" />
            <TextCheck text="Tax returns" />
            <TextCheck text="Banking" />
            <TextCheck text="Change of manager" />
            <TextCheck text="Compliance services" />
            <TextCheck text="Transfer of master entity" />
            <TextCheck text="Post-closing activities" />
            <TextCheck text="Investment advisory services" />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <div className={classes.assure}>
          <Typography
            content="Migrate from"
            variant="paragraph2"
            fontWeight={500}
            fontColor={colors.white[100]}
          />
          <img
            src="https://allocations-public.s3.us-east-2.amazonaws.com/Assure.png"
            alt="assure-logo"
          />
        </div>
      </Grid>
    </Grid>
  );
}
