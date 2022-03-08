import React, { Suspense } from 'react';
import { Redirect, useHistory, useParams } from 'react-router';
import Loader from '../utils/Loader';

const DealPage = React.lazy(() => import('build/DealPage'));

export default function RemoteDealPage() {
  const history = useHistory();
  const { organization, deal_id } = useParams();

  return (
    <Suspense fallback={<Loader />}>
      <DealPage
        orgSlug={organization}
        dealId={deal_id}
        pushToDealPage={({ organization, dealId }) =>
          history.push(`/admin/${organization}/${dealId}`)
        }
        redirectTo404={() => <Redirect to="/404" />}
      />
    </Suspense>
  );
}
