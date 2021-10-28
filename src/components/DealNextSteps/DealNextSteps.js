import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { Button } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import './styles.scss';
import Confetti from 'react-confetti';
import { useQuery, useLazyQuery, gql } from '@apollo/client';
import { useHistory, useParams, useLocation } from 'react-router';
import { Helmet } from 'react-helmet';
import signInvestmentYes from '../../assets/sign-investment-yes.svg';
import wireFundsNo from '../../assets/wire-funds-no.svg';
import submitTaxInfoYes from '../../assets/submit-tax-info-yes.svg';
import submitTaxInfoNo from '../../assets/submit-tax-info-no.svg';
import AllocationsRocket from './AllocationsRocket/AllocationsRocket';
import KYCModal from './KYCModal/index.js';
import WireInstructionsModal from './WireInstructionsModal/WireInstructionsModal';
import { useAuth } from '../../auth/useAuth';

const GET_INVESTOR = gql`
  query GetInvestor($email: String, $_id: String) {
    investor(email: $email, _id: $_id) {
      _id
      first_name
      last_name
      entity_name
      country
      investor_type
      signer_full_name
      accredited_investor_status
      email
      documents
      accredidation_status
      investments {
        _id
        deal {
          _id
          slug
        }
        amount
        value
        submissionData {
          country
          state
          investor_type
          legalName
          accredited_investor_status
          fullName
          title
          investmentId
          submissionId
        }
      }
    }
  }
`;

const GET_DEAL = gql`
  query Deal($deal_slug: String!, $fund_slug: String!) {
    deal(deal_slug: $deal_slug, fund_slug: $fund_slug) {
      _id
      isDemo
      dealParams {
        dealType
      }
      company_name
      documents {
        path
        link
      }
    }
  }
`;

const GET_INVESTMENT = gql`
  query GetInvestment($_id: String!) {
    investment(_id: $_id) {
      _id
      amount
      submissionData {
        investor_type
        country
      }
    }
  }
`;

