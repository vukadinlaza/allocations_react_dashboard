import React, { Suspense } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';

React.lazy(() => import('passport/PassportDropdown'));
const BuildProduct = React.lazy(() => import('build/BuildProduct'));

export default function RemoteBuildProduct() {
  const { userProfile } = useAuth();
  const history = useHistory();

  return (
    <>
      <Suspense fallback={<Loader />}>
        <BuildProduct
          user={userProfile}
          redirectToPostBuild={(deal) => history.push(`/new-build/deal?id=${deal._id}`)}
        />
      </Suspense>
    </>
  );
}
