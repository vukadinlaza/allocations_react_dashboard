import React from 'react';
import { CircularProgress } from '@material-ui/core';
import './style.scss';

export default function Loader() {
  return (
    <div className="Loader">
      <CircularProgress />
    </div>
  );
}
