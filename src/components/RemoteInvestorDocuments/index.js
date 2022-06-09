import React, { Suspense } from 'react';
import { useParams } from 'react-router';
import Loader from '../utils/Loader';

const InvestorsDocuments = React.lazy(() => import('invest/InvestorsDocuments'));

export default function RemoteInvestorsDocuments() {
  const { deal_id } = useParams();

  return (
    <Suspense fallback={<Loader />}>
      <InvestorsDocuments deal_id={deal_id} />
    </Suspense>
  );
}
