import React from 'react';
import { useAuth } from '../../../../../auth/useAuth';
import Loader from '../../../../utils/Loader';

const Banking = React.lazy(() => import('treasury/Banking'));

export default function RemoteBanking({
  dealData,
  virtual_account_number,
}: {
  dealData: { [key: string]: any };
  virtual_account_number?: string | null;
}) {
  const { userProfile } = useAuth();

  const bankProps = {
    org_id: dealData.organization_id,
    deal_id: dealData._id,
    deal_name: dealData.name,
  };

  return (
    <React.Suspense fallback={<Loader />}>
      <Banking
        user={userProfile}
        bankProps={bankProps}
        virtual_account_number={virtual_account_number}
      />
    </React.Suspense>
  );
}

RemoteBanking.defaultProps = {
  virtual_account_number: null,
};
