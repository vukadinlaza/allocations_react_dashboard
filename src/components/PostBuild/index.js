import React, { Suspense } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';

const RemotePostBuild = React.lazy(() => import('build/PostBuild'));

export default function PostBuild() {
  const { userProfile } = useAuth();
  const params = useParams();

  console.log(params, 'PARAMS');

  return (
    <Suspense fallback={<Loader />}>
      <RemotePostBuild user={userProfile} deal_id={params?.id} />
    </Suspense>
  );
}
