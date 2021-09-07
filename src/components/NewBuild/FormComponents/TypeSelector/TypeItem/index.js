import React, { useEffect, useState } from 'react';
import { Button, TextField, Paper, Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import RocketIcon from '../../../../../assets/rocket.svg';

const useStyles = makeStyles((theme) => ({
  icon: { opacity: 1, paddingBottom: '15px' },
  itemText: {
    textAlign: 'left',
    font: 'normal normal normal 20px/24px Roboto',
    letterSpacing: '0px',
    color: '#2A2B54',
    opacity: 1,
  },
  subText: {
    textAlign: 'left',
    font: 'normal normal normal 12px/14px Roboto',
    paddingBottom: '5px',
    letterSpacing: '0px',
    color: '#186EFF',
    width: '202px',
    opacity: 1,
  },
  gridItem: {
    // padding: '12px',
    // width: '267px',
    // height: '166px',
    // minHeight: '166px',
    // background: '#FFFFFF 0% 0% no-repeat padding-box',
    // boxShadow: '0px 3px 6px #0000000D',
    // border: '2px solid #2A2B5480',
    // borderRadius: '10px',
  },
  typeItem: {
    padding: '12px',
    width: '267px',
    height: '166px',
    minHeight: '166px',
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #0000000D',
    border: '2px solid #2A2B5480',
    borderRadius: '10px',
  },
}));
export default function TypeItem() {
  const classes = useStyles();

  return (
    <div className={classes.typeItem}>
      <img src={RocketIcon} alt="rocket icon" className={classes.icon} />
      <Typography className={classes.itemText}>Startup</Typography>
      <Typography className={classes.subText}>
        Raise money to invest in a private company
      </Typography>
    </div>
  );
}
