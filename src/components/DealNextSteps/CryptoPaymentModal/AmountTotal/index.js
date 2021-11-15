import React, { useEffect, useState } from 'react';
import { Container, Modal, Typography, Grid, Paper, Box, Button } from '@material-ui/core';
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
function AmountTotal() {
  const classes = useStyles();

  const [warning, setWarning] = useState(true);

  const handleClose = () => {
    setWarning(true);
  };

  return (
    <Modal onClose={handleClose} className={classes.modal}>
      <Container maxWidth="sm">
        <Grid container style={{ height: '100%' }}>
          <Grid item xs={12} sm={12} md={12} lg={12} style={{ height: '100%' }}>
            <Paper className={classes.modalPaper} style={{ backgroundColor: '#2A2B54' }}>
              <Grid container justifyContent="space-between">
                <Typography variant="h6" style={{ color: '#fff' }}>
                  Crypto Payment{' '}
                </Typography>
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
                    <p>This filler text will be here until we figure out what needs to be said.</p>
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
                      Please send <b>{investment.amount}</b> amount of Crypto to the following
                      wallet address
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
            )}
          </Grid>
        </Grid>
      </Container>
    </Modal>
  );
}

export default CryptoPaymentModal;
