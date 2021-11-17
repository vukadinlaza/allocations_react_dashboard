import React from 'react';
import { Grid } from '@material-ui/core';
import DealCard from './DealsCard/DealCard';

/* Dummy data for now */
const dummyDeals = [
  {
    deal_name: 'Coolio',
    deal_slug: 'coolio',
    deal_organization: 'aardvark',
    deal_image: '',
    deal_max_allocation: 750000,
    deal_raised_amount: 420000,
    deal_total_pledges: 13,
    deal_days_left_to_pledge: 7,
    deal_stage: 'Seed 3',
    deal_sectors: ['Crypto', 'Real Estate', 'Human Resources'],
  },
  {
    deal_name: 'Beef Bros',
    deal_slug: 'beef-bros',
    deal_organization: 'aardvark',
    deal_image: '',
    deal_max_allocation: 535000,
    deal_raised_amount: 96000,
    deal_total_pledges: 8,
    deal_days_left_to_pledge: 27,
    deal_stage: 'Seed',
    deal_sectors: ['Crypto', 'Space', 'Human Resources'],
  },
  {
    deal_name: 'SlimJim',
    deal_slug: 'slimJim',
    deal_organization: 'aardvark',
    deal_image: '',
    deal_max_allocation: 163000,
    deal_raised_amount: 950000,
    deal_total_pledges: 21,
    deal_days_left_to_pledge: 3,
    deal_stage: 'Pre-Seed',
    deal_sectors: ['Crypto', 'Real Estate', 'Human Resources'],
  },
  {
    deal_name: 'Aardvark',
    deal_slug: 'aardvark',
    deal_organization: 'aardvark',
    deal_image: '',
    deal_max_allocation: 777000,
    deal_raised_amount: 547000,
    deal_total_pledges: 19,
    deal_days_left_to_pledge: 13,
    deal_stage: 'Seed 1',
    deal_sectors: ['Crypto', 'AI'],
  },
];

const MyDeals = ({ userProfile, deals }) => {
  /* myDeals for future use of bringing in personal deals with real data*/
  // const myDeals = !deals ? [] : deals?.filter((deal) => deal?.created_by?._id === userProfile?._id);

  return (
    <Grid container spacing={2} justifyContent="center">
      {dummyDeals.map((deal) => {
        return <DealCard deal={deal} key={deal.deal_name} />;
      })}
    </Grid>
  );
};

export default MyDeals;
