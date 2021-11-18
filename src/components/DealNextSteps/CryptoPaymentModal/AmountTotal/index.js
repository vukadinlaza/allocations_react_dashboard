import React, { useEffect, useState } from 'react';
import { Container, Modal, Typography, Grid, Paper, Box, Button } from '@material-ui/core';
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
    // overflow: 'scroll',
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
function AmountTotal({ investmentAmount, transactionFee, totalDue }) {
  const classes = useStyles();

  return (
    <Paper style={{ margin: 'auto', width: '100%' }}>
      <Grid style={{ margin: 'auto' }} container spacing={1}>
        <Grid container item spacing={3}>
          {' '}
          <Grid item xs={6}>
            Investment Amount
          </Grid>
          <Grid item xs={6}>
            ${investmentAmount.toLocaleString('en-us', { minimumFractionDigits: 2 })}
          </Grid>
        </Grid>
        <Grid container item spacing={3}>
          <Grid item xs={6}>
            Transaction Fee (1.5%)
          </Grid>
          <Grid item xs={6}>
            ${transactionFee.toLocaleString('en-us', { minimumFractionDigits: 2 })}
          </Grid>
        </Grid>
        <Grid container item spacing={3}>
          <hr style={{ width: '100%', color: 'black' }} />
        </Grid>
        <Grid container item spacing={3}>
          <Grid item xs={6}>
            <b>Total Amount Due</b>
          </Grid>
          <Grid item xs={6}>
            ${totalDue.toLocaleString('en-us', { minimumFractionDigits: 2 })}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default AmountTotal;
