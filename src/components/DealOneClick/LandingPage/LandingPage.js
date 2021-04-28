import React, { useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import moment from 'moment';
import TermsPanel from './TermsPanel';
import InvestPanel from './InvestPanel';
import Deal from '../../Deal';
import DealHeader from './DealHeader';
import CoinvestorsPanel from './CoinvestorsPanel';
import './styles.scss';
import KeyHighlights from './KeyHighlightsPanel';

import Loader from '../../utils/Loader';

const GET_DEAL = gql`
  query PublicDeal($deal_slug: String!, $fund_slug: String!) {
    publicDeal(deal_slug: $deal_slug, fund_slug: $fund_slug) {
      _id
      approved
      created_at
      company_name
      company_description
      date_closed
      deal_lead
      pledge_link
      onboarding_link
      status
      slug
      memo
      docSpringTemplateId
      dealCoverImageKey
      documents {
        path
        link
      }
      dealParams {
        dealType
        coinvestors
        risks
        termsAndConditions
        valuation
        runRate
        minimumInvestment
        maximumInvestment
        totalRoundSize
        allocation
        totalCarry
        signDeadline
        wireDeadline
        estimatedSetupCosts
        estimatedSetupCostsDollar
        estimatedTerm
        managementFees
        managementFeesDollar
        managementFeeType
        portfolioTotalCarry
        portfolioEstimatedSetupCosts
        portfolioEstimatedSetupCostsDollar
        portfolioManagementFees
        portfolioManagementFeesDollar
        portfolioManagementFeeType
        fundTotalCarry
        fundEstimatedSetupCosts
        fundEstimatedSetupCostsDollar
        fundManagementFees
        fundManagementFeesDollar
        fundManagementFeeType
        fundGeneralPartner
        fundEstimatedTerm
      }
    }
  }
`;

const exemptDealSlugs = [
  'allocations-60-m-round-spv',
  'allocations-spv-100m',
  'space-x',
  'mondrian-hotel-spv',
  'cronos-capital-i',
  'allocations-200-m',
  'navier',
  'simplebet',
  '305-ventures',
  'type-one-fund-I',
];

function DealLandingPage() {
  const { deal_slug, organization } = useParams();
  const history = useHistory();
  const { pathname } = useLocation();
  const { data, error } = useQuery(GET_DEAL, {
    variables: {
      deal_slug,
      fund_slug: organization || 'allocations',
    },
  });
  useEffect(() => {
    if (data?.publicDeal) {
      const { publicDeal: deal } = data;
      const idTimestamp = deal._id.toString().substring(0, 8);
      const dealTimestamp = moment.unix(new Date(parseInt(idTimestamp, 16) * 1000));
      const rolloverTimestamp = moment.unix(new Date('2021-05-10'));
      if (
        moment(dealTimestamp).isBefore(rolloverTimestamp) &&
        !exemptDealSlugs.includes(deal_slug) &&
        pathname.includes('/public/')
      ) {
        history.push(`/deals/${organization || 'allocations'}/${deal_slug}`);
      }
    }
  });

  console.log('ERROR', error);

  if (!data) return <Loader />;
  const { publicDeal: deal } = data;
  const idTimestamp = deal._id.toString().substring(0, 8);
  const dealTimestamp = moment.unix(new Date(parseInt(idTimestamp, 16) * 1000));
  const rolloverTimestamp = moment.unix(new Date('2021-05-10'));
  if (data && moment(dealTimestamp).isBefore(rolloverTimestamp) && !exemptDealSlugs.includes(deal_slug)) {
    return <Deal />;
  }
  return (
    <section className="LandingPage">
      <div className="flex-container">
        <DealHeader deal={deal} />
        <InvestPanel deal={deal} deal_slug={deal_slug} organization={organization} />
      </div>
      <div className="flex-container">
        <CoinvestorsPanel deal={deal} />
        <KeyHighlights deal={deal} />
        <TermsPanel deal={deal} />
      </div>
    </section>
  );
}

export default DealLandingPage;
