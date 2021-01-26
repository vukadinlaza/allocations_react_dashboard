import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography, Modal } from '@material-ui/core';
import './style.scss';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  modalPaper: {
    marginTop: '8vh',
    borderRadius: '1rem',
    padding: theme.spacing(2),
    maxHeight: '70%',
    overflow: 'scroll',
  },
  header: {
    fontSize: '1.5rem',
  },
  subHeader: {
    fontSize: '1.2rem',
  },
  rightVaue: {
    marginRight: '1.75rem',
    textAlign: 'left',
    minWidth: '15%',
  },
}));

export default ({ showCapitalAccounts, setShowCaptialAccounts }) => {
  const classes = useStyles();
  return (
    <>
      <Modal
        open
        onClose={() => {}}
        className={classes.modal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Grid container xs={12} sm={12} md={4} lg={5}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Paper className={classes.modalPaper}>
              {/* HEADER */}
              <Grid container justify="space-between">
                <div>
                  <Typography className={classes.header}>Boom C, a series of Woah Opportunities, LLC.</Typography>
                  <Typography className={classes.subHeader}>Private Fund Capital Account Statement</Typography>
                </div>
              </Grid>
              <hr className="solid" />

              <Grid container justify="space-between">
                <Typography>Name</Typography>
                <Typography className={classes.rightVaue}>Lance Merrill</Typography>
              </Grid>
              <hr className="solid" />
              <Grid container justify="space-between">
                <div>
                  <Typography>Effective Date</Typography>
                  <Typography variant="subtitle2">(Date funds received By Private Fund's bank)</Typography>
                </div>
                <Typography className={classes.rightVaue}>12/12/2021</Typography>
              </Grid>
              <hr className="solid" />
              <Grid container justify="space-between">
                <div>
                  <Typography>Subscription Amount</Typography>
                  <Typography variant="subtitle2">(Amount wired into Private Fund)</Typography>
                </div>
                <Typography className={classes.rightVaue}>$10,000</Typography>
              </Grid>
              <hr className="solid" />
              <Grid container justify="space-between">
                <div>
                  <Typography>Private Fund Expenses</Typography>
                  <Typography variant="subtitle2">
                    (Fees based on your percent ownership in the Private Fund)
                  </Typography>
                </div>
                <Typography className={classes.rightVaue}>$271</Typography>
              </Grid>
              <hr className="solid" />
              <Grid container justify="space-between">
                <div>
                  <Typography>Managament Fee</Typography>
                </div>
                <Typography className={classes.rightVaue}>$0</Typography>
              </Grid>
              <hr className="solid" />
              <Grid container justify="space-between">
                <div>
                  <Typography>Carry Percentage</Typography>
                  <Typography variant="subtitle2">
                    (Share of the profits of an investment paid to the manager)
                  </Typography>
                </div>
                <Typography className={classes.rightVaue}>10%</Typography>
              </Grid>
              <hr className="solid" />
              <Grid container justify="space-between">
                <div>
                  <Typography>Net Investment Amount</Typography>
                  <Typography variant="subtitle2">(Amount going directly into th private fund)</Typography>
                </div>
                <Typography className={classes.rightVaue}>$9,687</Typography>
              </Grid>
              <hr className="solid" />
              <Grid container justify="space-between">
                <div style={{ maxWidth: '80%' }}>
                  <Typography>Ownership Percentage *</Typography>
                  <Typography variant="subtitle2">
                    (* As of the effective date. This percentage does not take into account any carry percentage (if
                    applicable).)
                  </Typography>
                </div>
                <Typography className={classes.rightVaue}>3.39%</Typography>
              </Grid>
              <hr className="solid" />
              <Typography> Disclaimer: </Typography>
              <Typography variant="subtitle2">
                This is a provisional capital account statement reflecting initial set up and investment information.
                Annual tax returns and financial statements will provide more complete information including future
                expenses, if any.
              </Typography>
              <div style={{ marginBottom: '2rem' }} />
            </Paper>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
};
