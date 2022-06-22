import React, { Suspense } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';

const RemotePostBuild = React.lazy(() => import('build/PostBuild'));

export default function PostBuild({ dealId }) {
  const { userProfile } = useAuth();
  const { search } = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(search);

  return (
    <Suspense fallback={<Loader />}>
      <RemotePostBuild
        user={userProfile}
        deal_id={dealId || params.get('id')}
        redirectToDashboard={() => history.push('/')}
        redirectTo404={() => <Redirect to="/404" />}
      />
    </Suspense>
  );
}
