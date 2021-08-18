import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { camelCase } from 'lodash';
import CloseIcon from '@material-ui/icons/Close';
import { Paper, Grid, Typography, Modal, Container } from '@material-ui/core';
import { nWithCommas, amountFormat } from '../../utils/numbers';

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
    maxHeight: '70vh',
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

export default ({ showCapitalAccounts, setShowCapitalAccounts }) => {
  const classes = useStyles();
  const camelCaseKeys = (obj) =>
    Object.keys(obj).reduce(
      (ccObj, field) => ({
        ...ccObj,
        [camelCase(field)]: obj[field],
      }),
      {},
    );
  const data = camelCaseKeys(showCapitalAccounts || {});

  return (
    <>
      <Modal
        open={Boolean(showCapitalAccounts.Email)}
        onClose={() => {}}
        className={classes.modal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Container maxWidth="sm">
          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Paper className={classes.modalPaper}>
                <Grid
                  onClick={() => setShowCapitalAccounts(false)}
                  style={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }}
                >
                  <CloseIcon />
                </Grid>
                <Grid container justify="space-between">
                  <div>
                    <Typography className={classes.header}> {data.spvName}</Typography>
                    <Typography className={classes.subHeader}>
                      Private Fund Capital Account Statement
                    </Typography>
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
                    <Typography variant="subtitle2">
                      (Date funds received By Private Fund's bank)
                    </Typography>
                  </div>
                  <Typography className={classes.rightVaue}>{data.effectiveDate}</Typography>
                </Grid>
                <hr className="solid" />
                <Grid container justify="space-between">
                  <div>
                    <Typography>Subscription Amount</Typography>
                    <Typography variant="subtitle2">(Amount wired into Private Fund)</Typography>
                  </div>
                  <Typography className={classes.rightVaue}>
                    ${amountFormat(data.subscriptionAmount)}
                  </Typography>
                </Grid>
                <hr className="solid" />
                <Grid container justify="space-between">
                  <div>
                    <Typography>Private Fund Expenses</Typography>
                    <Typography variant="subtitle2">
                      (Legal, accounting, administration and compliance fees){' '}
                    </Typography>
                  </div>
                  <Typography className={classes.rightVaue}>
                    ${amountFormat(data.privateFundExpenses)}
                  </Typography>
                </Grid>
                <hr className="solid" />
                <Grid container justify="space-between">
                  <div>
                    <Typography>Management Fee</Typography>
                    <Typography variant="subtitle2">(Pro rata share of management fee) </Typography>
                  </div>
                  <Typography className={classes.rightVaue}>
                    ${nWithCommas(data.managementFee)}
                  </Typography>
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
                    <Typography variant="subtitle2">
                      (Subscription amount minus initial expenses)
                    </Typography>
                  </div>
                  <Typography className={classes.rightVaue}>
                    ${amountFormat(data.netInvestment)}
                  </Typography>
                </Grid>
                <hr className="solid" />
                <Grid container justify="space-between">
                  <div style={{ maxWidth: '80%' }}>
                    <Typography>Ownership Percentage *</Typography>
                    <Typography variant="subtitle2">
                      *As of the effective date. This percentage does not take into account any
                      carry percentage (if applicable).
                    </Typography>
                  </div>
                  <Typography className={classes.rightVaue}>
                    {(data.ownership * 100).toFixed(2)}%
                  </Typography>
                </Grid>
                <hr className="solid" />
                <Typography> Disclaimer: </Typography>
                <Typography variant="subtitle2">
                  This is a provisional capital account statement reflecting initial set up and
                  investment information. Annual tax returns and financial statements will provide
                  more complete information including future expenses, if any.
                </Typography>
                <div style={{ marginBottom: '2rem' }} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Modal>
    </>
  );
};
