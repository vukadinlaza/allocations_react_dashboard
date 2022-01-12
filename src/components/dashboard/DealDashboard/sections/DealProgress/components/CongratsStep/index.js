import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid, Typography } from '@material-ui/core';
import styles from '../../../../styles.ts';

const CongratsStep = ({ classes, phase, task }) => {
  return (
    <>
      <Grid container className={classes.congratsStepBody}>
        <Typography style={{ fontSize: '30px', fontWeight: '500' }}>Congratulations!</Typography>
        <Typography>Your deal has been successfully completed!</Typography>
      </Grid>
      <Button variant="contained" classes={{ root: classes.closeTabButton }}>
        Close Tab
      </Button>
    </>
  );
};

export default withStyles(styles)(CongratsStep);
