import React, { Suspense } from 'react';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';

React.lazy(() => import('passport/PassportDropdown'));
const OrgDetails = React.lazy(() => import('build/OrgDetails'));

export default function RemoteOrgDetails() {
  const { userProfile } = useAuth();

  return (
    <>
      <Suspense fallback={<Loader />}>
        <OrgDetails user={userProfile} />
      </Suspense>
    </>
  );
}
