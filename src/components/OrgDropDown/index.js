import React, { Suspense } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import { useCurrentOrganizationState } from '../../state/current-organization';
import Loader from '../utils/Loader';

const RemoteOrgDropDown = React.lazy(() => import('build/OrgDropDown'));

export default function OrgDropDown({ loading }) {
  const { userProfile } = useAuth();
  const fundMatch = useRouteMatch('/admin/:organization');
  const fundMatchDeals = useRouteMatch('/deals/:organization/:slug');
  const history = useHistory();
  const [currentOrganization, setCurrentOrganization] = useCurrentOrganizationState();

  return (
    <Suspense fallback={<Loader />}>
      <RemoteOrgDropDown
        user={userProfile}
        currentOrganization={currentOrganization}
        loading={loading}
        fundMatch={fundMatch}
        fundMatchDeals={fundMatchDeals}
        reroute={(path) => history.push(`${path}`)}
        setCurrentOrganization={(newOrg) => setCurrentOrganization(newOrg)}
      />
    </Suspense>
  );
}
