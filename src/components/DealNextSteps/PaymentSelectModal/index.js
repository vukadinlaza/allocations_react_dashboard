import React from 'react';
import { Container, Modal, Typography, Grid, Paper, Box, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import { useHistory } from 'react-router';
import CryptoIcon from '../../../assets/usdc_icon.svg';
import BankIcon from '../../../assets/bank.svg';

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

const PaymentModal = ({ open, setOpen, setWireInstructionsOpen, setCryptoPaymentOpen }) => {
  const classes = useStyles();

  return (
    <Modal open={open} onClose={() => setOpen(false)} className={classes.modal}>
      <Container maxWidth="sm">
        <Grid container style={{ height: '100%' }}>
          <Grid item xs={12} sm={12} md={12} lg={12} style={{ height: '100%' }}>
            <Paper className={classes.modalPaper} style={{ backgroundColor: '#2A2B54' }}>
              <Grid container justifyContent="space-between">
                <Typography variant="h6" style={{ color: '#fff' }}>
                  Make Payment
                </Typography>
                <Box onClick={() => setOpen(false)} style={{ cursor: 'pointer' }}>
                  <CloseIcon htmlColor="#fff" />
                </Box>
              </Grid>
            </Paper>

            <Paper style={{ backgroundColor: '#fff', borderRadius: '0 0 1rem 1rem' }}>
              <Grid container style={{ marginBottom: '25px' }}>
                {' '}
                <Grid
                  item
                  style={{
                    margin: 'auto',
                    marginTop: '20px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    fontFamily: 'robot',
                  }}
                >
                  How would you like to make your payment?
                </Grid>
                <Grid item style={{ width: '100%' }}>
                  <FormControl component="fieldset" style={{ width: '100%' }}>
                    <RadioGroup className={classes.radioGroup}>
                      <Box
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'space-between',
                        }}
                      >
                        {[
                          {
                            paymentMethod: 'Wire Funds',
                            buttonText: 'Show Wire Instructions',
                            openFunction: () => setWireInstructionsOpen(true),
                          },
                          {
                            paymentMethod: 'Send Crypto',
                            buttonText: 'Show Crypto Instructions',
                            openFunction: () => setCryptoPaymentOpen(true),
                          },
                        ].map((paymentType) => {
                          return (
                            <Paper
                              key={paymentType.paymentMethod}
                              style={{ textAlign: 'center', margin: '.5rem', padding: '.5rem' }}
                            >
                              <div style={{ height: '55px' }}>
                                <img
                                  alt={`${paymentType.paymentMethod} icon`}
                                  style={{ maxWidth: '100%', margin: '1rem' }}
                                  src={
                                    paymentType.paymentMethod === 'Send Crypto'
                                      ? CryptoIcon
                                      : BankIcon
                                  }
                                />
                              </div>
                              <Typography
                                style={{
                                  margin: '.5rem',
                                  fontWeight: '600',
                                }}
                              >
                                {paymentType.paymentMethod}
                              </Typography>
                              <Button
                                variant="contained"
                                style={{ margin: '1rem', color: '#2A2B54' }}
                                onClick={() => {
                                  setOpen(false);
                                  paymentType.openFunction();
                                }}
                              >
                                {paymentType.buttonText}
                              </Button>
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

export default PaymentModal;
