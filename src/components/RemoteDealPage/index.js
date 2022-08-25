import { useFlags } from 'launchdarkly-react-client-sdk';
import { useQuery, gql } from '@apollo/client';
import React, { Suspense } from 'react';
import { Redirect, useHistory, useLocation, useParams } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';

const DealPage = React.lazy(() => import('build/DealPage'));

export const GET_DEAL = gql`
  query Deal($_id: String, $deal_slug: String, $fund_slug: String!) {
    deal(_id: $_id, deal_slug: $deal_slug, fund_slug: $fund_slug) {
      _id
      slug
      subscription_agreement {
        investor_docspring_template_id
      }
    }
  }
`;

export default function RemoteDealPage() {
  const { remoteInvestPage } = useFlags();
  const history = useHistory();
  const { pathname } = useLocation();
  const { organization, deal_slug, deal_id } = useParams();
  const { userProfile } = useAuth();
  const { data } = useQuery(GET_DEAL, {
    variables: {
      _id: deal_id,
      deal_slug,
      fund_slug: organization || 'allocations',
    },
  });

  if (!data) return null;
  const { deal } = data;
  const dealSlug = deal_slug || deal.slug;

  return (
    <Suspense fallback={<Loader />}>
      <DealPage
        orgSlug={organization}
        dealId={deal._id}
        dealSlug={dealSlug}
        pathname={pathname}
        pushToDealPage={() => history.push(`/admin/${organization}/deals/${deal._id}`)}
        goToInvestPage={() => {
          if (remoteInvestPage) {
            history.push(`/invest/${deal_id || deal._id}`);
          } else {
            history.push(`/invest${organization ? `/${organization}` : ''}/${dealSlug}`);
          }
        }}
        redirectTo404={() => <Redirect to="/404" />}
        user={userProfile}
        disableInvest={
          remoteInvestPage ? !deal.subscription_agreement?.investor_docspring_template_id : false
        }
      />
    </Suspense>
  );
}
