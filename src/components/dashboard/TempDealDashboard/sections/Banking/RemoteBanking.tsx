import React from 'react';
import { useAuth } from '../../../../../auth/useAuth';
import Loader from '../../../../utils/Loader';

const Banking = React.lazy(() => import('treasury/Banking'));

export default function RemoteBanking({ dealData }: { dealData: { [key: string]: any } }) {
  const { userProfile } = useAuth();

  const bankProps = {
    org_id: dealData.organization_id,
    deal_id: dealData._id,
    deal_name: dealData.name,
  };

  return (
    <React.Suspense fallback={<Loader />}>
      <Banking user={userProfile} bankProps={bankProps} />
    </React.Suspense>
  );
}
