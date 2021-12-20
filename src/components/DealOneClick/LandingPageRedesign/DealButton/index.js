import React from 'react';
import { Button, makeStyles } from '@material-ui/core';

const useSyles = makeStyles({
  button: {
    textTransform: 'none',
    color: '#64748B',
    borderColor: '#CBD5E1',
    borderRadius: '8px',
    '& .MuiButton-startIcon': {
      color: '#64748B',
    },
    '&:hover': {
      background: '#ECF3FF',
    },
    '&:focus': {
      border: '2px solid #186EFF',
      color: '#186EFF',
      '& .MuiButton-startIcon': {
        color: '#186EFF',
      },
    },
  },
});

export default function DealButton({ text, icon, style, ...props }) {
  const classes = useSyles();

  return (
    <Button className={classes.button} variant="outlined" style={style} startIcon={icon} {...props}>
      {text}
    </Button>
  );
}
