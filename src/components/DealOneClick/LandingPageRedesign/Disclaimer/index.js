import React from 'react';
import { Paper, Box } from '@material-ui/core';
import useStyles from '../style';

export default function DealSummary({ title, content }) {
  const classes = useStyles();

  return (
    <Paper className={classes.dealHeader}>
      <Box className={classes.box}>
        <span className={classes.investmentProgress}>{title}</span>
      </Box>

      <Box className={classes.box}>{content}</Box>
    </Paper>
  );
}
