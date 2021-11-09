import React, { useEffect, useState } from 'react';
import { Container, Modal, Typography, Grid, Paper, Box, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

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
function CryptoPaymentModal({ open, setOpen, investmentData, dealData }) {
  const classes = useStyles();
  const [warning, setWarning] = useState(true);
  const [widgetUrl, setWidgetUrl] = useState(null);

  const handleClose = () => {
    setWarning(true);
    setOpen(false);
  };

  const createMerchant = async () => {
    const { investment } = investmentData;
    const { deal } = dealData;
    // const cryptoBody = {
    //   invoice_amount: investment.amount,
    //   company_name: deal.company_name,
    // };
    // const res = await fetch('http://localhost:4000/api/payment', {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // 'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    //   method: 'POST',
    //   body: JSON.stringify(cryptoBody),
    // });
    // const data = await res.json();
    // setWidgetUrl(
    //   `https://sandbox.forumpay.com/pay?merchant_id=${data.merchantId}&order_amount=${investmentData.investment.amount}&order_currency=USD&item_name=&widget_type=0&reference_no=`,
    // );
    setWidgetUrl(
      `https://sandbox.forumpay.com/pay?merchant_id=945e6d23-fecd-47bd-9f36-4e554ac7a14e&order_amount=${investment.amount}&order_currency=USD&item_name=&widget_type=0&reference_no=`,
    );
    // if (!data.error) return console.log(`success!`, data);
    // console.log('There was an Error', data.error);
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

            {warning || !widgetUrl ? (
              <Paper style={{ backgroundColor: '#fff', borderRadius: '0 0 1rem 1rem' }}>
                <Grid container style={{ marginBottom: '25px' }}>
                  {' '}
                  <Grid
                    item
                    style={{
                      margin: 'auto',
                      marginTop: '20px',
                      fontWeight: 'bold',
                      fontSize: '24px',
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
                      Once initiated, you will have <b>15 minutes</b> to complete this transaction.
                      Please have your mobile phone ready to scan a QR code.
                    </p>
                    <p>
                      Please note, ForumPay charges a <b>1% transaction fee</b>, which will be added
                      on top of your capital contribution amount.
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
                        color: '#FFFFFF',
                        textTransform: 'none',
                        outline: 'none',
                      }}
                      onClick={async () => {
                        createMerchant();
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
                        background: '#FFFFFF 0% 0% no-repeat padding-box',
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
              <Paper style={{ backgroundColor: '#fff', borderRadius: '0 0 1rem 1rem' }}>
                <iframe
                  title="forumpay crypto payment widget"
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    height: '1000px',
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
