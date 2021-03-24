import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { gql } from 'apollo-boost';
import { useLazyQuery } from '@apollo/react-hooks';
import { useAuth } from '../../auth/useAuth';
import LandingPage from './LandingPage/LandingPage';
import InvestmentPage from './InvestmentPage/InvestmentPage';
import './style.scss';
import Loader from '../utils/Loader';

export const GET_INVESTOR_DEAL = gql`
  query Deal($deal_slug: String!, $fund_slug: String!) {
    investor {
      _id
      name
      first_name
      last_name
      entity_name
      country
      investor_type
      signer_full_name
      accredited_investor_status
      email
      documents
      invitedDeal(deal_slug: $deal_slug, fund_slug: $fund_slug) {
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
        memo
        documents {
          path
          link
        }
        investment {
          _id
          amount
          status
        }
        dealParams {
          dealType
          coinvestors
          risks
          keyHighlights
          termsAndConditions
          valuation
          runRate
          minimumInvestment
          maximumInvestment
          totalRoundSize
          allocation
          totalCarry
          minimumInvestment
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
  }
`;

export const CREATE_INVESTMENT = gql`
  mutation CreateInvestment($investment: InvestmentInput!) {
    createInvestment(investment: $investment) {
      _id
    }
  }
`;

function DealOneClick() {
  const [investmentPage, toggleInvestmentPage] = useState(false);
  const { organization, deal_slug } = useParams();
  const history = useHistory();
  const { search } = useLocation();
  const { userProfile, isAuthenticated, loading } = useAuth();
  const [getDeal, { data, error, refetch, called }] = useLazyQuery(GET_INVESTOR_DEAL);

  useEffect(() => {
    if (!loading && !called && isAuthenticated) {
      getDeal({
        variables: {
          deal_slug,
          fund_slug: organization || 'allocations',
        },
      });
    }
  }, [isAuthenticated, loading, called, getDeal, deal_slug, organization]);

  if (!data) return <Loader />;

  const {
    investor,
    investor: { invitedDeal: deal },
  } = data;

  const { investment } = deal;

  console.log('investment', investment);
  console.log('deal', deal);

  return (
    <div className="DealOneClick">
      {investmentPage ? (
        <InvestmentPage deal={deal} investor={investor} toggleInvestmentPage={toggleInvestmentPage} />
      ) : (
        <LandingPage deal={deal} toggleInvestmentPage={toggleInvestmentPage} />
      )}
    </div>
  );
}

export default DealOneClick;