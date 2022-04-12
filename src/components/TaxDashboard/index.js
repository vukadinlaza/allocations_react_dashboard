import { useFlags } from 'launchdarkly-react-client-sdk';
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useCurrentOrganization } from '../../state/current-organization';
import Loader from '../utils/Loader';

const OldTaxDashboard = React.lazy(() => import('taxdashboard/TaxDashboard'));
const TaxDashboard = React.lazy(() => import('tax/TaxDashboard'));
const TaxReturnDashboard = React.lazy(() => import('tax/TaxReturnDashboard'));
const InvestorView = React.lazy(() => import('tax/InvestorView'));

export default function RemoteTaxDashboard() {
  const history = useHistory();
  const location = useLocation();
  const currentOrganization = useCurrentOrganization();
  const params = new URLSearchParams(location.search);
  const [manage, setManage] = useState(params.get('tax_return') || null);
  const [viewInvestor, setViewInvestor] = useState(params.get('email') || null);
  const { taxActivity, taxActivityManage } = useFlags();

  if (!currentOrganization) return null;

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
              history.push('/tax-activity');
              setManage(null);
              setViewInvestor(null);
            }}
            onBackToReturn={() => {
              history.push(`?tax_activity=${manage}`);
              setViewInvestor(null);
            }}
          />
        </React.Suspense>
      );
    }

    if (manage) {
      return (
        <React.Suspense fallback={<Loader />}>
          <TaxReturnDashboard
            id={manage}
            onBack={() => {
              history.push('/tax-activity');
              setManage(null);
            }}
            onViewInvestor={(email) => {
              history.push(`?tax_return=${manage}&email=${email}`);
              setViewInvestor(email);
            }}
          />
        </React.Suspense>
      );
    }
  }

  const handleManage = (taxReturn) => {
    history.push(`?tax_return=${taxReturn._id}`);
    setManage(taxReturn._id);
  };

  return (
    <React.Suspense fallback={<Loader />}>
      <TaxDashboard
        onManage={taxActivityManage ? handleManage : undefined}
        defaultView={currentOrganization.name.includes('@') ? 'investor' : 'fund-manager'}
      />
    </React.Suspense>
  );
}
