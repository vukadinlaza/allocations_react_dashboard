import React, { useEffect, useState } from 'react';
import { Grid, Paper, TextField } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import { phone, tablet } from '../../../../utils/helpers';

const useStyles = makeStyles((theme) => ({
  notchedOutline: {
    borderWidth: '1px',
    borderColor: 'blue !important',
  },
  hashInstructions: {
    fontSize: '18px',
    marginLeft: '1rem',
    [theme.breakpoints.down(phone)]: {
      fontSize: '14px',
    },
  },
}));
function TransferInstructions({ transactionInfo, setTransactionInfo }) {
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
            <div className={classes.hashInstructions} style={{ marginLeft: '1rem' }}>
              {' '}
              Please paste your transaction hash here
            </div>
          </Grid>
        </Grid>
        <Grid container item spacing={1} style={{ fontSize: '14px', margin: 'auto' }}>
          <Grid
            item
            style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}
            xs={12}
          >
            <TextField
              variant="outlined"
              InputProps={{
                classes: {
                  notchedOutline: classes.notchedOutline,
                },
              }}
              style={{ marginLeft: '1rem', width: '90%', height: '60px' }}
              onChange={(e) => {
                setTransactionInfo({
                  ...transactionInfo,
                  transaction_hash: e.target.value,
                });
              }}
              value={transactionInfo?.transaction_hash}
            />
            {/* <input style={{ marginLeft: '1rem', width: '90%', height: '60px' }} /> */}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default TransferInstructions;
