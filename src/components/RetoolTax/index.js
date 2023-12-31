import React, { useEffect, useState } from 'react';
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
  const { userProfile, getAccessTokenSilently } = useAuth();
  const { taxDashboard } = useFlags();
  const { data } = useQuery(RETOOL_EMBED_URL, {
    fetchPolicy: 'network-only',
    variables: { app: 'taxExternal' },
  });
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (userProfile) {
      (async () => {
        const token = await getAccessTokenSilently();
        setToken(token);
      })();
    }
  }, [userProfile, getAccessTokenSilently]);
  const currentOrganization = search ? search.split('=')?.[1] : null;
  const isUserOrgAdmin = userProfile?.organizations_admin?.length;

  if (!data || !isUserOrgAdmin || !taxDashboard) return null;
  return (
    <div className={styles.retoolPageUpdating}>
      <Retool
        url={data.retoolEmbedUrl}
        data={{
          userEmail: userProfile.email,
          organizationId: currentOrganization,
          userToken: token,
        }}
      />
    </div>
  );
};

export default RetoolTax;
