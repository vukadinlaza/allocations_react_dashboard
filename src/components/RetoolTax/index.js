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

const RetoolTax = () => {
  const styles = useStyles({ isAuthenticated: true });
  const { search } = useLocation();
  const { userProfile } = useAuth();
  const { taxDashboard } = useFlags();
  const { data } = useQuery(RETOOL_EMBED_URL, {
    fetchPolicy: 'network-only',
    variables: { app: 'taxExternal' },
  });
  const currentOrganization = search ? search.split('=')?.[1] : null;
  const isUserOrgAdmin = userProfile?.organizations_admin?.length;
  console.log(!data, !isUserOrgAdmin, !taxDashboard);

  if (!data || !isUserOrgAdmin || !taxDashboard) return null;
  return (
    <div className={styles.retoolPage}>
      <Retool
        url={data.retoolEmbedUrl}
        data={{ userEmail: userProfile.email, organizationId: currentOrganization }}
      />
    </div>
  );
};

export default RetoolTax;
