import React from 'react';
import { Paper, Box } from '@material-ui/core';
import useStyles from '../DealStyles';

export default function DealSummary({ title, content }) {
  const classes = useStyles();

  return (
    <Paper className={classes.dealHeader}>
      <Box className={classes.box}>
        <div className={classes.investmentProgress}>{title}</div>
      </Box>

      <Box className={classes.box}>{content}</Box>
    </Paper>
  );
}
