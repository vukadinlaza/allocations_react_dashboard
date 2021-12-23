import React from 'react';
import { Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  button: {
    background: ({ secondary }) => (secondary ? '#FFFFFF' : '#186EFF'),
    textTransform: 'none',
    color: ({ secondary }) => (secondary ? '#64748B' : '#FFFFFF'),
    border: ({ secondary }) => (secondary ? '1px solid #CBD5E1' : ''),
    borderRadius: '8px',
    '& .MuiButton-startIcon': {
      color: ({ secondary }) => (secondary ? '#64748B' : '#FFFFFF'),
    },
    '&:hover': {
      background: ({ secondary }) => (secondary ? '#ECF3FF' : '#0444B4'),
    },
    '&:focus': {
      border: '1px solid #186EFF',
      color: ({ secondary }) => (secondary ? '#186EFF' : '#FFF'),
      '& .MuiButton-startIcon': {
        color: '#186EFF',
      },
    },
  },
});

export default function DealButton({ text, icon, secondary = false, style, ...props }) {
  const { button } = useStyles({ secondary });

  return (
    <Button className={button} variant="outlined" style={style} startIcon={icon} {...props}>
      {text}
    </Button>
  );
}
