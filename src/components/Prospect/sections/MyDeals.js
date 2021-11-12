import React, { useState, useEffect } from 'react';
import DealCard from './DealsCard/DealCard';

/* Dummy data for now */
const dummyDeals = [
  {
    deal_name: 'Coolio',
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
  const [myDeals, setMyDeals] = useState(deals);
  console.log('heres my deals==>', myDeals);

  const getDeals = () => {
    if (!deals || deals.length < 1) {
      return '';
    }
    const getMyDeals = async () => {
      const dealsHaveCreatedBy = await deals.filter((deal) => deal.created_by);
      const allMyDeals = await dealsHaveCreatedBy.filter(
        (deal) => deal.created_by._id === userProfile._id,
      );
      setMyDeals(allMyDeals);
    };
    getMyDeals();
  };

  useEffect(() => {
    getDeals();
  }, [deals]);

  return (
    <>
      <DealCard deals={dummyDeals} />
    </>
  );
};

export default MyDeals;
