import React from 'react';
import Loader from '../utils/Loader';

const TaxDashboard = React.lazy(() => import('taxdashboard/TaxDashboard'));

export default function RemoteTaxDashboard() {
  return (
    <React.Suspense fallback={<Loader />}>
      <TaxDashboard />
    </React.Suspense>
  );
}
