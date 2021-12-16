import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import grayCheck from '../../../../../assets/gray-check.svg';
import styles from '../styles';

const NextStep = ({ classes }) => {
  return (
    <Grid container className={classes.nextStepBody}>
      <div className={classes.stepTitleRow} style={{ padding: '0px' }}>
        {/* padding should be conditional */}
        <img alt="gray check" src={grayCheck} />
        <Typography>Onboarding: Confirm Deal Details</Typography>
      </div>
      {/* Conditional/optional rendering */}
      {/* <Typography style={{ fontSize: '12px' }}>
        An Allocations representative will be reaching out shortly to assist you in completing this
        step. If you have any questions, do not hesitate to contact support@allocations.com.
      </Typography> */}
    </Grid>
  );
};

export default withStyles(styles)(NextStep);
