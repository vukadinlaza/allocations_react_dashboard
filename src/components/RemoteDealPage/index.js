import React, { Suspense } from 'react';
import { Redirect, useHistory, useLocation, useParams } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';

const DealPage = React.lazy(() => import('build/DealPage'));

export default function RemoteDealPage() {
  const history = useHistory();
  const { pathname } = useLocation();
  const { organization, deal_id, deal_slug } = useParams();
  const { userProfile } = useAuth();
  return (
    <Suspense fallback={<Loader />}>
      <DealPage
        orgSlug={organization}
        dealId={deal_id}
        dealSlug={deal_slug}
        pathname={pathname}
        pushToDealPage={() => history.push(`/admin/${organization}/${deal_id}`)}
        goToInvestPage={() => history.push(`/invest/${deal_id}`)}
        redirectTo404={() => <Redirect to="/404" />}
        user={userProfile}
      />
    </Suspense>
  );
}
