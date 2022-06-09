import React, { Suspense } from 'react';
import { useParams } from 'react-router';
import Loader from '../utils/Loader';

const NextSteps = React.lazy(() => import('invest/NextSteps'));

export default function RemoteNextSteps() {
  const { investment_id } = useParams();

  return (
    <Suspense fallback={<Loader />}>
      <NextSteps investment_id={investment_id} />
    </Suspense>
  );
}
