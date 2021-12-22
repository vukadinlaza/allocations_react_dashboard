import React from 'react';
import { Paper, Box } from '@material-ui/core';
import useStyles from '../DealStyles';

export default function DealSummary({ title, content }) {
  const classes = useStyles();

  return (
    <Paper className={classes.dealHeader}>
      <Box className={classes.box}>
        <h5 className={classes.investmentProgress}>{title}</h5>
      </Box>

      <Box className={classes.box}>{content}</Box>
    </Paper>
  );
}
