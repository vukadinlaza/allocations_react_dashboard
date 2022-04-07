import { useFlags } from 'launchdarkly-react-client-sdk';
import React from 'react';
import { useAuth } from '../../../../../auth/useAuth';
import Loader from '../../../../utils/Loader';

const Banking = React.lazy(() => import('treasury/Banking'));

export default function RemoteBanking({
  dealData,
  virtual_account_number,
}: {
  dealData: { [key: string]: any };
  virtual_account_number: string | null;
}) {
  const { remoteFundManagerDashboard } = useFlags();
  const { userProfile } = useAuth();

  const bankProps = {
    org_id: remoteFundManagerDashboard ? dealData.organization_id : dealData.deal.organization,
    deal_id: remoteFundManagerDashboard ? dealData._id : dealData.deal._id,
    deal_name: remoteFundManagerDashboard ? dealData.name : dealData.deal.company_name,
    virtual_account_number,
  };

  console.log(bankProps);

  return (
    <React.Suspense fallback={<Loader />}>
      <Banking user={userProfile} bankProps={bankProps} />
    </React.Suspense>
  );
}
