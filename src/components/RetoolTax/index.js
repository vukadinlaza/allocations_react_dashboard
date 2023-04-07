import React from 'react';
// import Retool from 'react-retool';
import { gql, useQuery } from '@apollo/client';
// import { useLocation } from 'react-router';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { Icon, Typography } from '@allocations/design-system';
import { useAuth } from '../../auth/useAuth';
import useStyles from '../../styles';

const RETOOL_EMBED_URL = gql`
  query GetRetoolEmbedUrl($app: String!) {
    retoolEmbedUrl(app: $app)
  }
`;

const RetoolTax = () => {
  const styles = useStyles({ isAuthenticated: true });
  // const { search } = useLocation();
  const { userProfile } = useAuth();
  const { taxDashboard } = useFlags();
  const { data } = useQuery(RETOOL_EMBED_URL, {
    fetchPolicy: 'network-only',
    variables: { app: 'taxExternal' },
  });
  // const currentOrganization = search ? search.split('=')?.[1] : null;
  const isUserOrgAdmin = userProfile?.organizations_admin?.length;

  if (!data || !isUserOrgAdmin || !taxDashboard) return null;
  return (
    <div className={styles.retoolPageUpdating}>
      {/* <Retool
        url={data.retoolEmbedUrl}
        data={{ userEmail: userProfile.email, organizationId: currentOrganization }}
      /> */}
      <div
        style={{
          backgroundColor: 'white',
          padding: '60px',
          boxShadow: '1px 5px 10px #ccc',
          borderRadius: '8px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Icon iconName="update" iconColor="#186EFF" style={{ fontSize: '50px' }} />
        </div>
        <div style={{ marginTop: '40px' }}>
          <Typography
            component="div"
            content="The Tax Dashboard is being upgraded!"
            fontWeight={400}
            variant="paragraph2"
            align="center"
            fontColor="#6b7686"
          />
        </div>
        <div style={{ marginTop: '20px' }}>
          <Typography
            component="div"
            content="Check back on April 12th to see it in action."
            fontWeight={400}
            variant="paragraph2"
            align="center"
            fontColor="#6b7686"
          />
        </div>
      </div>
    </div>
  );
};

export default RetoolTax;
