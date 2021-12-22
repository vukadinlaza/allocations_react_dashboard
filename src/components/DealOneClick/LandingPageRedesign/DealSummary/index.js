import React from 'react';
import { Paper, Box } from '@material-ui/core';
import useStyles from '../DealStyles';

function DealSummary({ deal }) {
  const { company_description } = deal;
  const classes = useStyles();

  return (
    <Paper className={classes.dealHeader}>
      <Box className={classes.box}>
        <div className={classes.investmentProgress}>Deal Summary</div>
      </Box>

      <Box className={classes.box}>{company_description}</Box>
    </Paper>
  );
}

export default DealSummary;
