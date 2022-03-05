import React, { Suspense } from 'react';
import { useParams } from 'react-router';
import Loader from '../utils/Loader';

const DealPage = React.lazy(() => import('build/DealPage'));

export default function RemoteDealPage() {
  const { deal_id } = useParams();

  return (
    <Suspense fallback={<Loader />}>
      <DealPage dealId={deal_id} />
    </Suspense>
  );
}
