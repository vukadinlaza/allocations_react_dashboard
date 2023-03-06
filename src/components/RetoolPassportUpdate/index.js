import React from 'react';
import Retool from 'react-retool';
import { gql, useQuery } from '@apollo/client';
import { useLocation } from 'react-router';
import { Icon, Typography } from '@allocations/design-system';
import { useAuth } from '../../auth/useAuth';

const RETOOL_EMBED_URL = gql`
  query GetRetoolEmbedUrl($app: String!) {
    retoolEmbedUrl(app: $app)
  }
`;

const RetoolPassportUpdate = () => {
  const { search } = useLocation();
  const { userProfile } = useAuth();
  const { data } = useQuery(RETOOL_EMBED_URL, {
    fetchPolicy: 'network-only',
    variables: { app: 'taxUpdate' },
  });
  const currentOrganization = search ? search.split('=')?.[1] : null;
  const isUserTheOrgAdmin = userProfile?.organizations_admin
    ?.map((o) => o._id)
    .includes(currentOrganization);

  if (!data || (currentOrganization && !isUserTheOrgAdmin)) return null;
  return (
    <div style={{ width: '100%', height: '84vh', padding: '0px 32px' }}>
      <div style={{ padding: '20px 0px', marginTop: '20px' }}>
        <Typography content="Your Tax Information" fontWeight={700} variant="heading4" />
        <div style={{ marginTop: '12px', display: 'flex' }}>
          <span style={{ marginRight: '12px' }}>
            <Icon iconColor="#186EFF" iconName="information" />
          </span>
          <Typography
            content="There is some missing data in your tax information. Please update this data for each one of the items listed below. Once you have done that, please refresh the page to be able to use the Allocations platform normally."
            variant="paragraph2"
          />
        </div>
      </div>
      <Retool
        url={data.retoolEmbedUrl}
        data={{ user: { email: userProfile.email }, organizationId: currentOrganization }}
      />
    </div>
  );
};

export default RetoolPassportUpdate;
