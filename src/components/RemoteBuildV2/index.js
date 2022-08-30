import React, { Suspense } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';

React.lazy(() => import('passport/PassportDropdown'));
const BuildV2 = React.lazy(() => import('build/BuildV2'));

export default function RemoteBuildV2() {
  const { userProfile } = useAuth();
  const history = useHistory();

  return (
    <>
      <Suspense fallback={<Loader />}>
        <BuildV2
          user={userProfile}
          redirectToPostBuild={(deal) => history.push(`/new-build/deal?id=${deal.id}`)}
          redirect={(route) => history.push(route)}
        />
      </Suspense>
    </>
  );
}
