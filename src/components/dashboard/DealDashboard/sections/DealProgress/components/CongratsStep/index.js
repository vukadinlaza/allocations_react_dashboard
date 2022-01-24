import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid, Typography } from '@material-ui/core';
import styles from '../../../../styles';

const CongratsStep = ({ classes, handleComplete, updateDealLoading }) => {
  return (
    <>
      <Grid container className={classes.congratsStepBody}>
        <Grid item style={{ marginBottom: '15px' }}>
          <Typography style={{ fontSize: '30px', fontWeight: '500' }}>Congratulations!</Typography>
          <Typography>Your deal has been successfully completed!</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            classes={{ root: classes.closeTabButton }}
            onClick={handleComplete}
            disabled={updateDealLoading}
          >
            Close Tab
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default withStyles(styles)(CongratsStep);
