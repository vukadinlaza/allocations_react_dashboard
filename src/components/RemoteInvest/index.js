import React, { Suspense } from 'react';
import { useParams } from 'react-router';
import Loader from '../utils/Loader';

const Invest = React.lazy(() => import('invest/Invest'));

export default function RemoveInvest() {
  const { deal_id, investment_id } = useParams();

  return (
    <Suspense fallback={<Loader />}>
      <Invest deal_id={deal_id} investment_id={investment_id} />
    </Suspense>
  );
}
