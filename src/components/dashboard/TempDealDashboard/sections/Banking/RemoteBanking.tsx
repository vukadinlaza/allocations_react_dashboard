import React from 'react';
import { useAuth } from '../../../../../auth/useAuth';
import Loader from '../../../../utils/Loader';

const Banking = React.lazy(() => import('treasury/Banking'));

export default function RemoteBanking({
  organizationData,
  dealData,
}: {
  organizationData: { [key: string]: any };
  dealData: { [key: string]: any };
}) {
  const { userProfile } = useAuth();
  const { _id: org_id } = organizationData.deal.organization;

  const bankProps = {
    org_id,
    deal_id: dealData.deal._id,
    deal_name: dealData.deal.company_name,
  };

  return (
    <React.Suspense fallback={<Loader />}>
      <Banking user={userProfile} bankProps={bankProps} />
    </React.Suspense>
  );
}
