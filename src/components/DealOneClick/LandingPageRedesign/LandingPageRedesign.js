import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams, useHistory, useLocation, Redirect } from 'react-router-dom';
import moment from 'moment';
// import InvestPanel from './InvestPanel';
import Deal from '../../Deal';
import DealHeaderRedesign from './DealHeader';
import InvestingDetails from './InvestingDetails';
import DealSummary from './DealSummary';
import CoinvestorsPanel from './CoinvestorsPanel';
// import './styles.scss';

import Loader from '../../utils/Loader';

export const GET_DEAL = gql`
  query PublicDeal($deal_slug: String!, $fund_slug: String!) {
    publicDeal(deal_slug: $deal_slug, fund_slug: $fund_slug) {
      _id
      approved
      accept_crypto
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
        customCurrency
      }
    }
  }
`;

const exemptDealSlugs = [
  'allocations-60-m-round-spv',
  'allocations-spv-100m',
  'mondrian-hotel-spv',
  'cronos-capital-i',
  'allocations-200-m',
  'navier',
  'simplebet',
  '305-ventures',
  'type-one-fund-I',
];

function DealLandingPageRedesign() {
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
      const rolloverTimestamp = moment.unix(new Date('2021-05-05 17:00'));
      if (
        moment(dealTimestamp).isBefore(rolloverTimestamp) &&
        !exemptDealSlugs.includes(deal_slug) &&
        pathname.includes('/public/')
      ) {
        history.push(`/deals/${organization || 'allocations'}/${deal_slug}`);
      }
    }
  });

  if (error) return <Redirect to="/404" />;

  if (!data) return <Loader />;

  const { publicDeal: deal } = data;
  if (data && deal?.docSpringTemplateId === null) {
    return <Deal />;
  }

  return (
    <section className="LandingPage">
      <div className="flex-container">
        <DealHeaderRedesign deal={deal} />
        <InvestingDetails deal={deal} />
        <DealSummary deal={deal} />
        <CoinvestorsPanel deal={deal} />
      </div>
    </section>
  );
}

export default DealLandingPageRedesign;
