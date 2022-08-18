import React, { Suspense } from 'react';
import { useHistory } from 'react-router';
import Loader from '../utils/Loader';

React.lazy(() => import('passport/PassportDropdown'));
const OrgDetails = React.lazy(() => import('build/OrgDetails'));

export default function RemoteOrgDetails() {
  const history = useHistory();

  return (
    <>
      <Suspense fallback={<Loader />}>
        <OrgDetails
          redirect={(orgId) => {
            history.push(`/build?organization_id=${orgId}`);
          }}
        />
      </Suspense>
    </>
  );
}
