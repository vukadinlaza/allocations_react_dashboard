import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { camelCase, omit, get } from 'lodash';
import CloseIcon from '@material-ui/icons/Close';
import { Paper, Grid, Typography, Modal, Container, Button } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { nWithCommas, amountFormat } from '../../../utils/numbers';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
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
  rightValue: {
    marginRight: '1.75rem',
    textAlign: 'left',
    minWidth: '15%',
  },
}));

const CREATE_CAP_PDF = gql`
  mutation CreateCapPDF($data: Object) {
    createCapPDF(data: $data) {
      _id
      documents {
        link
        path
      }
    }
  }
`;

export default ({ showCapitalAccounts, setShowCapitalAccounts }) => {
  const classes = useStyles();
  const camelCaseKeys = (obj) =>
    Object.keys(obj).reduce((ccObj, field) => {
      if (field.includes('Management Fee')) {
        const percOrDollar = field.includes('%') ? '%' : '$';
        return { ...ccObj, [camelCase(field) + percOrDollar]: obj[field] };
      }
      return { ...ccObj, [camelCase(field)]: obj[field] };
    }, {});
  const data = camelCaseKeys(showCapitalAccounts || {});
  const [createCapPDF, { data: capRes, loading }] = useMutation(CREATE_CAP_PDF);
  useEffect(() => {
    createCapPDF({
      variables: {
        data: { ...omit(data, 'documents'), investmentId: showCapitalAccounts.investmentId },
      },
    });
  }, [showCapitalAccounts]);
  const capitalPDF = get(capRes, 'createCapPDF.documents', []).find((d) =>
    d.path.includes('Capital_Account_Statement'),
  );
  return (
    <>
      <Modal
        open={Boolean(showCapitalAccounts?.Email)}
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
                  style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <a href={`https://${capitalPDF?.link}`} target="_blank" rel="noreferrer">
                    <Button
                      variant="contained"
                      disabled={loading && !capitalPDF}
                      color="primary"
                      style={{ marginBottom: '.5rem' }}
                    >
                      {loading && !capitalPDF && 'Generating your PDF version'}
                      {capitalPDF && 'View as PDF'}
                    </Button>
                  </a>
                  <CloseIcon onClick={() => setShowCapitalAccounts(false)} />
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
                  <Typography className={classes.rightValue}>{data.investorNameEntity}</Typography>
                </Grid>
                <hr className="solid" />
                <Grid container justify="space-between">
                  <div>
                    <Typography>Effective Date</Typography>
                    <Typography variant="subtitle2">
                      (Date funds received By Private Fund's bank)
                    </Typography>
                  </div>
                  <Typography className={classes.rightValue}>{data.effectiveDate}</Typography>
                </Grid>
                <hr className="solid" />
                <Grid container justify="space-between">
                  <div>
                    <Typography>Subscription Amount</Typography>
                    <Typography variant="subtitle2">(Amount wired into Private Fund)</Typography>
                  </div>
                  <Typography className={classes.rightValue}>
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
                  <Typography className={classes.rightValue}>
                    ${amountFormat(data.privateFundExpenses)}
                  </Typography>
                </Grid>
                <hr className="solid" />
                <Grid container justify="space-between">
                  <div>
                    <Typography>Management Fee</Typography>
                    <Typography variant="subtitle2">(Pro rata share of management fee) </Typography>
                  </div>
                  <Typography className={classes.rightValue}>
                    ${nWithCommas(data.managementFee$)}
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
                  <Typography className={classes.rightValue}>{data.carry * 100 || 0}%</Typography>
                </Grid>
                <hr className="solid" />
                <Grid container justify="space-between">
                  <div>
                    <Typography>Net Investment Amount</Typography>
                    <Typography variant="subtitle2">
                      (Subscription amount minus initial expenses)
                    </Typography>
                  </div>
                  <Typography className={classes.rightValue}>
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
                    {(data.ownership * 100).toFixed(4)}%
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
