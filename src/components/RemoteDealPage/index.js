import { useQuery, gql } from '@apollo/client';
import { useFlags } from 'launchdarkly-react-client-sdk';
import React, { Suspense } from 'react';
import { Redirect, useHistory, useLocation, useParams } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import { shouldShowDealBasedFlag } from '../../utils/helpers';
import Loader from '../utils/Loader';

const DealPage = React.lazy(() => import('build/DealPage'));

export const GET_DEAL = gql`
  query Deal($_id: String, $deal_slug: String, $fund_slug: String!) {
    deal(_id: $_id, deal_slug: $deal_slug, fund_slug: $fund_slug) {
      _id
      slug
      status
      subscription_agreement {
        investor_docspring_template_id
        investor_template_approved
      }
      AUM
    }
  }
`;

export default function RemoteDealPage() {
  const { newInvestFlow } = useFlags();
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
  const showNewInvestFlow = shouldShowDealBasedFlag(newInvestFlow, deal_id || deal?._id);

  return (
    <Suspense fallback={<Loader />}>
      <DealPage
        orgSlug={organization}
        dealId={deal._id}
        dealSlug={dealSlug}
        pathname={pathname}
        pushToDealPage={() => history.push(`/admin/${organization}/deals/${deal._id}`)}
        goToInvestPage={() => {
          history.push(`/invest/${deal_id || deal._id}`);
        }}
        redirectTo404={() => <Redirect to="/404" />}
        user={userProfile}
        disableInvest={
          showNewInvestFlow
            ? !(
                deal.subscription_agreement?.investor_docspring_template_id &&
                deal.subscription_agreement.investor_template_approved
              )
            : false // TODO: This will show the button for all new deals that dont use the new invest flow, but wont disable the button for new deals with new invest flow. Need to add condition to differentiate between old and new deals
        }
        AUM={deal.AUM}
      />
    </Suspense>
  );
}
