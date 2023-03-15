import React from 'react';
import Retool from 'react-retool';
import { gql, useQuery } from '@apollo/client';
import { useLocation } from 'react-router';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useAuth } from '../../auth/useAuth';

const RETOOL_EMBED_URL = gql`
  query GetRetoolEmbedUrl($app: String!) {
    retoolEmbedUrl(app: $app)
  }
`;

const RetoolMigrationsFms = () => {
  const { search } = useLocation();
  const { userProfile } = useAuth();
  const { migrationsManagement } = useFlags();
  const { data } = useQuery(RETOOL_EMBED_URL, {
    fetchPolicy: 'network-only',
    variables: { app: 'migrationsFms' },
  });
  const currentOrganization = search ? search.split('=')?.[1] : null;
  const isUserTheOrgAdmin = userProfile?.organizations_admin
    ?.map((o) => o._id)
    .includes(currentOrganization);

  if (!data || (currentOrganization && !isUserTheOrgAdmin) || !migrationsManagement) return null;
  return (
    <div style={{ width: '100%', height: '84vh' }}>
      <Retool
        url={data.retoolEmbedUrl}
        data={{ user: { email: userProfile.email }, organizationId: currentOrganization }}
      />
    </div>
  );
};

export default RetoolMigrationsFms;
