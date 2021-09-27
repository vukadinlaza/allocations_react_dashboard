import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  icon: {
    opacity: '1',
  },
  itemText: {
    textAlign: 'left',
    font: 'normal normal normal 20px/24px Roboto',
    letterSpacing: '0px',
    color: '#2A2B54',
    opacity: 1,
    whiteSpace: 'no-wrap',
    marginBottom: '5px',
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
  typeItem: {
    padding: '12px',
    width: '267px',
    height: '166px',
    minHeight: '166px',
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #0000000D',
    border: '2px solid #2A2B5480',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  selected: {
    background: '#186EFF26 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #0000000D',
    border: '2px solid #186EFF',
    borderRadius: '10px',
    opacity: '1',
  },
}));
export default function TypeItem({ item, assetType, setAssetType }) {
  const classes = useStyles();

  return (
    <div
      className={`${classes.typeItem} ${item.value === assetType ? classes.selected : ''}`}
      onClick={() => {
        setAssetType(item.value);
      }}
    >
      <div
        style={{
          height: '55px',
          width: '55px',
          marginBottom: '15px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src={item.icon}
          alt={`${item.title} icon`}
          className={classes.icon}
          // style={{ height: item.height, width: item.width }}
        />
      </div>

      <Typography className={classes.itemText}>{item.title}</Typography>
      <Typography className={classes.subText}>{item.description}</Typography>
    </div>
  );
}
