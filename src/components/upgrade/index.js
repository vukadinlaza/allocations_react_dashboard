import React from 'react';
import { Paper, Button, Grid } from '@material-ui/core';
import { useHistory, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import './styles.scss';

export default () => {
  const location = useLocation();
  const state = location?.state;
  const assets = {
    SPV: {
      header: `Launch your next ${state.asset} SPV`,
      body: `End-to-end platform for setting up ${state.asset} SPVs. Instant setup, 1-click invest.`,
    },
    FUND: {
      header: `Launch your next ${state.asset}`,
      body: `End-to-end platform for setting up ${state.asset}. Instant setup, 1-click invest.`,
    },
  };
  const image = {
    Crypto: 'https://allocations-public.s3.us-east-2.amazonaws.com/graphic-1.png',
    'Real Estate': 'https://allocations-public.s3.us-east-2.amazonaws.com/graphic-3.png',
    Secondaries: 'https://allocations-public.s3.us-east-2.amazonaws.com/graphic-2.png',
    'Traditional Funds': 'https://allocations-public.s3.us-east-2.amazonaws.com/graphic-4.png',
    'Quarterly Funds': 'https://allocations-public.s3.us-east-2.amazonaws.com/graphic-5.png',
  }[state?.asset];

  const handleUpdate = () => {
    toast.success('Success! Email sent. Allocations will contact you soon.');
  };

  const activeAsset = assets[state?.type];
  if (!activeAsset) return null;
  return (
    <>
      <Paper style={{ padding: '1rem', margin: '2rem 0' }}>
        {' '}
        <span className="title">
          {state.asset} {state.type === 'SPV' ? 'SPVs' : ''}
        </span>{' '}
        <span className="subtitle">(PRO)</span>
      </Paper>
      <Paper style={{ minHeight: '70%', padding: '1rem', display: 'flex', alignItems: 'center' }}>
        <Grid
          container
          style={{ minHeight: '100%', height: '100%' }}
          justifyContent="center"
          alignItems="center"
        >
          <Grid
            item
            xs={12}
            md={6}
            justifyContent="center"
            alignItems="center"
            style={{ display: 'flex' }}
          >
            <img src={image} alt="Rocket ship" className="rocket" />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            justifyContent="center"
            alignItems="center"
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <div>{activeAsset.body}</div>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: '2rem' }}
              onClick={handleUpdate}
            >
              Upgrade
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
