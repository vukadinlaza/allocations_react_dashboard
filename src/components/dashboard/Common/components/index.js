import React from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import useStyles from './styles';

export const Box = ({ box, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid {...rest} item lg={2} xs={10}>
      <Paper elevation={0} className={classes.smallBox}>
        <Typography className={classes.boxTitle}>{box.title}</Typography>
        <Typography className={classes.boxValue}>{box.value}</Typography>
      </Paper>
    </Grid>
  );
};

export const BigBox = ({ content }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Paper elevation={0} className={classes.bigBox}>
        <Typography className={classes.bigBoxTitle}>{content}</Typography>
      </Paper>
    </Grid>
  );
};
