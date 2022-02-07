import React, { Suspense } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';

const RemoteBuild = React.lazy(() => import('build/Build'));

export default function Build() {
  const { userProfile } = useAuth();
  const history = useHistory();

  console.log(userProfile, 'USER');

  return (
    <Suspense fallback={<Loader />}>
      <RemoteBuild
        user={userProfile}
        onCreate={(deal) => history.push(`/public/new-build/deal?id=${deal._id}`)}
      />
    </Suspense>
  );
}
