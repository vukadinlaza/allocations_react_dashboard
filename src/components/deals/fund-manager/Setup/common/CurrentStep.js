import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import grayCheck from '../../../../../assets/gray-check.svg';
import styles from '../styles';

const CurrentStep = ({ classes }) => {
  return (
    <Grid container className={classes.currentStepBody}>
      <div className={classes.currentStepTitleRow}>
        <img alt="gray check" src={grayCheck} />
        <Typography>Pre-Onboarding</Typography>
      </div>
      <Typography className={classes.currentStepText}>
        An Allocations representative will be reaching out shortly to assist you in completing this
        step. If you have any questions, do not hesitate to contact support@allocations.com.
      </Typography>
    </Grid>
  );
};

export default withStyles(styles)(CurrentStep);
