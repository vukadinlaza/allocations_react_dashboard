import React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Paper } from '@material-ui/core';
import styles from './styles';

const LoadingPlaceholder = ({ classes }) => {
  return (
    <>
      <Grid item xs={1} />
      {[0, 1, 2, 3, 4].map((value) => (
        <Grid key={value} item lg={2}>
          <Paper elevation={0} className={`${classes.placeholderItem} ${classes.smallBox}`} />
        </Grid>
      ))}
      <Grid item xs={1} />
      <Grid item xs={1} />
      <Grid item lg={10}>
        <Paper elevation={0} className={`${classes.placeholderItem} ${classes.largeBox}`} />
      </Grid>
      <Grid item xs={1} />
    </>
  );
};

export default withStyles(styles)(withRouter(LoadingPlaceholder));
