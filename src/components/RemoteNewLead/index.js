import React, { Suspense } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';

React.lazy(() => import('passport/PassportDropdown'));
const NewLead = React.lazy(() => import('build/NewLead'));

export default function RemoteNewLead() {
  const { userProfile } = useAuth();
  const history = useHistory();

  return (
    <>
      <Suspense fallback={<Loader />}>
        <NewLead
          user={userProfile}
          redirect={(params) => {
            history.push(`/build?${params}`);
          }}
        />
      </Suspense>
    </>
  );
}
