import React, { useEffect, useState } from 'react';
import { Container, Modal, Typography, Grid, Paper, Box, Button } from '@material-ui/core';
import { useQuery, gql } from '@apollo/client';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import AmountTotal from './AmountTotal/index';
import TransferInstructions from './TransferInstructions/index';
import TransactionHashInput from './TransactionHashInput/index';

import CopyIcon from '../../../assets/copy-icon.svg';
import { phone, tablet } from '../../../utils/helpers';
import { toast } from 'react-toastify';

const DEAL_WALLET_ADDRESS = gql`
  query getCryptoWalletAddress($deal_id: String) {
    getCryptoWalletAddress(deal_id: $deal_id)
  }
`;

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    justifyContent: 'center',
  },
  copyIcon: {
    [theme.breakpoints.down(phone)]: {
      width: '0.65em',
    },
  },
  modalPaper: {
    marginTop: '8vh',
    borderRadius: '1rem 1rem 0 0 ',
    padding: theme.spacing(2),
    maxHeight: 'calc(100% - 8vh)',
    [theme.breakpoints.down(phone)]: {
      marginTop: '20vh',
    },
  },
  innerPaper: {
    boxShadow: 'none !important',
    background: '#186EFF',
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
  modalText: {
    margin: 'auto',
    marginTop: '10px',
    fontWeight: 'bold',
    fontSize: '1.5em',
    fontFamily: 'robot',
  },
  warningText: {
    margin: 'auto',
    marginTop: '20px',
    marginLeft: '2em',
    marginRight: '2rem',
    fontSize: '18px',
    fontFamily: 'robot',
    [theme.breakpoints.down(phone)]: {
      fontSize: '11px',
    },
  },
}));
function CryptoPaymentModal({ open, setOpen, investmentData, dealData }) {
  const classes = useStyles();
  const { deal } = dealData;
  const { investment } = investmentData;
  const { data } = useQuery(DEAL_WALLET_ADDRESS, {
    fetchPolicy: 'network-only',
    variables: { deal_id: deal._id },
  });

  const [warning, setWarning] = useState(false);

  const [investmentAmount, setInvestmentAmount] = useState(investment.amount);
  const [transactionFee, setTransactionFee] = useState(investment.amount * 0.015);
  const [totalDue, setTotalDue] = useState(investmentAmount + transactionFee);

  const handleClose = () => {
    setWarning(true);
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose} className={classes.modal}>
      <Container maxWidth="sm">
        <Grid container style={{ height: '100%' }}>
          <Grid item xs={12} sm={12} md={12} lg={12} style={{ height: '100%' }}>
            <Paper className={`${classes.modalPaper} ${classes.innerPaper}`}>
              <Grid container>
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    background: '#186EFF',
                    width: '100%',
                  }}
                >
                  <div style={{ color: '#FFFFFF', fontSize: '20px' }}> Finish Transaction </div>
                  <CloseIcon
                    style={{ cursor: 'pointer', marginTop: 'auto' }}
                    onClick={(e) => setOpen(false)}
                    htmlColor="#FFFFFF"
                  />
                </Box>
              </Grid>
            </Paper>

            {warning ? (
              <Paper
                className={classes.innerPaper}
                style={{ backgroundColor: '#f7f7f7', borderRadius: '0 0 1rem 1rem' }}
              >
                <Grid container style={{ marginBottom: '25px' }}>
                  {' '}
                  <Grid item className={classes.modalText}>
                    Are you ready to send Crypto?
                  </Grid>
                  <Grid item className={classes.warningText}>
                    <p>
                      Please note, once a transaction has been initiated, it cannot be reversed. All
                      payment transactions processed through Circle's Services are{' '}
                      <b>non-refundable</b>.
                    </p>

                    <p>
                      Additionally, Allocations charges a <b>1.5% transaction fee</b> which will be
                      drawn from your capital contribution amount.
                    </p>
                  </Grid>
                  <Grid
                    item
                    style={{
                      width: '80%',
                      display: 'flex',
                      flexDirection: 'column',
                      margin: 'auto',
                    }}
                  >
                    <Button
                      style={{
                        font: 'normal normal bold 24px/28px Roboto',
                        width: '80%',
                        height: '60px',
                        margin: 'auto',
                        marginTop: '5px',
                        background: '#2A2B54 0% 0% no-repeat padding-box',
                        borderRadius: '10px',
                        opacity: '1',
                        color: '#F7F7F7',
                        textTransform: 'none',
                        outline: 'none',
                      }}
                      onClick={async () => {
                        setWarning(false);
                      }}
                    >
                      Send Crypto
                    </Button>
                    <Button
                      style={{
                        font: 'normal normal bold 24px/28px Roboto',
                        width: '80%',
                        height: '60px',
                        margin: 'auto',
                        marginTop: '5px',
                        background: '#F7F7F7 0% 0% no-repeat padding-box',
                        borderColor: '186EFF !important',
                        borderRadius: '10px',
                        opacity: '1',
                        color: '#2A2B54',
                        textTransform: 'none',
                      }}
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            ) : (
              <Paper
                className={classes.innerPaper}
                style={{ backgroundColor: '#f7f7f7', borderRadius: '0 0 1rem 1rem' }}
              >
                <Grid container style={{ marginBottom: '25px' }}>
                  <Grid item className={classes.warningText}>
                    <AmountTotal
                      investmentAmount={investmentAmount}
                      transactionFee={transactionFee}
                      totalDue={totalDue}
                    />
                    <TransferInstructions />
                    <TransactionHashInput />
                    {/* <p style={{ marginTop: '2em' }}>
                      Please send $
                      <b>{totalDue.toLocaleString('en-us', { minimumFractionDigits: 2 })}</b> worth
                      of <b>USDC</b> to the following wallet address:
                    </p> */}
                    {/* <p>
                      <b>{data?.getCryptoWalletAddress}</b>{' '}
                      <Button
                        style={{ minWidth: '20px' }}
                        onClick={() => {
                          navigator.clipboard.writeText(data?.getCryptoWalletAddress);
                          toast.info('Copied wallet address to clipboard');
                        }}
                        className="copy-button"
                      >
                        <img className={classes.copyIcon} src={CopyIcon} alt="Copy Icon" />
                      </Button>
                    </p>
                    <p>
                      Once your transaction has been completed, please send your transaction hash to{' '}
                      <b>support@allocations.com</b> to verify your payment.
                    </p>{' '} */}
                  </Grid>
                  <Grid
                    item
                    style={{
                      width: '80%',
                      display: 'flex',
                      flexDirection: 'column',
                      margin: 'auto',
                    }}
                  >
                    <Button
                      style={{
                        font: 'normal normal bold 24px/28px Roboto',
                        width: '80%',
                        height: '60px',
                        margin: 'auto',
                        marginTop: '5px',
                        background: '#186EFF 0% 0% no-repeat padding-box',
                        borderColor: '186EFF !important',
                        borderRadius: '10px',
                        opacity: '1',
                        color: '#FFFFFF',
                        textTransform: 'none',
                      }}
                      onClick={handleClose}
                    >
                      Continue
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Modal>
  );
}

export default CryptoPaymentModal;
