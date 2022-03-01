import React from 'react';
import { Container, Modal, Typography, Grid, Paper, Box } from '@material-ui/core';
import { useFlags } from 'launchdarkly-react-client-sdk';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import CryptoIcon from '../../../assets/usdc_icon.svg';
import { phone } from '../../../utils/helpers';
import BankIcon from '../../../assets/bank.svg';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    maxWidth: '721px',
  },
  modalPaper: {
    marginTop: '8vh',
    borderRadius: '1rem 1rem 0 0 ',
    padding: theme.spacing(2),
    maxHeight: 'calc(100% - 8vh)',
    backgroundColor: '#F7F7F7',
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
    [theme.breakpoints.down(phone)]: {
      fontSize: '1.25em',
    },
  },
  label: {
    color: '#2A2B54',
    fontWeight: 'bold',
  },
  radioGroup: {
    margin: '25px auto',
    flexDirection: 'row',
  },
  radio: {
    color: '#2A2B54',
  },
  clickableButton: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    height: '240px',
    width: '240px',

    textAlign: 'center',
    margin: '.5rem',
    padding: '.9rem',
    cursor: 'pointer',
    [theme.breakpoints.down(phone)]: {
      width: '150px',
      height: '150px',
      margin: '.25rem',
    },

    '&:hover': {
      boxShadow: '0px 0px 1px #00000029 !important;',
      transform: 'translateY(2px)',
    },
  },
  clickableButtonText: {
    margin: '.5rem',
    fontWeight: '600',
  },
  clickableButtonIcon: {
    width: '25%',
    height: 'auto',
    [theme.breakpoints.down(phone)]: {
      width: '40%',
    },
  },
  modalText: {
    margin: 'auto',
    marginTop: '10px',
    fontWeight: 'bold',
    fontSize: '1.5em',
    fontFamily: 'robot',
  },
}));

const PaymentSelectModal = ({
  open,
  cryptoOptions,
  setOpen,
  setWireInstructionsOpen,
  setCryptoPaymentOpen,
}) => {
  const { cryptoPaymentInBuild } = useFlags();
  const classes = useStyles();
  const paymentOptions = [];

  /// default
  paymentOptions.push({
    paymentMethod: 'Wire Funds',
    buttonText: 'Show Wire Instructions',
    openFunction: () => setWireInstructionsOpen(true),
  });

  // optional crypto option
  if (cryptoOptions?.crypto_payments && cryptoPaymentInBuild) {
    paymentOptions.push({
      paymentMethod: 'Send Crypto',
      buttonText: 'Show Crypto Instructions',
      openFunction: () => setCryptoPaymentOpen(true),
    });
  }
  return (
    <Modal open={open} onClose={() => setOpen(false)} className={classes.modal}>
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
                  <div style={{ color: '#FFFFFF', fontSize: '20px' }}>
                    {' '}
                    How would you like to invest?
                  </div>
                  <CloseIcon
                    style={{ cursor: 'pointer', marginTop: 'auto' }}
                    onClick={() => setOpen(false)}
                    htmlColor="#FFFFFF"
                  />
                </Box>
              </Grid>
            </Paper>

            <Paper
              className={classes.innerPaper}
              style={{
                boxShadow: 'none !important',
                backgroundColor: '#F7F7F7',
                borderRadius: '0 0 1rem 1rem',
              }}
            >
              <Grid container style={{ marginBottom: '25px' }}>
                <Grid item style={{ width: '100%', background: '#F7F7F7' }}>
                  <FormControl component="fieldset" style={{ width: '100%' }}>
                    <RadioGroup className={classes.radioGroup}>
                      <Box
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        {paymentOptions.map((paymentType) => {
                          return (
                            <Paper
                              onClick={() => {
                                setOpen(false);
                                paymentType.openFunction();
                              }}
                              key={paymentType.paymentMethod}
                              className={classes.clickableButton}
                            >
                              <div style={{ height: '55px' }}>
                                <img
                                  alt={`${paymentType.paymentMethod} icon`}
                                  className={classes.clickableButtonIcon}
                                  src={
                                    paymentType.paymentMethod === 'Send Crypto'
                                      ? CryptoIcon
                                      : BankIcon
                                  }
                                />
                              </div>
                              <Typography className={classes.clickableButtonText}>
                                {paymentType.paymentMethod}
                              </Typography>
                            </Paper>
                          );
                        })}
                      </Box>
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Modal>
  );
};

export default PaymentSelectModal;
