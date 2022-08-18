import React, { Suspense } from 'react';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';

React.lazy(() => import('passport/PassportDropdown'));
const NewLead = React.lazy(() => import('build/NewLead'));

export default function RemoteNewLead() {
  const { userProfile } = useAuth();

  return (
    <>
      <Suspense fallback={<Loader />}>
        <NewLead user={userProfile} />
      </Suspense>
    </>
  );
}
