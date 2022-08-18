import React, { Suspense } from 'react';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';

React.lazy(() => import('passport/PassportDropdown'));
const BuildProduct = React.lazy(() => import('build/BuildProduct'));

export default function RemoteBuildProduct() {
  const { userProfile } = useAuth();

  return (
    <>
      <Suspense fallback={<Loader />}>
        <BuildProduct user={userProfile} />
      </Suspense>
    </>
  );
}
