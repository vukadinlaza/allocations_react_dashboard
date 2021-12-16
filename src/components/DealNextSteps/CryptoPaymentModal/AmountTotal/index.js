import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { phone } from '../../../../utils/helpers';

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    display: 'flex',
    margin: 'auto',
    width: '100%',
    marginBottom: '29px',
    height: '140px',
  },
  textItem: {
    margin: 'auto',
    [theme.breakpoints.down(phone)]: {
      fontSize: '14px',
    },
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '4px',
  },
  leftColumn: {
    marginLeft: '1rem',
  },
  rightColumn: {
    marginRight: '1rem',
  },
}));
function AmountTotal({ investmentAmount, transactionFee, totalDue }) {
  const classes = useStyles();

  return (
    <Paper className={classes.paperContainer}>
      <Grid style={{ margin: 'auto' }} container>
        <Grid container item spacing={1} className={classes.textItem}>
          {' '}
          <Grid className={classes.row} item xs={12}>
            <div className={classes.leftColumn}>Investment Amount</div>
            <div className={classes.rightColumn}>
              {' '}
              ${investmentAmount.toLocaleString('en-us', { minimumFractionDigits: 2 })}
            </div>
          </Grid>
        </Grid>
        <Grid container item spacing={1} className={classes.textItem}>
          <Grid item className={classes.row} xs={12}>
            <div className={classes.leftColumn}>Transaction Fee (1.5%)</div>
            <div className={classes.rightColumn}>
              ${transactionFee.toLocaleString('en-us', { minimumFractionDigits: 2 })}
            </div>
          </Grid>
        </Grid>
        <Grid
          container
          item
          spacing={1}
          className={classes.textItem}
          style={{ fontWeight: 'bold' }}
        >
          <Grid item className={classes.row} xs={12}>
            <div className={classes.leftColumn} style={{ fontWeight: 'bold' }}>
              Total Amount Due
            </div>

            <div className={classes.rightColumn} style={{ fontWeight: 'bold' }}>
              {' '}
              ${totalDue.toLocaleString('en-us', { minimumFractionDigits: 2 })}
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default AmountTotal;
