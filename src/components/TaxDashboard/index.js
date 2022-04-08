import { useFlags } from 'launchdarkly-react-client-sdk';
import React, { useState } from 'react';
import Loader from '../utils/Loader';

const OldTaxDashboard = React.lazy(() => import('taxdashboard/TaxDashboard'));
const TaxDashboard = React.lazy(() => import('tax/TaxDashboard'));
const TaxReturnDashboard = React.lazy(() => import('tax/TaxReturnDashboard'));
const InvestorView = React.lazy(() => import('tax/InvestorView'));

export default function RemoteTaxDashboard() {
  const [manage, setManage] = useState(null);
  const [viewInvestor, setViewInvestor] = useState(null);
  const { taxActivity, taxActivityManage } = useFlags();

  if (taxActivity === 'tax-dashboard') {
    return (
      <React.Suspense fallback={<Loader />}>
        <OldTaxDashboard />
      </React.Suspense>
    );
  }

  if (taxActivityManage) {
    if (viewInvestor) {
      return (
        <React.Suspense fallback={<Loader />}>
          <InvestorView
            email={viewInvestor}
            onBackToDashboard={() => {
              setManage(null);
              setViewInvestor(null);
            }}
            onBackToReturn={() => setViewInvestor(null)}
          />
        </React.Suspense>
      );
    }

    if (manage) {
      return (
        <React.Suspense fallback={<Loader />}>
          <TaxReturnDashboard
            id={manage}
            onBack={() => setManage(null)}
            onViewInvestor={setViewInvestor}
          />
        </React.Suspense>
      );
    }
  }

  return (
    <React.Suspense fallback={<Loader />}>
      <TaxDashboard
        onManage={taxActivityManage ? (taxReturn) => setManage(taxReturn._id) : undefined}
      />
    </React.Suspense>
  );
}
