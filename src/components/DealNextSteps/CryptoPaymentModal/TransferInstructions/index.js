import React, { useEffect, useState } from 'react';
import { Container, Modal, Typography, Grid, Paper, Box, IconButton } from '@material-ui/core';
import { toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';
import { phone, tablet } from '../../../../utils/helpers';

import CopyIcon from '../../../../assets/copy-icon.svg';

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    display: 'flex',
    margin: 'auto',
    width: '100%',
    marginBottom: '29px',
    height: '140px',
  },
  copyIcon: {
    width: '0.9rem',
    height: 'auto',
    [theme.breakpoints.down(phone)]: {
      width: '0.65em',
    },
  },
  wireInstructions: {
    fontSize: '18px',
    marginLeft: '1rem',
    marginRight: '1rem',
    paddingBottom: '1rem',
    [theme.breakpoints.down(phone)]: {
      fontSize: '14px',
    },
  },
  walletAddress: {
    fontWeight: 'bold',
    fontSize: '20px',
    marginLeft: '1rem',
    marginRight: '1rem',
    [theme.breakpoints.down(phone)]: {
      fontSize: '11px',
    },
  },
}));
function TransferInstructions({ walletAddress, totalDue }) {
  const classes = useStyles();

  return (
    <Paper className={classes.paperContainer}>
      <Grid container style={{ margin: 'auto' }}>
        <Grid container item spacing={1}>
          {' '}
          <Grid
            item
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
            }}
            xs={12}
          >
            <div className={classes.wireInstructions}>
              {' '}
              Please send ${totalDue.toLocaleString('en-us', { minimumFractionDigits: 2 })} worth of{' '}
              <b>USDC</b> to the following wallet address:
            </div>
          </Grid>
        </Grid>
        <Grid container item spacing={1}>
          <Grid item style={{ display: 'flex', justifyConteont: 'space-between' }} xs={12}>
            <div className={classes.walletAddress}>
              {walletAddress}{' '}
              <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(walletAddress);
                  toast.info('Copied wallet address to clipboard');
                }}
              >
                <img className={classes.copyIcon} src={CopyIcon} alt="Copy Icon" />
              </IconButton>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default TransferInstructions;
