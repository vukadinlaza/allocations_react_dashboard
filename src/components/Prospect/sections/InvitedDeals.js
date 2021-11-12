import React from 'react';
import { Grid } from '@material-ui/core';
import DealCard from './DealsCard/DealCard';

/* Dummy data, until bring in real data */
const invitedDeals = [
  {
    deal_name: 'Moopie',
    deal_organization: 'aardvark',
    deal_image: '',
    deal_max_allocation: 843000,
    deal_raised_amount: 153000,
    deal_total_pledges: 13,
    deal_days_left_to_pledge: 7,
    deal_stage: 'Seed 3',
    deal_sectors: ['Crypto', 'Real Estate', 'Human Resources'],
  },
  {
    deal_name: 'Shloop',
    deal_organization: 'aardvark',
    deal_image: '',
    deal_max_allocation: 437000,
    deal_raised_amount: 94100,
    deal_total_pledges: 8,
    deal_days_left_to_pledge: 27,
    deal_stage: 'Seed',
    deal_sectors: ['Crypto', 'Space', 'Human Resources'],
  },
  {
    deal_name: 'Good Deal',
    deal_organization: 'aardvark',
    deal_image: '',
    deal_max_allocation: 521000,
    deal_raised_amount: 977000,
    deal_total_pledges: 21,
    deal_days_left_to_pledge: 3,
    deal_stage: 'Pre-Seed',
    deal_sectors: ['Crypto', 'Real Estate', 'Human Resources'],
  },
  {
    deal_name: 'Aardvark',
    deal_organization: 'aardvark',
    deal_image: '',
    deal_max_allocation: 950000,
    deal_raised_amount: 630000,
    deal_total_pledges: 19,
    deal_days_left_to_pledge: 13,
    deal_stage: 'Seed 1',
    deal_sectors: ['Crypto', 'AI'],
  },
];

const InvitedDeals = ({ userProfile, deals }) => {
  return (
    <Grid container spacing={2} justifyContent="center">
      {invitedDeals.map((deal) => {
        return <DealCard deal={deal} />;
      })}
    </Grid>
  );
};

export default InvitedDeals;
