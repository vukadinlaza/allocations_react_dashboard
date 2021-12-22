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
import moment from 'moment';
import useStyles from '../DealStyles';
import { SimpleBox } from '../widgets/SimpleBox';

function DealHeader({ deal }) {
  const {
    company_name,
    dealCoverImageKey,
    slug,
    dealParams: { wireDeadline, signDeadline },
  } = deal;

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

  return (
    <>
      <Paper className={classes.dealHeader}>
        <Box className={classes.box}>
          <Box display="flex">
            <Avatar className={classes.avatar} />
            <div className={classes.companyName}>{company_name}</div>
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
          <Grid item className={classes.middleGridItem}>
            <div className={classes.investmentProgress}>Investment Progress</div>
            <div className={classes.investmentNumber}>$320,000</div>
            <LinearProgress
              variant="determinate"
              value={70}
              className={classes.BorderLinearProgress}
            />
            <div className={classes.minorText}>
              <span className={classes.floatRight}>
                Total Raise Amount:
                <span className={classes.totalRaiseAmount}>$600,000</span>
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
                  <div className={classes.coinvestorTagBubble}>
                    <span className={classes.coinvestorTagText}>USDC</span>
                  </div>
                </div>
              </Grid>
              <Grid item>
                <div className={classes.minimumInvestItem}>
                  <div className={classes.minimumInvestText}>Minimum Investment:</div>
                  <div className={classes.minimumInvestNumber}>$5,000</div>
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
