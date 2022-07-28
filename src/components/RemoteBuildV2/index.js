import React, { Suspense } from 'react';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';

const BuildV2 = React.lazy(() => import('build/BuildV2'));

export default function RemoteBuildV2() {
  const { userProfile } = useAuth();

  return (
    <>
      <Suspense fallback={<Loader />}>
        <BuildV2 user={userProfile} />
      </Suspense>
    </>
  );
}
