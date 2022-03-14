import React, { Suspense } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { useCurrentOrganizationState } from '../../state/current-organization';
import Loader from '../utils/Loader';

const RemoteOrgDropDown = React.lazy(() => import('build/OrgDropDown'));

export default function OrgDropDown({ loading }) {
  const { userProfile } = useAuth();
  // TO DO: confirm organizations_admin data is same as list of orgs...
  const fundMatch = useRouteMatch('/admin/:organization');
  const fundMatchDeals = useRouteMatch('/deals/:organization/:slug');
  const location = useLocation();
  const history = useHistory();
  const [currentOrganization, setCurrentOrganization] = useCurrentOrganizationState();

  return (
    <Suspense fallback={<Loader />}>
      <RemoteOrgDropDown
        user={userProfile}
        currentOrganization={currentOrganization}
        loading={loading} // bad practice?
        fundMatch={fundMatch}
        fundMatchDeals={fundMatchDeals}
        locationPath={location.pathname}
        reroute={(path) => history.push(`${path}`)}
        setCurrentOrganization={(newOrg) => setCurrentOrganization(newOrg)}
      />
    </Suspense>
  );
}
