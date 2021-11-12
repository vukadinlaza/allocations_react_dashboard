import React from 'react';
import DealCard from './DealsCard/DealCard';

/* Dummy data for now */
const pledgedDeals = [
  {
    deal_name: 'Wowzer',
    deal_image: '',
    deal_max_allocation: 795000,
    deal_raised_amount: 420000,
    deal_total_pledges: 13,
    deal_days_left_to_pledge: 7,
    deal_stage: 'Seed 3',
    deal_sectors: ['Crypto', 'Real Estate', 'Human Resources'],
  },
  {
    deal_name: 'Verizon',
    deal_image: '',
    deal_max_allocation: 110000,
    deal_raised_amount: 33000,
    deal_total_pledges: 8,
    deal_days_left_to_pledge: 27,
    deal_stage: 'Seed',
    deal_sectors: ['Crypto', 'Space', 'Human Resources'],
  },
  {
    deal_name: 'TOPper',
    deal_image: '',
    deal_max_allocation: 400000,
    deal_raised_amount: 750000,
    deal_total_pledges: 21,
    deal_days_left_to_pledge: 3,
    deal_stage: 'Pre-Seed',
    deal_sectors: ['Crypto', 'Real Estate', 'Human Resources'],
  },
  {
    deal_name: 'Aardvark',
    deal_image: '',
    deal_max_allocation: 950000,
    deal_raised_amount: 630000,
    deal_total_pledges: 19,
    deal_days_left_to_pledge: 13,
    deal_stage: 'Seed 1',
    deal_sectors: ['Crypto', 'AI'],
  },
];

const PledgedDeals = ({ userProfile, deals }) => {
  return (
    <>
      <DealCard deals={pledgedDeals} />
    </>
  );
};

export default PledgedDeals;
