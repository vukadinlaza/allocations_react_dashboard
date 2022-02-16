import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography } from '@material-ui/core';
import styles from './styles';

export const Box = withStyles(styles)(({ classes, box, key }) => {
  return (
    <Grid key={key} item lg={2} xs={10}>
      <Paper elevation={0} className={classes.smallBox}>
        <Typography className={classes.boxTitle}>{box.title}</Typography>
        <Typography className={classes.boxValue}>{box.value}</Typography>
      </Paper>
    </Grid>
  );
});

export const BigBox = withStyles(styles)(({ classes, content }) => {
  return (
    <Grid item xs={12}>
      <Paper elevation={0} className={classes.bigBox}>
        <Typography className={classes.bigBoxTitle}>{content}</Typography>
      </Paper>
    </Grid>
  );
});
