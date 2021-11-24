import React, { useEffect, useState } from 'react';
import { Container, Modal, Typography, Grid, Paper, Box, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    justifyContent: 'center',
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
    <Paper
      style={{
        display: 'flex',
        margin: 'auto',
        width: '100%',
        marginBottom: '29px',
        height: '140px',
      }}
    >
      <Grid style={{ margin: 'auto' }} container>
        <Grid container item spacing={3} style={{ fontSize: '14px', margin: 'auto' }}>
          {' '}
          <Grid
            item
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: '4px',
            }}
            xs={12}
          >
            <div style={{ marginLeft: '1rem' }}>Investment Amount</div>
            <div style={{ marginRight: '1rem' }}>
              {' '}
              ${investmentAmount.toLocaleString('en-us', { minimumFractionDigits: 2 })}
            </div>
          </Grid>
          {/* <Grid item xs={6}>
            ${investmentAmount.toLocaleString('en-us', { minimumFractionDigits: 2 })}
          </Grid> */}
        </Grid>
        <Grid container item spacing={3} style={{ fontSize: '14px', margin: 'auto' }}>
          <Grid
            item
            style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}
            xs={12}
          >
            <div style={{ marginLeft: '1rem' }}>Transaction Fee (1.5%)</div>
            <div style={{ marginRight: '1rem' }}>
              ${transactionFee.toLocaleString('en-us', { minimumFractionDigits: 2 })}
            </div>
          </Grid>
        </Grid>
        <Grid container item spacing={3} style={{ margin: 'auto' }}>
          <Grid item style={{ display: 'flex', justifyContent: 'space-between' }} xs={12}>
            <b style={{ marginLeft: '1rem' }}>Total Amount Due</b>

            <b style={{ marginRight: '1rem' }}>
              {' '}
              ${totalDue.toLocaleString('en-us', { minimumFractionDigits: 2 })}
            </b>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default AmountTotal;
