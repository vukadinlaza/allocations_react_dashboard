import React, { Suspense } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';

React.lazy(() => import('passport/PassportDropdown'));
const OrgDetails = React.lazy(() => import('build/OrgDetails'));

export default function RemoteOrgDetails() {
  const { userProfile } = useAuth();
  const history = useHistory();

  return (
    <>
      <Suspense fallback={<Loader />}>
        <OrgDetails
          user={userProfile}
          redirect={(params) => {
            history.push(`/build?${params}`);
          }}
        />
      </Suspense>
    </>
  );
}
