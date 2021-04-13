import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import TermsPanel from './TermsPanel';
import InvestPanel from './InvestPanel';
import DealHeader from './DealHeader';
import CoinvestorsPanel from './CoinvestorsPanel';
import KeyHighlights from './KeyHighlightsPanel';

import './styles.scss';
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

function DealLandingPage() {
  const { deal_slug, organization } = useParams();

  const { data } = useQuery(GET_DEAL, {
    variables: {
      deal_slug,
      fund_slug: organization || 'allocations',
    },
  });
  if (!data) return <Loader />;
  const { publicDeal: deal } = data;
  return (
    <section className="LandingPage">
      <div className="flex-container">
        <DealHeader deal={deal} />
        <InvestPanel deal={deal} />
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
