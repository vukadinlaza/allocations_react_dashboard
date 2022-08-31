import React, { Suspense } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';

React.lazy(() => import('passport/PassportDropdown'));
const NewLead = React.lazy(() => import('build/NewLead'));

export default function RemoteNewLead() {
  const { userProfile, loginWithRedirect } = useAuth();
  const history = useHistory();
  return (
    <>
      <Suspense fallback={<Loader />}>
        <NewLead
          user={userProfile}
          redirect={(route) => {
            history.push(route);
          }}
          loginRedirect={(newLeadData) => {
            localStorage.setItem('new-lead-phase', 'org-details');
            localStorage.setItem('new-lead-data', JSON.stringify(newLeadData));
            loginWithRedirect({
              redirectUri: `${window.location.href}`,
            });
          }}
        />
      </Suspense>
    </>
  );
}
