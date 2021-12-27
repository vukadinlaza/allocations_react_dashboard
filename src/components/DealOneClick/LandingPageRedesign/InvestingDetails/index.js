import React, { useState, useEffect } from 'react';
import { Paper, Box, Typography, Grid } from '@material-ui/core';
import useStyles from '../DealStyles';
import { InvestingDetailsSimpleBox } from '../widgets/InvestingDetailsSimpleBox';

function InvestingDetails({ deal }) {
  const {
    dealCoverImageKey,
    slug,
    dealParams: { dealType, managementFeeType, totalCarry, managementFees },
  } = deal;

  const classes = useStyles();

  const key = dealCoverImageKey?.includes('https')
    ? dealCoverImageKey
    : `https://allocations-public.s3.us-east-2.amazonaws.com/${dealCoverImageKey}`;

  const [openTooltip, setOpenTooltip] = useState('');

  useEffect(() => {}, [dealCoverImageKey, slug, key]);

  const handleTooltip = (id) => {
    setOpenTooltip(id);
  };

  return (
    <>
      <Paper className={classes.dealHeader}>
        <Box className={classes.box}>
          <span className={classes.investmentProgress}>Investing Details</span>
        </Box>
        <Box className={classes.boxInvestingDetails}>
          <Grid container>
            <Grid item sm={3} xs={6}>
              <InvestingDetailsSimpleBox
                title="Offering Type"
                openTooltip={openTooltip}
                handleTooltip={handleTooltip}
                id="offering"
                tooltipContent={
                  <Typography color="inherit">
                    This is the total capital received into the private fund’s bank account
                    (including loans and drawdowns){' '}
                  </Typography>
                }
              >
                <Typography className={classes.boxContent}>{dealType}</Typography>
              </InvestingDetailsSimpleBox>
            </Grid>

            <Grid item sm={3} xs={6}>
              <InvestingDetailsSimpleBox
                title="Fee Frequency"
                openTooltip={openTooltip}
                handleTooltip={handleTooltip}
                id="frequency"
                tooltipContent={
                  <Typography color="inherit">
                    This is the total capital received into the private fund’s bank account
                    (including loans and drawdowns){' '}
                  </Typography>
                }
              >
                <Typography className={classes.boxContent}>{managementFeeType}</Typography>
              </InvestingDetailsSimpleBox>
            </Grid>

            <Grid item sm={3} xs={6}>
              <InvestingDetailsSimpleBox
                title="Deal Stage"
                openTooltip={openTooltip}
                handleTooltip={handleTooltip}
                id="stage"
                tooltipContent={
                  <Typography color="inherit">
                    This is the total capital received into the private fund’s bank account
                    (including loans and drawdowns){' '}
                  </Typography>
                }
              >
                <Typography className={classes.boxContent}>Seed</Typography>
              </InvestingDetailsSimpleBox>
            </Grid>

            <Grid item sm={3} xs={6}>
              <InvestingDetailsSimpleBox
                title="Portfolio Company Securities"
                openTooltip={openTooltip}
                handleTooltip={handleTooltip}
                id="portfolio"
                tooltipContent={
                  <Typography color="inherit">
                    This is the total capital received into the private fund’s bank account
                    (including loans and drawdowns){' '}
                  </Typography>
                }
              >
                <Typography className={classes.boxContent}>Series A Preferred Stock</Typography>
              </InvestingDetailsSimpleBox>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sm={3} xs={6}>
              <InvestingDetailsSimpleBox
                title="Management Fee"
                openTooltip={openTooltip}
                handleTooltip={handleTooltip}
                id="management"
                tooltipContent={
                  <Typography color="inherit">
                    This is the total capital received into the private fund’s bank account
                    (including loans and drawdowns){' '}
                  </Typography>
                }
              >
                <Typography className={classes.boxContent}>{managementFees}%</Typography>
              </InvestingDetailsSimpleBox>
            </Grid>

            <Grid item sm={3} xs={6}>
              <InvestingDetailsSimpleBox
                title="Carry Fee"
                openTooltip={openTooltip}
                handleTooltip={handleTooltip}
                id="carry"
                tooltipContent={
                  <Typography color="inherit">
                    This is the total capital received into the private fund’s bank account
                    (including loans and drawdowns){' '}
                  </Typography>
                }
              >
                <Typography className={classes.boxContent}>{totalCarry}%</Typography>
              </InvestingDetailsSimpleBox>
            </Grid>

            <Grid item sm={3} xs={6}>
              <InvestingDetailsSimpleBox
                title="Sector"
                openTooltip={openTooltip}
                handleTooltip={handleTooltip}
                id="sector"
                tooltipContent={
                  <Typography color="inherit">
                    This is the total capital received into the private fund’s bank account
                    (including loans and drawdowns){' '}
                  </Typography>
                }
              >
                <Typography className={classes.boxContent}>Space</Typography>
              </InvestingDetailsSimpleBox>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
}

export default InvestingDetails;
