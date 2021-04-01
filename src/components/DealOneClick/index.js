import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { gql } from 'apollo-boost';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import moment from 'moment';
import { useAuth } from '../../auth/useAuth';
import LandingPage from './LandingPage/LandingPage';
import InvestmentPage from './InvestmentPage/InvestmentPage';
import './style.scss';
import Loader from '../utils/Loader';
import Deal from '../Deal';

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
        slug
        memo
        documents {
          path
          link
        }
        investment {
          _id
          amount
          status
          documents {
            path
            link
          }
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

  const [createInvestment, { called: didCreateInvestment }] = useMutation(CREATE_INVESTMENT, {
    onCompleted: () => {
      refetch();
    },
  });
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

  useEffect(() => {
    const blocked = userProfile?.email?.includes('allocations');
    if (data && !data.investor?.invitedDeal?.investment && !blocked) {
      const investment = {
        deal_id: data.investor.invitedDeal?._id,
        user_id: data.investor._id,
        amount: 0,
      };
      if (userProfile?.email && !didCreateInvestment) {
        createInvestment({ variables: { investment } });
      }
    }
  }, [called, createInvestment, data, didCreateInvestment, organization, search, userProfile]);

  if (!data) return <Loader />;

  const {
    investor,
    investor: { invitedDeal },
  } = data;
  const { investment } = invitedDeal;
  const idTimestamp = invitedDeal._id.toString().substring(0, 8);
  const dealTimestamp = moment.unix(new Date(parseInt(idTimestamp, 16) * 1000));
  const rolloverTimestamp = moment.unix(new Date('2021-04-02'));

  const exemptDealSlugs = ['allocations-60-m-round-spv', 'allocations-spv-100m', 'space-x'];

  if (data && moment(dealTimestamp).isBefore(rolloverTimestamp) && !exemptDealSlugs.includes(deal_slug)) {
    return <Deal />;
  }

  return (
    <div className="DealOneClick">
      {investmentPage ? (
        <InvestmentPage
          deal={invitedDeal}
          investor={investor}
          toggleInvestmentPage={toggleInvestmentPage}
          refetch={refetch}
          investment={investment}
          organzation={organization}
        />
      ) : (
        <LandingPage deal={invitedDeal} toggleInvestmentPage={toggleInvestmentPage} />
      )}
    </div>
  );
}

export default DealOneClick;
