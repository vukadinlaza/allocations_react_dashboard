import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid rgb(232, 232, 232)',
    borderRadius: '5px 5px 0px 0px',
  },
  headerLabel: {
    padding: (props) => (!props.isFromModal ? '15px' : '0 0 0 15px'),
    margin: 0,
    width: '100%',
    fontSize: '1rem',
  },
}));

const PanelLabel = ({ label, children, ...rest }) => {
  const classes = useStyles({ ...rest });
  return (
    <Grid container alignItems="center" wrap="nowrap" className={classes.header}>
      <Grid item xs={12} sm={12} lg={12}>
        <Typography className={classes.headerLabel} component="p">
          {label}
        </Typography>
      </Grid>
      {children && <Grid item>{children}</Grid>}
    </Grid>
  );
};

export default PanelLabel;
