import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: (props) => (!props.isFromModal ? '#FBFCFF' : 'unset'),
    boxShadow: (props) =>
      !props.isFromModal ? 'rgba(170, 170, 170, 0.25) 2px 2px 4px 0px' : 'none',
    border: (props) => (!props.isFromModal ? '1px solid rgb(232, 232, 232)' : 'none'),
    marginBottom: '20px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    [theme.breakpoints.up('md')]: {
      width: (props) => (!props.isFromModal ? '70%' : '100%'),
    },
  },
}));

const PanelContainer = ({ children, ...rest }) => {
  const classes = useStyles({ ...rest });
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
