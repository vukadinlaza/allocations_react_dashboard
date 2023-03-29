import React from 'react';
import Retool from 'react-retool';
import { gql, useQuery } from '@apollo/client';
import { useLocation } from 'react-router';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useAuth } from '../../auth/useAuth';
import useStyles from '../../styles';

const RETOOL_EMBED_URL = gql`
  query GetRetoolEmbedUrl($app: String!) {
    retoolEmbedUrl(app: $app)
  }
`;

const RetoolMigrations = () => {
  const styles = useStyles({ isAuthenticated: true });
  const { search } = useLocation();
  const { userProfile } = useAuth();
  const { migrationsManagement } = useFlags();
  const { data } = useQuery(RETOOL_EMBED_URL, {
    fetchPolicy: 'network-only',
    variables: { app: 'migrations' },
  });
  const currentOrganization = search ? search.split('=')?.[1] : null;
  const isUserTheOrgAdmin = userProfile?.organizations_admin
    ?.map((o) => o._id)
    .includes(currentOrganization);

  if (!data || (currentOrganization && !isUserTheOrgAdmin) || !migrationsManagement) return null;
  return (
    <div className={styles.retoolPage}>
      <Retool
        url={data.retoolEmbedUrl}
        data={{ user: { email: userProfile.email }, organizationId: currentOrganization }}
      />
    </div>
  );
};

export default RetoolMigrations;
