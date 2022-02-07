import React, { Suspense } from 'react';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';

const RemotePostBuild = React.lazy(() => import('build/PostBuild'));

export default function PostBuild({ deal_id }) {
  const { userProfile } = useAuth();

  return (
    <Suspense fallback={<Loader />}>
      <RemotePostBuild user={userProfile} deal_id={deal_id} />
    </Suspense>
  );
}
