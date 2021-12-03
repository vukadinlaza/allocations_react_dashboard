import React, { useState } from 'react';
import { Container, Modal, Grid, Paper, Box, Button } from '@material-ui/core';
import { useQuery, useMutation, gql } from '@apollo/client';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import AmountTotal from './AmountTotal/index';
import TransferInstructions from './TransferInstructions/index';
import TransactionHashInput from './TransactionHashInput/index';
import CompletedMessage from './CompletedMessage/index';
import { phone } from '../../../utils/helpers';

const DEAL_WALLET_ADDRESS = gql`
  query getCryptoWalletAddress($deal_id: String) {
    getCryptoWalletAddress(deal_id: $deal_id)
  }
`;

const SUBMIT_TRANSACTION_HASH = gql`
  mutation submitTransactionHash($transactionInfo: TransactionInfo!) {
    createInvestmentTransaction(transactionInfo: $transactionInfo) {
      _id
      acknowledged
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    maxWidth: '721px',
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
      marginTop: '15vh',
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

const demoAmount = 5000;

function CryptoPaymentModal({ open, setOpen, investmentData, dealData, userId }) {
  const classes = useStyles();
  const { deal } = dealData;
  const { investment } = investmentData;
  const { data } = useQuery(DEAL_WALLET_ADDRESS, {
    fetchPolicy: 'network-only',
    variables: { deal_id: deal._id },
  });

  const [submitTransactionHash] = useMutation(SUBMIT_TRANSACTION_HASH, {
    onCompleted: () => {
      toast.success('Success! Your hash has been added');
    },
  });

  const [completed, setCompleted] = useState(false);
  const investmentAmount = investment?.amount || demoAmount;
  const transactionFee = investmentAmount * 0.015;
  const totalDue = investmentAmount + transactionFee;

  const [transactionInfo, setTransactionInfo] = useState({
    deal_id: deal._id,
    transaction_hash: '',
    user_id: userId,
  });

  const handleClose = () => {
    setCompleted(false);
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose} className={classes.modal}>
      <Container className={classes.container}>
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
                    onClick={() => handleClose()}
                    htmlColor="#FFFFFF"
                  />
                </Box>
              </Grid>
            </Paper>

            {completed ? (
              <Paper
                className={classes.innerPaper}
                style={{ backgroundColor: '#f7f7f7', borderRadius: '0 0 1rem 1rem' }}
              >
                <Grid container style={{ marginBottom: '25px' }}>
                  <Grid item className={classes.warningText}>
                    <CompletedMessage />
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
                      onClick={() => {
                        handleClose();
                      }}
                    >
                      Okay
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
                    <TransferInstructions
                      totalDue={totalDue}
                      walletAddress={data?.getCryptoWalletAddress}
                    />
                    <TransactionHashInput
                      transactionInfo={transactionInfo}
                      setTransactionInfo={setTransactionInfo}
                    />
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
                      onClick={() => {
                        submitTransactionHash({
                          variables: {
                            transactionInfo,
                          },
                        });
                        setCompleted(true);
                      }}
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
