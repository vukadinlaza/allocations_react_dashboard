import React, { Suspense } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';

const RemoteDealPage = React.lazy(() => import('build/DealPage'));

export default function DealPage() {
  const { userProfile } = useAuth();
  const history = useHistory();

  return (
    <Suspense fallback={<Loader />}>
      <RemoteDealPage
        user={userProfile}
        pushToDealPage={({ organization, dealSlug }) =>
          history.push(`/deals/${organization || 'allocations'}/${dealSlug}`)
        }
      />
    </Suspense>
  );
}
