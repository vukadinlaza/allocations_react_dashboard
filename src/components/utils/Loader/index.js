import React from 'react';
import { CircularProgress } from '@material-ui/core';

export default function Loader() {
  return (
    <div style={{ textAlign: 'center', paddingTop: '3rem' }}>
      <CircularProgress />
    </div>
  );
}
