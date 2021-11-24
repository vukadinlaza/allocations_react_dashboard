import React, { useEffect, useState } from 'react';
import { Container, Modal, Typography, Grid, Paper, Box, Button } from '@material-ui/core';
import { toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    justifyContent: 'center',
  },
  modalPaper: {
    marginTop: '8vh',
    borderRadius: '1rem 1rem 0 0 ',
    padding: theme.spacing(2),
    maxHeight: 'calc(100% - 8vh)',
  },
  modalHeader: {
    fontFamily: 'Roboto !important',
  },
  label: {
    color: '#2A2B54',
    fontWeight: 'bold',
  },
  radioGroup: {
    margin: '25px',
    flexDirection: 'row',
  },
  radio: {
    color: '#2A2B54',
  },
}));
function TransferInstructions({ investmentAmount, transactionFee, totalDue }) {
  const classes = useStyles();

  return (
    <Paper
      style={{
        display: 'flex',
        margin: 'auto',
        width: '100%',
        marginBottom: '29px',
        height: '122px',
      }}
    >
      <Grid style={{ margin: 'auto' }} container>
        <Grid container item spacing={1} style={{ fontSize: '14px', margin: 'auto' }}>
          {' '}
          <Grid
            item
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              paddingBottom: '4px',
            }}
            xs={12}
          >
            <div style={{ marginLeft: '1rem' }}> Please paste your transaction hash here</div>
          </Grid>
        </Grid>
        <Grid container item style={{ fontSize: '14px', margin: 'auto' }}>
          <Grid
            item
            style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}
            xs={12}
          >
            <input style={{ marginLeft: '1rem', width: '90%' }} />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default TransferInstructions;
