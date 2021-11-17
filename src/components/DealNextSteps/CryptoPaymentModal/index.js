import React, { useEffect, useState } from 'react';
import { Container, Modal, Typography, Grid, Paper, Box, Button } from '@material-ui/core';
import { useQuery, gql } from '@apollo/client';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import AmountTotal from './AmountTotal/index';
import CopyIcon from '../../../assets/copy-icon.svg';
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
  modalPaper: {
    marginTop: '8vh',
    borderRadius: '1rem 1rem 0 0 ',
    padding: theme.spacing(2),
    maxHeight: 'calc(100% - 8vh)',
    // overflow: 'scroll',
  },
  innerPaper: {
    boxShadow: 'none !important',
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
function CryptoPaymentModal({ open, setOpen, investmentData, dealData }) {
  const classes = useStyles();
  const { deal } = dealData;
  const { investment } = investmentData;

  const { data } = useQuery(DEAL_WALLET_ADDRESS, {
    fetchPolicy: 'network-only',
    variables: { deal_id: '6170936bd738def58550f515' },
  });

  const [warning, setWarning] = useState(true);

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
            <Paper
              className={`${classes.modalPaper} ${classes.innerPaper}`}
              style={{ backgroundColor: '#F7F7F7' }}
            >
              <Grid
                container
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  background: '#F7F7F7',
                }}
              >
                <Box>
                  <CloseIcon
                    style={{ cursor: 'pointer' }}
                    onClick={() => setOpen(false)}
                    htmlColor="#2A2B54"
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
                  <Grid
                    item
                    style={{
                      margin: 'auto',
                      marginTop: '10px',
                      fontWeight: 'bold',
                      fontSize: '28px',
                      fontFamily: 'robot',
                    }}
                  >
                    Are you ready to make your payment?{' '}
                  </Grid>
                  <Grid
                    item
                    style={{
                      margin: 'auto',
                      marginTop: '20px',
                      //   margin: '20px auto auto',
                      marginLeft: '5rem',
                      marginRight: '5rem',
                      // marginTop: '20px',
                      fontSize: '18px',
                      fontFamily: 'robot',
                    }}
                  >
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
                        // outline: 'none',
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
                  {' '}
                  <Grid
                    item
                    style={{
                      margin: 'auto',
                      marginTop: '10px',
                      fontWeight: 'bold',
                      fontSize: '28px',
                      fontFamily: 'robot',
                    }}
                  >
                    Are you ready to make your payment?{' '}
                  </Grid>
                  <Grid
                    item
                    style={{
                      margin: 'auto',
                      marginTop: '20px',
                      //   margin: '20px auto auto',
                      //   marginLeft: '5rem',
                      //   marginRight: '5rem',
                      // marginTop: '20px',
                      fontSize: '18px',
                      fontFamily: 'robot',
                    }}
                  >
                    <AmountTotal
                      investmentAmount={investmentAmount}
                      transactionFee={transactionFee}
                      totalDue={totalDue}
                    />
                    <p
                      style={{
                        margin: 'auto',
                        marginTop: '30px',
                        marginLeft: '2.5rem',
                        marginRight: '2.5rem',
                      }}
                    >
                      Please send $
                      <b>{totalDue.toLocaleString('en-us', { minimumFractionDigits: 2 })}</b> worth
                      of <b>USDC</b> to the following wallet address:
                    </p>
                    <p
                      style={{
                        margin: 'auto',
                        marginTop: '30px',
                        marginLeft: '2.5rem',
                        marginRight: '2.0rem',
                      }}
                    >
                      <b>{data?.getCryptoWalletAddress}</b>{' '}
                      <Button
                        style={{ minWidth: '20px' }}
                        onClick={(e) => {
                          navigator.clipboard.writeText(data?.getCryptoWalletAddress);
                          toast.info('Copied wallet address to clipboard');
                        }}
                        className="copy-button"
                      >
                        <img src={CopyIcon} alt="Copy Icon" />
                      </Button>
                    </p>
                    <p
                      style={{
                        margin: 'auto',
                        marginTop: '30px',
                        marginLeft: '2.5rem',
                        marginRight: '2.5rem',
                      }}
                    >
                      Once your transaction has been completed, please send your transaction hash to{' '}
                      <b>support@allocations.com</b> to verify your payment.
                    </p>{' '}
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
                        background: '#F7F7F7 0% 0% no-repeat padding-box',
                        borderColor: '186EFF !important',
                        borderRadius: '10px',
                        opacity: '1',
                        color: '#2A2B54',
                        textTransform: 'none',
                        // outline: 'none',
                      }}
                      onClick={handleClose}
                    >
                      Cancel
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
