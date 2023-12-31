import React, { Suspense } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router';
import queryString from 'query-string';
import { useAuth } from '../../auth/useAuth';
import { useCurrentOrganizationState } from '../../state/current-organization';
import Loader from '../utils/Loader';

const RemoteOrgDropDown = React.lazy(() => import('build/OrgDropDown'));

export default function OrgDropDown({ loading }) {
  const { userProfile } = useAuth();
  const fundMatch = useRouteMatch('/admin/:organization');
  const dealRouteMatch = useRouteMatch('/deals/:organization/:slug');
  const wildcardMatch = useRouteMatch('/*/:organization/*');
  const location = useLocation();
  const parsedLocationQuery = queryString.parse(location.search);
  const history = useHistory();
  const [currentOrganization, setCurrentOrganization] = useCurrentOrganizationState();

  return (
    <Suspense fallback={<Loader />}>
      <RemoteOrgDropDown
        user={userProfile}
        currentOrganization={currentOrganization}
        loading={loading}
        fundMatch={fundMatch}
        dealRouteMatch={dealRouteMatch}
        wildcardMatch={wildcardMatch}
        locationPath={location.pathname}
        parsedLocationQuery={parsedLocationQuery}
        reroute={(path) => history.push(`${path}`)}
        setCurrentOrganization={(newOrg) => setCurrentOrganization(newOrg)}
      />
    </Suspense>
  );
}
