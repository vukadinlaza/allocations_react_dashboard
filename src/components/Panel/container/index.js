import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '70%',
    backgroundColor: '#FBFCFF',
    boxShadow: 'rgba(170, 170, 170, 0.25) 2px 2px 4px 0px',
    border: '1px solid rgb(232, 232, 232)',
    marginBottom: '20px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

const PanelContainer = ({ children }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      component="section"
      wrap="nowrap"
      alignContent="center"
      direction="column"
      className={classes.root}
    >
      {children}
    </Grid>
  );
};

export default PanelContainer;
