import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import pmButton from '../../../../../../assets/parallel-button.svg';
import { FormControl, Grid, Typography, Button } from '@material-ui/core';
import styles from '../../styles';

const KYCServiceTask = ({ task, deal, classes }) => (
  <Grid
    container
    direction="column"
    alignItems="flex-start"
    justify="center"
    className={classes.taskContainer}
  >
    <Grid item sm={12} lg={12}>
      <FormControl required disabled variant="outlined">
        <Typography>{task.title}</Typography>
        <a
          href={`${process.env.REACT_APP_KYC_LAMBDA_URL}/get-login-url?host=${encodeURIComponent(
            window.location.href,
          )}&userId=${deal?.user_id}`}
          target="'_blank'"
        >
          <Button>
            <img src={pmButton} alt="Parallel Markets Login Button" />
          </Button>
        </a>
      </FormControl>
    </Grid>
  </Grid>
);

export default withStyles(styles)(KYCServiceTask);
