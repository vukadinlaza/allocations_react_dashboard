import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { camelCase } from 'lodash';
import CloseIcon from '@material-ui/icons/Close';
import { Paper, Grid, Typography, Modal } from '@material-ui/core';
import './style.scss';
import { nWithCommas } from '../../utils/numbers';

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
  const camelCaseKeys = (obj) =>
    Object.keys(obj).reduce(
      (ccObj, field) => ({
        ...ccObj,
        [camelCase(field)]: obj[field],
      }),
      {},
    );
  const data = camelCaseKeys(showCapitalAccounts);
  console.log('DATA', data);
  return (
    <>
      <Modal
        open={showCapitalAccounts.Email}
        onClose={() => {}}
        className={classes.modal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Grid container xs={12} sm={12} md={4} lg={5}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Paper className={classes.modalPaper}>
              <Grid
                onClick={() => setShowCaptialAccounts(false)}
                style={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }}
              >
                <CloseIcon />
              </Grid>
              <Grid container justify="space-between">
                <div>
                  <Typography className={classes.header}> {data.spvName}</Typography>
                  <Typography className={classes.subHeader}>Private Fund Capital Account Statement</Typography>
                </div>
              </Grid>
              <hr className="solid" />

              <Grid container justify="space-between">
                <Typography>Name</Typography>
                <Typography className={classes.rightVaue}>{data.investorNameEntity}</Typography>
              </Grid>
              <hr className="solid" />
              <Grid container justify="space-between">
                <div>
                  <Typography>Effective Date</Typography>
                  <Typography variant="subtitle2">(Date funds received By Private Fund's bank)</Typography>
                </div>
                <Typography className={classes.rightVaue}>{data.effectiveDate}</Typography>
              </Grid>
              <hr className="solid" />
              <Grid container justify="space-between">
                <div>
                  <Typography>Subscription Amount</Typography>
                  <Typography variant="subtitle2">(Amount wired into Private Fund)</Typography>
                </div>
                <Typography className={classes.rightVaue}>${nWithCommas(data.subscriptionAmount)}</Typography>
              </Grid>
              <hr className="solid" />
              <Grid container justify="space-between">
                <div>
                  <Typography>Private Fund Expenses</Typography>
                  <Typography variant="subtitle2">(Legal, accounting, administration and compliance fees) </Typography>
                </div>
                <Typography className={classes.rightVaue}>${nWithCommas(data.privateFundExpenses)}</Typography>
              </Grid>
              <hr className="solid" />
              <Grid container justify="space-between">
                <div>
                  <Typography>Management Fee</Typography>
                  <Typography variant="subtitle2">(Pro rata share of management fee) </Typography>
                </div>
                <Typography className={classes.rightVaue}>${nWithCommas(data.managementFee)}</Typography>
              </Grid>
              <hr className="solid" />
              <Grid container justify="space-between">
                <div>
                  <Typography>Carry Percentage</Typography>
                  <Typography variant="subtitle2">
                    (Share of the profits of an investment paid to the manager)
                  </Typography>
                </div>
                <Typography className={classes.rightVaue}>{data.carry * 100 || 0}%</Typography>
              </Grid>
              <hr className="solid" />
              <Grid container justify="space-between">
                <div>
                  <Typography>Net Investment Amount</Typography>
                  <Typography variant="subtitle2">(Amount going directly into the private fund)</Typography>
                </div>
                <Typography className={classes.rightVaue}>${nWithCommas(data.netInvestment)}</Typography>
              </Grid>
              <hr className="solid" />
              <Grid container justify="space-between">
                <div style={{ maxWidth: '80%' }}>
                  <Typography>Ownership Percentage *</Typography>
                  <Typography variant="subtitle2">
                    *As of the effective date. This percentage does not take into account any carry percentage (if
                    applicable).
                  </Typography>
                </div>
                <Typography className={classes.rightVaue}>{data.ownership}%</Typography>
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
