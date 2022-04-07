import { useFlags } from 'launchdarkly-react-client-sdk';
import React from 'react';
import Loader from '../utils/Loader';

const TaxDashboard = React.lazy(() => import('taxdashboard/TaxDashboard'));
const InvestorDashboard = React.lazy(() => import('tax/InvestorDashboard'));

export default function RemoteTaxDashboard() {
  const { taxActivity } = useFlags();

  return (
    <React.Suspense fallback={<Loader />}>
      {taxActivity === 'tax-dashboard' ? <TaxDashboard /> : <InvestorDashboard />}
    </React.Suspense>
  );
}
