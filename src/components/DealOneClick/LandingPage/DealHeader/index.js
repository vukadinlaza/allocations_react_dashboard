import React, { useState, useEffect } from 'react';
import { Paper, Avatar, Button, Box, CardMedia, Grid, LinearProgress } from '@material-ui/core';
import { HiOutlinePencil } from 'react-icons/hi';
import { useStyles } from './style';

function DealHeader({ deal }) {
  const { company_name, dealCoverImageKey, slug } = deal;
  const classes = useStyles();

  const key = dealCoverImageKey?.includes('https')
    ? dealCoverImageKey
    : `https://allocations-public.s3.us-east-2.amazonaws.com/${dealCoverImageKey}`;

  const [img, setImg] = useState(key);

  useEffect(() => {
    setImg(key);
  }, [dealCoverImageKey, slug, key]);

  return (
    <Paper className={classes.dealHeader}>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex">
          <Avatar />
          <h1>{company_name}</h1>
        </Box>
        <Button color="primary" variant="outlined" endIcon={<HiOutlinePencil />}>
          Edit
        </Button>
      </Box>

      <Grid container>
        <Grid item xs={6}>
          <CardMedia
            component="img"
            height="140"
            width="140"
            alt="SPV Header Image"
            src={img}
            onError={() =>
              setImg('https://allocations-public.s3.us-east-2.amazonaws.com/deals/default.png')
            }
          />
        </Grid>
        <Grid item xs={6}>
          <h3>Investment Progress</h3>
          <container>
            <h6 style={{ color: '#0561ff' }}>$320,000</h6>
            <LinearProgress variant="determinate" value="10" />
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
        </Grid>
      </Grid>
    </Paper>
  );
}

export default DealHeader;
