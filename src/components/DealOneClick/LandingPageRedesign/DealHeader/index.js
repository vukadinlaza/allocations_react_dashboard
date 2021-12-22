import React, { useState, useEffect } from 'react';
import {
  Paper,
  Avatar,
  Button,
  Box,
  CardMedia,
  Grid,
  LinearProgress,
  Typography,
} from '@material-ui/core';
import { useQuery, gql } from '@apollo/client';
import moment from 'moment';
import { nWithCommas } from '../../../../utils/numbers';
import useStyles from '../DealStyles';
import { SimpleBox } from '../widgets/SimpleBox';
import Loader from '../../../utils/Loader';

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
    dealCoverImageKey,
    slug,
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

  const key = dealCoverImageKey?.includes('https')
    ? dealCoverImageKey
    : `https://allocations-public.s3.us-east-2.amazonaws.com/${dealCoverImageKey}`;

  const [img, setImg] = useState(key);
  const [openTooltip, setOpenTooltip] = useState('');

  useEffect(() => {
    setImg(key);
  }, [dealCoverImageKey, slug, key]);

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
            <Avatar className={classes.avatar} />
            <h3 className={classes.companyName}>{company_name}</h3>
          </Box>
        </Box>

        <Grid container className={classes.middleGridContainer}>
          <Grid item>
            <CardMedia
              className={classes.cardMedia}
              component="img"
              alt="SPV Header Image"
              src={img}
              onError={() =>
                setImg('https://allocations-public.s3.us-east-2.amazonaws.com/deals/default.png')
              }
            />
          </Grid>
          <Grid item>
            <h4 className={classes.investmentProgress}>Investment Progress</h4>
            <h6 className={classes.investmentNumber}>${nWithCommas(totalInvestments)}</h6>
            <LinearProgress
              variant="determinate"
              value={getTotalRaiseAmount(target_raise_goal, totalInvestments)}
              className={classes.BorderLinearProgress}
            />
            <div className={classes.minorText}>
              <span className={classes.floatRight}>
                Total Raise Amount: ${nWithCommas(target_raise_goal)}
              </span>
            </div>

            <Button className={classes.investButton}>Invest</Button>
            <Grid container style={{ marginTop: '15px' }}>
              <Grid item>
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
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: '20px',
                  }}
                >
                  <div>Minimum Investment:</div>
                  <div>${nWithCommas(minimumInvestment)}</div>
                </div>
              </Grid>
            </Grid>

            <div className={classes.modalContainer}>
              <SimpleBox
                className={classes.modalParent}
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
                <Typography style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  {' '}
                  {signDeadline
                    ? getDeadline(signDeadline)
                    : wireDeadline
                    ? getDeadline(wireDeadline)
                    : 'No signing deadline has been set.'}
                </Typography>
              </SimpleBox>
              <SimpleBox
                className={classes.modalParent}
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
                <Typography style={{ fontSize: '14px', fontWeight: 'bold' }}>
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
