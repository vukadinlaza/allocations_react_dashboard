import React, { ReactText, ReactElement, useState, useEffect } from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import { Grid, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const styles = () => ({});

type Color = 'success' | 'info' | 'warning' | 'error';

interface Props extends WithStyles<typeof styles> {
  type: Color;
  component: string;
  message: string;
  code?: number;
  show: boolean;
}

interface SnackbarData {
  code?: number;
  message?: string;
  type?: string;
}

// PROPS
// type: either 'success', 'error', 'warn', or 'info
// component: either 'toast' or 'snackbar' **TEMPORARY**
// message: message to show
// code: OPTIONAL error, warn, or info code to show
// show: determines if the alert is shown or not

const AllocationsAlert: React.FC<Props> = ({ classes, type, component, message, code, show }) => {
  const [snackbarData, setSnackbarData] = useState<SnackbarData>({ type });

  useEffect(() => {
    setSnackbarData({ code, message, type });
  }, [message, code, type]);

  useEffect(() => {
    if (component === 'toast' && show) toast[type](message);
  }, [component]);

  const handleCloseSnackbar = () => {
    setSnackbarData({});
  };

  if (component === 'toast' || !show) return null;

  return (
    <div>
      <Snackbar
        open={!!Object.keys(snackbarData).length}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={type}>
          {snackbarData.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default withStyles(styles)(AllocationsAlert);
