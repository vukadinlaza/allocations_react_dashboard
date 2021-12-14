import React from 'react';
import { Button } from '@material-ui/core';

export default function DealButton({ text, icon, style, ...props }) {
  return (
    <Button
      variant="outlined"
      style={{
        textTransform: 'none',
        color: '#64748B',
        borderColor: '#CBD5E1',
        borderRadius: '8px',
        ...style,
      }}
      startIcon={icon}
      {...props}
    >
      {text}
    </Button>
  );
}
