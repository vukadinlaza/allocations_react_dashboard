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
      <Box display="flex" justifyContent="space-between" style={{ backgroundColor: '' }}>
        <Box display="flex">
          <Avatar />
          <h1>{company_name}</h1>
        </Box>
        <Button color="primary" variant="outlined" endIcon={<HiOutlinePencil />}>
          Edit
        </Button>
      </Box>

      <Grid container style={{ backgroundColor: '', padding: '20px' }}>
        <Grid item xs={6} style={{ backgroundColor: '', padding: '20px' }}>
          <CardMedia
            style={{ backgroundColor: '' }}
            component="img"
            height="100%"
            width="140"
            alt="SPV Header Image"
            src={img}
            onError={() =>
              setImg('https://allocations-public.s3.us-east-2.amazonaws.com/deals/default.png')
            }
          />
        </Grid>
        <Grid item xs={6} style={{ backgroundColor: '', padding: '20px' }}>
          <h3>Investment Progress</h3>
          <container>
            <h6 style={{ color: '#0561ff' }}>$320,000</h6>
            <LinearProgress
              variant="determinate"
              value="10"
              className={classes.BorderLinearProgress}
            />
            <div style={{ float: 'right', backgroundColor: '', width: '100%' }}>
              <span style={{ float: 'right' }}>
                Maximum Allocation:<span>$600,000</span>
              </span>
            </div>
          </container>
          <div>
            <Button
              style={{ float: 'right', backgroundColor: '#0561ff', width: '100%', color: 'white' }}
            >
              INVEST
            </Button>
            <div style={{ float: 'right', backgroundColor: '', width: '100%' }}>
              <span style={{ float: 'left' }}>
                Invest With:{' '}
                <Button color="primary" variant="contained" disabled>
                  USD
                </Button>
                <Button color="primary" variant="contained" disabled>
                  USDC
                </Button>
              </span>
              <span style={{ float: 'right' }}>
                Minimum Investment:<span>$600,000</span>
              </span>
            </div>
          </div>
          <div
            style={{
              backgroundColor: '',
              display: 'flex',
              padding: '10px',
              justifyContent: 'center',
            }}
          >
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
      <Box display="flex" justifyContent="space-between" style={{ backgroundColor: '' }}>
        <h5>INVESTING DETAILS</h5>
      </Box>

      {/* CREATE ARRAY AND MAP THROUGH IT FOR THE REST OF THE SIMILAR BOXES */}

      <Box display="flex" justifyContent="space-between" style={{ backgroundColor: '' }}>
        <InvestingDetailsSimpleBox
          title="Offering Type"
          openTooltip={openTooltip}
          handleTooltip={handleTooltip}
          id="offering"
          tooltipContent={
            <Typography color="inherit">
              This is the total capital received into the private fund’s bank account (including
              loans and drawdowns)
            </Typography>
          }
        >
          <Typography style={{ fontSize: '18px' }}>506c</Typography>
        </InvestingDetailsSimpleBox>
      </Box>
    </Paper>
  );
}

export default DealHeader;
