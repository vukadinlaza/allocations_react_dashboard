import React from 'react';
import { Typography, Grid, Chip } from '@material-ui/core/';

const DealInfo = ({ deal }) => {
  return (
    <Grid container spacing={1} style={{ padding: '1rem' }}>
      <Typography variant="caption" style={{ fontWeight: 'bold' }}>
        Deal Info
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Grid container>
            <Grid item xs={12}>
              <Typography style={{ fontSize: '.7rem', color: 'grey' }}>Pledges</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" style={{ fontWeight: 'bold' }}>
                {deal.deal_total_pledges}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container>
            <Grid item xs={12}>
              <Typography style={{ fontSize: '.7rem', color: 'grey' }}>Days Left</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="caption"
                style={deal.deal_days_left_to_pledge <= 7 ? { color: 'red' } : { color: 'black' }}
              >
                {deal.deal_days_left_to_pledge}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography style={{ fontSize: '.7rem', color: 'grey' }}>Stage</Typography>
          <Chip
            label={deal.deal_stage}
            size="small"
            style={{ background: '#D6E5FF', color: '#0261FF', borderRadius: '5px' }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography style={{ fontSize: '.7rem', color: 'grey' }}>Sector</Typography>
          <Grid container spacing={1}>
            {deal.deal_sectors.map((sector) => {
              return (
                <Grid item key={sector}>
                  <Chip
                    label={sector}
                    size="small"
                    style={{ background: '#D6E5FF', color: '#0261FF', borderRadius: '5px' }}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DealInfo;
