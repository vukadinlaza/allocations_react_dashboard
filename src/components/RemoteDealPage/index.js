import { useFlags } from 'launchdarkly-react-client-sdk';
import { useQuery, gql } from '@apollo/client';
import React, { Suspense } from 'react';
import { Redirect, useHistory, useLocation, useParams } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';

const DealPage = React.lazy(() => import('build/DealPage'));

export const GET_DEAL = gql`
  query Deal($deal_slug: String!, $fund_slug: String!) {
    deal(deal_slug: $deal_slug, fund_slug: $fund_slug) {
      _id
    }
  }
`;

export default function RemoteDealPage() {
  const { remoteInvestPage } = useFlags();
  const history = useHistory();
  const { pathname } = useLocation();
  const { organization, deal_slug } = useParams();
  const { userProfile } = useAuth();
  const { data } = useQuery(GET_DEAL, {
    variables: {
      deal_slug,
      fund_slug: organization || 'allocations',
    },
  });

  if (!data) return null;
  const { deal } = data;

  return (
    <Suspense fallback={<Loader />}>
      <DealPage
        orgSlug={organization}
        dealId={deal._id}
        dealSlug={deal_slug}
        pathname={pathname}
        pushToDealPage={() => history.push(`/admin/${organization}/${deal._id}`)}
        goToInvestPage={() => {
          if (remoteInvestPage) {
            history.push(`/invest/${deal._id}`);
          } else {
            history.push(`/invest${organization ? `/${organization}` : ''}/${deal_slug}`);
          }
        }}
        redirectTo404={() => <Redirect to="/404" />}
        user={userProfile}
      />
    </Suspense>
  );
}
