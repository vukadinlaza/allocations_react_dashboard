import React, { useEffect, useState } from 'react';
import { Container, Modal, Typography, Grid, Paper, Box, Button } from '@material-ui/core';
import { toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';
import CopyIcon from '../../../../assets/copy-icon.svg';

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
}));
function TransferInstructions({ walletAddress }) {
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
            <div style={{ marginLeft: '1rem' }}>
              {' '}
              Please send $25,000 worth of <b>USDC</b> to the following wallet address
            </div>
          </Grid>
        </Grid>
        <Grid container item spacing={1} style={{ fontSize: '14px', margin: 'auto' }}>
          <Grid item style={{ display: 'flex', justifyContent: 'space-between' }} xs={12}>
            <div style={{ marginLeft: '1rem', fontSize: '20px', fontWeight: 'bold' }}>
              {walletAddress}{' '}
              <Button
                style={{ minWidth: '20px' }}
                onClick={() => {
                  //   navigator.clipboard.writeText(data?.getCryptoWalletAddress);
                  toast.info('Copied wallet address to clipboard');
                }}
                className="copy-button"
              >
                <img className={classes.copyIcon} src={CopyIcon} alt="Copy Icon" />
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
    // <Paper style={{ margin: 'auto', width: '100%', marginBottom: '29px', height: '140px' }}>
    //   <Grid style={{ margin: 'auto' }} container>
    //     <Grid container item spacing={3} style={{ fontSize: '14px', margin: 'auto' }}>
    //       {' '}
    //       <Grid
    //         item
    //         style={{
    //           display: 'flex',
    //           flexDirection: 'column',
    //           paddingBottom: '4px',
    //         }}
    //         xs={12}
    //       >
    //         <p style={{ marginLeft: '1em', marginTop: '2em', fontSize: '14px' }}>
    //           Please send $25,000 worth of <b>USDC</b> to the following wallet address
    //           {/* <b>{totalDue.toLocaleString('en-us', { minimumFractionDigits: 2 })}</b>  */}
    //         </p>
    //       </Grid>
    //     </Grid>
    //     <Grid container item spacing={3} style={{ fontSize: '14px', margin: 'auto' }}>
    //       {' '}
    //       <Grid
    //         item
    //         style={{
    //           display: 'flex',
    //           flexDirection: 'column',
    //           paddingBottom: '4px',
    //         }}
    //         xs={12}
    //       >
    //         <p style={{ marginLeft: '1em', fontSize: '20px', fontWeight: 'bold' }}>
    //           0asdlkj3ASDFoawiejf0092q3rasDF
    //           {/* <b>{data?.getCryptoWalletAddress}</b>{' '} */}
    //           <Button
    //             style={{ minWidth: '20px' }}
    //             onClick={() => {
    //               // navigator.clipboard.writeText(data?.getCryptoWalletAddress);
    //               toast.info('Copied wallet address to clipboard');
    //             }}
    //             className="copy-button"
    //           >
    //             <img className={classes.copyIcon} src={CopyIcon} alt="Copy Icon" />
    //           </Button>
    //         </p>
    //       </Grid>
    //     </Grid>
    //   </Grid>
    // </Paper>
  );
}

export default TransferInstructions;
