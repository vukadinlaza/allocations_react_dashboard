import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './styles.scss';
import Confetti from 'react-confetti';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useHistory, useParams } from 'react-router';
import completeKycYes from '../../assets/complete-kyc-yes.svg';
import completeKycNo from '../../assets/complete-kyc-no.svg';
import signInvestmentYes from '../../assets/sign-investment-yes.svg';
import wireFundsYes from '../../assets/wire-funds-yes.svg';
import wireFundsNo from '../../assets/wire-funds-no.svg';
import submitTaxInfoYes from '../../assets/submit-tax-info-yes.svg';
import submitTaxInfoNo from '../../assets/submit-tax-info-no.svg';
import AllocationsRocket from './AllocationsRocket/AllocationsRocket';
import KYCModal from './KYCModal.js';
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
    }
  }
`;

const GET_DEAL = gql`
  query Deal($deal_slug: String!, $fund_slug: String!) {
    deal(deal_slug: $deal_slug, fund_slug: $fund_slug) {
      _id
      documents {
        path
        link
      }
    }
  }
`;

function DealNextSteps() {
  const [confetti, showConfetti] = useState(false);
  const { data, loading, refetch } = useQuery(GET_INVESTOR);
  const [getDeal, { data: dealData, error: dealError, refetch: refetchDeal, called: calledDeal }] = useLazyQuery(
    GET_DEAL,
  );
  const [open, setOpen] = useState(false);
  const { deal_slug, organization } = useParams();
  const [wireInstructionsOpen, setWireInstructionsOpen] = useState(false);
  const { isAuthenticated, loading: authLoading } = useAuth();

  const history = useHistory();

  useEffect(() => {
    if (!authLoading && !calledDeal && isAuthenticated) {
      getDeal({
        variables: {
          deal_slug,
          fund_slug: organization || 'allocations',
        },
        fetchPolicy: 'network-only',
      });
    }
  }, [isAuthenticated, authLoading, calledDeal, getDeal, deal_slug, organization]);

  const path = organization ? `/deals/${organization}/${deal_slug}` : `/deals/${deal_slug}`;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 100,
      behavior: 'smooth',
    });

    setTimeout(() => {
      showConfetti(true);
    }, 1000);
    setTimeout(() => {
      showConfetti(false);
    }, 5000);
  }, []);
  if (loading || !data) return null;

  const investorFormData = history?.location?.state?.investorFormData || {};

  const templateInfo =
    investorFormData?.country === 'United States'
      ? investorFormData?.investor_type === 'individual'
        ? { templateName: 'W-9', templateId: 'tpl_dM4QcQbyLckdPXgtyx' }
        : { templateName: 'W-9-E', templateId: 'tpl_HSJjJ9c9jb2N4GXFkt' }
      : investorFormData?.investor_type === 'individual'
      ? { templateName: 'W-8-BEN', templateId: 'tpl_qDaxDLgRkFpHJD2cFX' }
      : { templateName: 'W-8-BEN-E', templateId: 'tpl_mXPLm5EXAyHJKhQekf' };

  const userDocs = data?.investor?.documents || [];
  const hasKyc = userDocs.find((doc) => {
    return doc?.documentName.includes('W-9') || doc?.documentName.includes('W-8');
  });

  const docs = dealData?.deal?.documents;

  return (
    <section className="DealNextSteps">
      <Button className="back-button" onClick={() => history.push(path, { isInvestPage: true })}>
        <ArrowBackIcon />
        Back to Invest Page
      </Button>

      <h1 className="header">Next Steps</h1>
      <h3 className="sub-header">Please complete the following steps to finish your investment.</h3>

      <div className="action-items">
        <div className="action-item">
          <img className="action-icon" src={signInvestmentYes} />
          <div className="action-instructions">
            <p className="action-header">Sign for Investment</p>
          </div>
          <Button className="completed-step-button" disabled>
            Completed
          </Button>
        </div>

        <div className="action-item">
          <img className="action-icon" src={hasKyc ? submitTaxInfoYes : submitTaxInfoNo} />
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

        <div className={`action-item ${!hasKyc && 'disabled'}`}>
          <img className="action-icon" src={wireFundsNo} />
          <div className="action-instructions">
            <p className="action-header">Wire Funds</p>
            <p className="action-sub-header">Required to complete your investment</p>
          </div>
          <Button disabled={!hasKyc} onClick={() => setWireInstructionsOpen(true)} className="next-step-button">
            View Wire Instructions
          </Button>
        </div>
      </div>

      <KYCModal
        open={open}
        setOpen={setOpen}
        kycTemplateId={templateInfo.templateId}
        kycTemplateName={templateInfo.templateName}
        investor={data?.investor}
        refetch={refetch}
      />
      <WireInstructionsModal open={wireInstructionsOpen} setOpen={setWireInstructionsOpen} docs={docs} />
      <AllocationsRocket />
      <Confetti className={`confetti ${!confetti && 'hidden'}`} />
    </section>
  );
}

export default DealNextSteps;
