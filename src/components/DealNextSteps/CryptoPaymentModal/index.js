import React, { useState } from 'react';
import { Container, Modal, Typography, Grid, Paper, Box, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

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
function CryptoPaymentModal({ open, setOpen, investmentData }) {
  const classes = useStyles();
  const [cryptoData, setCryptoData] = useState({});
  const [warning, setWarning] = useState(true);
  const widgetUrl = `https://sandbox.forumpay.com/pay?merchant_id=945e6d23-fecd-47bd-9f36-4e554ac7a14e&order_amount=${investmentData.investment.amount}&order_currency=USD&item_name=&widget_type=0&reference_no=`;
  //   const widgetUrl = `"https://sandbox.forumpay.com/pay?merchant_id=945e6d23-fecd-47bd-9f36-4e554ac7a14e&order_amount=25000&order_currency=USD&item_name=&widget_type=0&reference_no="`;

  console.log('inv data', widgetUrl);

  const handleClose = () => {
    setWarning(true);
    setOpen(false);
  };
  const createPayment = async () => {
    const { investment } = investmentData;
    const cryptoBody = {
      invoice_amount: investment.amount,
    };
    console.log('this is the crypto body', cryptoBody);
    const res = await fetch('http://localhost:4000/api/test', {
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      body: JSON.stringify(cryptoBody),
    });
    const data = await res.json();
    setCryptoData(data);
    console.log('this is what i get back from the post ', data);
    // setOpenCrypto(true);

    if (!data.error) return console.log(`success!`, data);
    console.log('There was an Error', data.error);
  };
  return (
    <Modal open={open} onClose={handleClose} className={classes.modal}>
      <Container maxWidth="sm">
        <Grid container style={{ height: '100%' }}>
          <Grid item xs={12} sm={12} md={12} lg={12} style={{ height: '100%' }}>
            <Paper className={classes.modalPaper} style={{ backgroundColor: '#2A2B54' }}>
              <Grid container justifyContent="space-between">
                <Typography variant="h6" style={{ color: '#fff' }}>
                  Crypto Payment{' '}
                </Typography>
                <Box onClick={handleClose} style={{ cursor: 'pointer' }}>
                  <CloseIcon htmlColor="#fff" />
                </Box>
              </Grid>
            </Paper>

            {warning ? (
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
                    Are you ready to make your payment?{' '}
                  </Grid>
                  <Grid
                    item
                    style={{
                      margin: '20px',
                      // marginTop: '20px',
                      fontSize: '12px',
                      fontFamily: 'robot',
                    }}
                  >
                    <p>
                      Once initiated, you will have 15 minutes to complete this transaction. Please
                      have your mobile phone ready to scan a QR code.
                    </p>
                    <p>
                      Please note, ForumPay charges a 1% transaction fee, which will be added on top
                      of your capital contribution amount.
                    </p>
                  </Grid>
                  <Grid item style={{ margin: 'auto' }}>
                    <Button onClick={() => setWarning(false)}>Send Crypto</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                  </Grid>
                </Grid>
              </Paper>
            ) : (
              <Paper style={{ backgroundColor: '#fff', borderRadius: '0 0 1rem 1rem' }}>
                <iframe
                  title="forumpay crypto payment widget"
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    height: '1550px',
                  }}
                  src={widgetUrl}
                  frameBorder="0"
                />
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Modal>
  );
}

export default CryptoPaymentModal;