function DealNextSteps() {
  const [confetti, showConfetti] = useState(false);
  const { data, loading, refetch } = useQuery(GET_INVESTOR, { fetchPolicy: 'network-only' });
  const [getDeal, { data: dealData, called: calledDeal }] = useLazyQuery(GET_DEAL);
  const [showTaxAsCompleted, setShowTaxAsCompleted] = useState(false);
  const [open, setOpen] = useState(false);
  const { deal_slug, organization } = useParams();
  const [wireInstructionsOpen, setWireInstructionsOpen] = useState(false);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { search, state } = useLocation();
  const params = queryString.parse(search);
  const history = useHistory();

  const path = organization ? `/deals/${organization}/${deal_slug}` : `/deals/${deal_slug}`;

  const { data: investmentData } = useQuery(GET_INVESTMENT, {
    variables: { _id: params?.investmentId },
    onError: () => {
      if (!state?.investorFormData) return history.push(path);
    },
  });

  useEffect(() => {
    if (!authLoading && !calledDeal && isAuthenticated && deal_slug) {
      getDeal({
        variables: {
          deal_slug,
          fund_slug: organization || 'allocations',
        },
        fetchPolicy: 'network-only',
      });
    }
  }, [isAuthenticated, authLoading, calledDeal, getDeal, deal_slug, organization]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 100,
      behavior: 'smooth',
    });

    const confettiOn = setTimeout(() => {
      showConfetti(true);
    }, 1000);
    const confettiOff = setTimeout(() => {
      showConfetti(false);
    }, 5000);

    return () => {
      clearTimeout(confettiOn);
      clearTimeout(confettiOff);
    };
  }, []);

  if (loading || !data || !dealData) return null;

  const handleInvestmentEdit = () => {
    const userInvestments = data?.investor?.investments;
    const currentInvestment = userInvestments.find((inv) => inv.deal.slug === deal_slug);
    const { amount } = currentInvestment;
    const submission = currentInvestment.submissionData;

    history.push({
      pathname: `/invest/${organization}/${deal_slug}`,
      state: { submission, amount, investmentId: currentInvestment._id },
    });
  };

  const investorFormData =
    history?.location?.state?.investorFormData || investmentData?.investment?.submissionData || {};

  const templateInfo =
    investorFormData?.country === 'United States'
      ? investorFormData?.investor_type === 'individual'
        ? { templateName: 'W-9', templateId: 'tpl_dM4QcQbyLckdPXgtyx' }
        : { templateName: 'W-9-E', templateId: 'tpl_HSJjJ9c9jb2N4GXFkt' }
      : investorFormData?.investor_type === 'individual'
      ? { templateName: 'W-8-BEN', templateId: 'tpl_qDaxDLgRkFpHJD2cFX' }
      : { templateName: 'W-8-BEN-E', templateId: 'tpl_mXPLm5EXAyHJKhQekf' };

  const userDocs = data?.investor?.documents || [];
  const hasKyc =
    userDocs.find((doc) => {
      return doc?.documentName.includes('W-9') || doc?.documentName.includes('W-8');
    }) || showTaxAsCompleted;

  const docs = dealData?.deal?.documents;

  return (
    <>
      <Helmet>
        <script async src={process.env.REACT_APP_VERIFY_INVESTOR_URL} />
      </Helmet>
      <section className="DealNextSteps">
        <div className="title-container">
          <div className="header-container">
            <h1 className="header">Next Steps</h1>
            <h3 className="sub-header">
              Please complete the following steps to finish your investment.
            </h3>
          </div>
          <a href={path} className="new-investment-button">
            <p className="action-header">
              <AddCircleIcon style={{ color: '#3AC522', marginRight: '6px' }} /> Add New Investment
            </p>
          </a>
        </div>

        <div className="action-items">
          <div className="action-item">
            <img className="action-icon" src={signInvestmentYes} alt="sign-investment-yes" />
            <div className="action-instructions">
              <p className="action-header">Edit Investment</p>
              <p className="action-sub-header">
                Basic Information including amount and personal information
              </p>
            </div>
            <Button className="completed-step-button" onClick={handleInvestmentEdit}>
              Edit Investment
            </Button>
          </div>
          <div className="action-item">
            <img className="action-icon" src={signInvestmentYes} alt="sign-investment-yes" />
            <div className="action-instructions">
              <p className="action-header">Sign for Investment</p>
            </div>
            <Button className="completed-step-button" disabled>
              Completed
            </Button>
          </div>

          <div className="action-item">
            <img
              className="action-icon"
              src={hasKyc ? submitTaxInfoYes : submitTaxInfoNo}
              alt="tax-info"
            />
            <div className="action-instructions">
              <p className="action-header">Submit Tax Information</p>
              <p className="action-sub-header">Complete your W8/W9 forms here</p>
            </div>
            <Button
              className={hasKyc ? 'completed-step-button' : 'next-step-button'}
              onClick={() => setOpen(true)}
              disabled={!!hasKyc}
            >
              {hasKyc ? 'Completed' : 'Submit Tax Info'}
            </Button>
          </div>
          {/* //here */}
          {dealData?.deal?.dealParams?.dealType === '506c' && (
            <div className="action-item">
              <img
                className="action-icon"
                src={
                  data?.investor.accredidation_status === true ? submitTaxInfoYes : submitTaxInfoNo
                }
                alt="submit-tax-img"
              />
              <div className="action-instructions">
                <p className="action-header">Accredited Investor Status</p>
                <p className="action-sub-header">
                  {data?.investor.accredidation_status === true
                    ? ''
                    : 'Complete your accredited investor questionnaire here (<5 mins to complete)'}
                </p>
              </div>
              {data?.investor.accredidation_status === true ? (
                ''
              ) : (
                <Button
                  className={
                    data?.investor.accredidation_status === true
                      ? 'completed-step-button'
                      : 'next-step-button'
                  }
                  onClick={() => {
                    const win = window.open(
                      'https://bridge.parallelmarkets.com/allocations',
                      '_blank',
                    );
                    win.focus();
                  }}
                >
                  {data?.investor.accredidation_status === true ? 'Completed' : 'Submit'}
                </Button>
              )}
            </div>
          )}

          <div className={`action-item ${!hasKyc && 'disabled'}`}>
            <img className="action-icon" src={wireFundsNo} alt="wire-funds-no" />
            <div className="action-instructions">
              <p className="action-header">Wire Funds</p>
              <p className="action-sub-header">Required to complete your investment</p>
            </div>
            <Button
              disabled={dealData?.deal?.isDemo ? false : !hasKyc}
              onClick={() => setWireInstructionsOpen(true)}
              className="next-step-button"
            >
              View Wire Instructions
            </Button>
          </div>
        </div>

        <KYCModal
          open={open}
          setOpen={setOpen}
          kycTemplateId={templateInfo.templateId}
          kycTemplateName={templateInfo.templateName}
          refetch={refetch}
          deal={dealData.deal || {}}
          setShowTaxAsCompleted={setShowTaxAsCompleted}
        />
        <WireInstructionsModal
          open={wireInstructionsOpen}
          setOpen={setWireInstructionsOpen}
          docs={docs}
        />
        <AllocationsRocket />
        <Confetti className={`confetti ${!confetti && 'hidden'}`} />
      </section>
    </>
  );
}

export default DealNextSteps;
