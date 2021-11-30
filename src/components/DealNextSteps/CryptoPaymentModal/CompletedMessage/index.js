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
  completedInstructions: {
    fontSize: '18px',
    marginLeft: '1rem',
    marginRight: '1rem',
    paddingBottom: '1rem',
    [theme.breakpoints.down(phone)]: {
      fontSize: '13px',
    },
  },
}));

function TransferInstructions() {
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
            <div className={classes.completedInstructions}>
              {' '}
              Thank you for completing your transaction! Our team will be contacting you shortly. If
              you have any questions, do not hesitate to contact <b>support@allocations.com.</b>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default TransferInstructions;
