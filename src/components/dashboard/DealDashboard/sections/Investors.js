import React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography } from '@material-ui/core';
import styles from '../styles';

const dashboardBoxes = [
  {
    title: 'Total Investors',
    value: `10`,
  },
  {
    title: 'Total Invested',
    value: `$1,800,000`,
  },
];

const Investors = ({ classes }) => {
  const boxSize = 2;
  const invisibleBoxes = Array(5 - dashboardBoxes.length).fill(0);

  return (
    <>
      <Grid item xs={1} />
      {dashboardBoxes.map((box, index) => (
        <Grid key={`box-${index}`} item lg={boxSize}>
          <Paper elevation={0} className={classes.smallBox}>
            <Typography className={classes.boxTitle}>{box.title}</Typography>
            <Typography className={classes.boxValue}>{box.value}</Typography>
          </Paper>
        </Grid>
      ))}
      {invisibleBoxes.length &&
        invisibleBoxes.map((box, index) => <Grid item key={`box-${index}`} xs={boxSize} />)}
      <Grid item xs={1} />
      <Grid item xs={1} />
      <Grid item lg={10}>
        <Paper elevation={0} className={`${classes.largeBox}`} />
      </Grid>
      <Grid item xs={1} />
    </>
  );
};

export default withStyles(styles)(withRouter(Investors));
