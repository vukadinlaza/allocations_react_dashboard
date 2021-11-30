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
import { HiOutlinePencil } from 'react-icons/hi';
import { useStyles } from './style';
import { SimpleBox } from './widgets/SimpleBox';
import { InvestingDetailsSimpleBox } from './widgets/InvestingDetailsSimpleBox';

function DealHeader({ deal }) {
  const { company_name, dealCoverImageKey, slug } = deal;
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

  return (
    <Paper className={classes.dealHeader}>
      <Box className={classes.box}>
        <Box display="flex">
          <Avatar className={classes.avatar} />
          <h1>{company_name}</h1>
        </Box>
      </Box>

      <Grid container className={classes.middleGridContainer}>
        <Grid item xs={6} className={classes.middleGridContainer}>
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
        <Grid item xs={6} className={classes.gridContainer}>
          <h3>Investment Progress</h3>
          <container>
            <h6 className={classes.investmentNumber}>$320,000</h6>
            <LinearProgress
              variant="determinate"
              value="10"
              className={classes.BorderLinearProgress}
            />
            <div className={classes.minorText}>
              <span className={classes.floatRight}>
                Maximum Allocation:<span>$600,000</span>
              </span>
            </div>
          </container>
          <div>
            <Button className={classes.investButton}>INVEST</Button>
            <div className={classes.divInvestContainer}>
              <span className={classes.floatLeft}>
                Invest With:{' '}
                <Button color="primary" variant="contained" disabled className={classes.usdButton}>
                  USD
                </Button>
                <Button color="primary" variant="contained" disabled className={classes.usdButton}>
                  USDC
                </Button>
              </span>
              <span className={classes.floatRight}>
                Minimum Investment:<span>$600,000</span>
              </span>
            </div>
          </div>
          <div className={classes.modalContainer}>
            <SimpleBox
              title="Signing Date"
              openTooltip={openTooltip}
              handleTooltip={handleTooltip}
              id="signing"
              tooltipContent={
                <Typography color="inherit">
                  This is the total capital received into the private fund’s bank account (including
                  loans and drawdowns)
                </Typography>
              }
            >
              <Typography style={{ fontSize: '18px' }}>11/12/2021</Typography>
            </SimpleBox>
            <SimpleBox
              title="Wiring Date"
              openTooltip={openTooltip}
              handleTooltip={handleTooltip}
              id="wiring"
              tooltipContent={
                <Typography color="inherit">
                  This is the total capital received into the private fund’s bank account (including
                  loans and drawdowns)
                </Typography>
              }
            >
              <Typography style={{ fontSize: '18px' }}>11/12/2021</Typography>
            </SimpleBox>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default DealHeader;
