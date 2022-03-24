import React, { Suspense } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';

const RemotePostBuild = React.lazy(() => import('build/PostBuild'));

export default function PostBuild({ deal_id }) {
  console.log('deal id', deal_id);
  const { userProfile } = useAuth();
  const { search } = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(search);

  return (
    <Suspense fallback={<Loader />}>
      <RemotePostBuild
        user={userProfile}
        deal_id={params.get('id') || deal_id}
        redirectToDashboard={() => history.push('/')}
      />
    </Suspense>
  );
}
