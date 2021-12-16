import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams, useHistory, useLocation, Redirect } from 'react-router-dom';
import moment from 'moment';
import Deal from '../../Deal';
import DealHeaderRedesign from './DealHeader';
import InvestingDetails from './InvestingDetails';
import DealSummary from './DealSummary';
import CoinvestorsPanel from './CoinvestorsPanel';
import DealDetails from './DealDetails';
import Loader from '../../utils/Loader';
import Disclaimer from './Disclaimer';
import useStyles from './DealStyles';

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
      target_raise_goal
      accept_crypto
      portfolio_company_securities
      sectors
      dealDetails {
        title
        content
      }
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
        minimumInvestment
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

function DealLandingPageRedesign({ orgSlug, dealSlug }) {
  const { deal_slug, organization } = useParams();
  const history = useHistory();
  const { pathname } = useLocation();
  const { data, error } = useQuery(GET_DEAL, {
    variables: {
      deal_slug: deal_slug || dealSlug,
      fund_slug: organization || orgSlug || 'allocations',
    },
  });

  const classes = useStyles();

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
    <section className={classes.LandingPage}>
      <div className={classes.flexContainer}>
        <DealHeaderRedesign deal={deal} />
        <InvestingDetails deal={deal} />
        <DealSummary deal={deal} />
        <CoinvestorsPanel deal={deal} />
        <DealDetails deal={deal} />
        <Disclaimer
          title="Disclaimer"
          content="Allocations, Inc., (“Allocations”), does not provide investment, tax, or legal advice, and no information provided should be construed as such. Therefore, information on this page should not be relied upon as research, investment advice or a recommendation of any kind. You are encouraged to consult with your investment advisers and other counsel prior to investing. Some of the information provided by Allocations herein, has been obtained from third-party sources and believed to be accurate as of the date of publication; however, no warranties or other guarantees are given as to the accuracy or completeness of the information. Past performance is not indicative of future returns. Examples of past investments by syndicates are purely for illustrative purposes.Some institutional and professional investors may have additional material information about this deal. These investors may also have access to a broader set of deals than is available to other backers on the Allocations platform, may be able to view deals before other backers, and have certain other preferential deal access and allocation rights. The existence of these additional rights and privileges may be material to your investment decision."
        />
        <Disclaimer
          title="Cryptocurrency Disclaimer"
          content="The Fund Administrator, Allocations, Inc., is not a Money Service Business and therefore, cannot directly process deposits made in the form of Cryptocurrency. Deposits made in Cryptocurrency shall be processed by a third party, Circle Internet Financial Limited (“Circle”) a private limited liability company located in, and organized under the laws of the United States. Circle is a separate legal entity and not affiliated with Allocations, Inc., through common ownership. Virtual currency is not legal tender, and is not backed by the government. Your Crypto Assets are not insured or guaranteed by the FDIC, Securities Investor Protection Corporation (SIPC) or any other public or private insurer, including against cyber theft or theft by other means. The transfer, purchase and sale of cryptocurrency is irrevocable. The nature of cryptocurrency may lead to an increased risk of fraud or cyber-attack and your cryptocurrency value may be irretrievably stolen. Legislative and regulatory changes or actions at the state, federal, or international level may adversely affect the use, transfer, exchange and value of virtual currency. Some virtual currency transactions shall be deemed to be made when recorded on the public ledger, which is not necessarily the date or time the customer initiates the transaction. We reserve the right to not process, to cancel or, to the extent possible, to reverse a transaction, if (i) we believe that the transaction relates to any Restricted Activities, (ii) we believe the transaction involves money laundering, terrorist financing, fraud or any other type of crime or (iii) in response to a subpoena, court order, or other government order. In such instances, regardless of the reason we have blocked, cancelled or reversed your transaction and regardless of the reason we have lifted or reversed that restriction, we do not guarantee you will be able to reinitiate your transaction at the same price or on the same terms as the transaction that we did not process, or that was cancelled or reversed. Legislative and regulatory changes or actions at the state, federal, or international level may adversely affect the use, transfer, exchange and value of virtual currency."
        />
      </div>
    </section>
  );
}

export default DealLandingPageRedesign;
