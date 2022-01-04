import React, { useState } from 'react';
import { Paper, Button, Box, Grid, LinearProgress, Typography } from '@material-ui/core';
import { useQuery, gql } from '@apollo/client';
import moment from 'moment';
import { nWithCommas } from '../../../../utils/numbers';
import useStyles from '../DealStyles';
import { SimpleBox } from '../widgets/SimpleBox';
import AvatarImage from './AvatarImage';
import Loader from '../../../utils/Loader';
import CoverImage from './CoverImage';

const GET_INVESTMENTS = gql`
  query GetDeal($_id: String) {
    deal(_id: $_id) {
      investments {
        _id
        amount
      }
    }
  }
`;

function DealHeader({ deal }) {
  const {
    _id,
    company_name,
    target_raise_goal,
    accept_crypto,
    dealParams: { wireDeadline, signDeadline, minimumInvestment },
  } = deal;
  const [totalInvestments, setTotalInvestments] = useState('');
  const { loading } = useQuery(GET_INVESTMENTS, {
    variables: {
      _id,
    },
    onCompleted: (data) => {
      const total = data.deal.investments.reduce((prev, cur) => prev + cur.amount, 0);
      setTotalInvestments(total);
    },
  });

  const classes = useStyles();

  const [openTooltip, setOpenTooltip] = useState('');

  const handleTooltip = (id) => {
    setOpenTooltip(id);
  };

  const getDeadline = (date) => {
    return moment(date).format('MM/DD/YYYY');
  };

  if (loading) {
    return <Loader />;
  }

  const getTotalRaiseAmount = (total, progress) => {
    if (progress > total) return 100;
    if (progress === 0) return 0;
    return progress / total;
  };

  return (
    <>
      <Paper className={classes.dealHeader}>
        <Box className={classes.box}>
          <Box display="flex">
            <AvatarImage deal={deal} classes={classes} />
            <span className={classes.companyName}>{company_name}</span>
          </Box>
        </Box>

        <Grid container className={classes.middleGridContainer}>
          <Grid item>
            <CoverImage deal={deal} classes={classes} />
          </Grid>
          <Grid item className={classes.middleGridItem}>
            <span className={classes.investmentProgress}>Investment Progress</span>
            <span className={classes.investmentNumber}>${nWithCommas(totalInvestments)}</span>
            <LinearProgress
              variant="determinate"
              value={getTotalRaiseAmount(target_raise_goal, totalInvestments)}
              className={classes.BorderLinearProgress}
            />
            <div className={classes.minorText}>
              <span className={classes.floatRight}>
                Total Raise Amount:
                <span style={{ fontWeight: 'bold', fontSize: '12px' }}>
                  ${nWithCommas(target_raise_goal)}
                </span>
              </span>
            </div>

            <Button className={classes.investButton}>Invest</Button>
            <Grid container className={classes.gridContainer}>
              <Grid item className={classes.investItem}>
                Invest With:{' '}
                <div style={{ display: 'flex' }}>
                  <div className={classes.coinvestorTagBubble}>
                    <span className={classes.coinvestorTagText}>USD</span>
                  </div>
                  {accept_crypto && (
                    <div className={classes.coinvestorTagBubble}>
                      <span className={classes.coinvestorTagText}>USDC</span>
                    </div>
                  )}
                </div>
              </Grid>
              <Grid item>
                <div className={classes.minimumInvestItem}>
                  <span className={classes.minimumInvestText}>Minimum Investment:</span>
                  <span className={classes.minimumInvestNumber}>
                    {' '}
                    ${nWithCommas(minimumInvestment)}
                  </span>
                </div>
              </Grid>
            </Grid>

            <div className={classes.modalContainer}>
              <SimpleBox
                title="Signing Deadline"
                openTooltip={openTooltip}
                handleTooltip={handleTooltip}
                id="signing"
                tooltipContent={
                  <Typography color="inherit">
                    This is the total capital received into the private fund’s bank account
                    (including loans and drawdowns)
                  </Typography>
                }
              >
                <Typography className={classes.typography}>
                  {' '}
                  {signDeadline
                    ? getDeadline(signDeadline)
                    : wireDeadline
                    ? getDeadline(wireDeadline)
                    : 'No signing deadline has been set.'}
                </Typography>
              </SimpleBox>
              <SimpleBox
                title="Wiring Deadline"
                openTooltip={openTooltip}
                handleTooltip={handleTooltip}
                id="wiring"
                tooltipContent={
                  <Typography color="inherit">
                    This is the total capital received into the private fund’s bank account
                    (including loans and drawdowns)
                  </Typography>
                }
              >
                <Typography className={classes.typography}>
                  {wireDeadline
                    ? getDeadline(wireDeadline)
                    : signDeadline
                    ? getDeadline(signDeadline)
                    : 'No wire deadline has been set.'}
                </Typography>
              </SimpleBox>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

export default DealHeader;
