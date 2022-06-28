import { useMutation, gql } from '@apollo/client';
import React, { Suspense } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import { useCurrentOrganization } from '../../state/current-organization';
import FormError from '../forms/Error';
import Loader from '../utils/Loader';

const CREATE_DEAL = gql`
  mutation CreateDeal($org: String!, $deal: DealInput!) {
    createDeal(org: $org, deal: $deal) {
      _id
    }
  }
`;

const RemoteBuild = React.lazy(() => import('build/Build'));

export default function Build() {
  const { userProfile } = useAuth();
  const history = useHistory();
  const organization = useCurrentOrganization();
  const [createDeal, { error }] = useMutation(CREATE_DEAL, {
    onCompleted: ({ createDeal }) => {
      if (organization?.slug) {
        history.push(`/admin/${organization.slug}/deals/${createDeal._id}`);
      } else if (userProfile?.organizations_admin?.[0]?.slug) {
        history.push(`/admin/${userProfile.organizations_admin[0].slug}/deals/${createDeal._id}`);
      } else {
        history.push(`/new-build/deal?id=${createDeal._id}`);
      }
    },
  });

  const handleCreate = (deal) => {
    const orgSlug = deal?.organization_slug || deal?.legacyOrg?.slug || organization?.slug;
    return createDeal({
      variables: {
        org: orgSlug || 'lost-spvs',
        deal: {
          _id: deal._id,
          status: deal.phase,
          company_name: deal.name,
          deal_lead: deal.manager.name,
          company_description: deal.description,
          date_closed: '',
          pledge_link: '',
          onboarding_link: '',
          dealParams: {
            dealType: deal.offering_type,
            dealMultiple: '1',
            totalCarry: `${deal.carry_fee * 100}%`,
            managementFees: `${deal.management_fee * 100}`,
            managementFeeType: deal.management_fee_frequency,
            minimumInvestment: deal.minimum_investment.toString(),
            signDeadline: deal.sign_deadline,
            wireDeadline: deal.wire_deadline,
            estimatedSetupCosts: deal.setup_cost.toString(),
            estimatedTerm: deal.deal_term,
            is3c7: deal.ica_exemption === '3(c)(7)',
          },
        },
      },
    });
  };

  return (
    <>
      <Suspense fallback={<Loader />}>
        <RemoteBuild
          user={userProfile}
          onCreate={(deal) => {
            handleCreate(deal);
          }}
        />
      </Suspense>
      <FormError error={error} />
    </>
  );
}
