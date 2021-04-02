import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './styles.scss';
import Confetti from 'react-confetti';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import completeKycYes from '../../assets/complete-kyc-yes.svg';
import completeKycNo from '../../assets/complete-kyc-no.svg';
import signInvestmentYes from '../../assets/sign-investment-yes.svg';
import wireFundsYes from '../../assets/wire-funds-yes.svg';
import wireFundsNo from '../../assets/wire-funds-no.svg';
import submitTaxInfoYes from '../../assets/submit-tax-info-yes.svg';
import submitTaxInfoNo from '../../assets/submit-tax-info-no.svg';
import AllocationsRocket from './AllocationsRocket/AllocationsRocket';
import KYCModal from './KYCModal.js';
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
function DealNextSteps() {
  const [confetti, showConfetti] = useState(false);
  const { data, loading, refetch } = useQuery(GET_INVESTOR);

  const { location } = useHistory();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      showConfetti(true);
    }, 1000);
    setTimeout(() => {
      showConfetti(false);
    }, 5000);
  }, []);
  if (loading || !data) return null;
  console.log('DATA', data.investor);

  const investorFormData = location?.state?.investorFormData;

  const kycTemplateId =
    investorFormData.country === 'United States'
      ? 'tpl_dM4QcQbyLckdPXgtyx'
      : investorFormData.investor_type === 'individual'
      ? 'tpl_qDaxDLgRkFpHJD2cFX'
      : 'tpl_mXPLm5EXAyHJKhQekf';
  const kycTemplateName =
    investorFormData.country === 'United States'
      ? 'W-9'
      : investorFormData.investor_type === 'individual'
      ? 'W-8BEN'
      : 'W-8BENE';

  const userDocs = data?.investor?.documents || [];
  const hasKyc = userDocs.find((doc) => {
    return doc.documentName.includes('W-9') || doc.documentName.includes('W-9');
  });

  return (
    <section className="DealNextSteps">
      <Button className="back-button">
        <ArrowBackIcon />
        Back to Invest Page
      </Button>
      <h1 className="header">Next Steps</h1>
      <h3 className="sub-header">Please complete the following steps to finish your investment.</h3>

      <div className="action-item">
        <img className="action-icon" src={signInvestmentYes} />
        <div className="action-instructions">
          <p className="action-header">Sign for Investment</p>
        </div>
        <Button class="completed-step-button" disabled>
          Completed
        </Button>
      </div>

      <KYCModal
        open={open}
        setOpen={setOpen}
        kycTemplateId={kycTemplateId}
        kycTemplateName={kycTemplateName}
        investor={data?.investor}
        refetch={refetch}
      />

      <div className="action-item">
        <img className="action-icon" src={hasKyc ? submitTaxInfoYes : submitTaxInfoNo} />
        <div className="action-instructions">
          <p className="action-header">Submit Tax Information</p>
          <p className="action-sub-header">Complete your W8/W9 forms here</p>
        </div>
        <Button
          class={hasKyc ? 'completed-step-button' : 'next-step-button'}
          onClick={() => setOpen(true)}
          disabled={hasKyc}
        >
          {hasKyc ? 'Completed' : 'Submit Tax Info'}
        </Button>
      </div>

      {hasKyc && (
        <div className="action-item">
          <img className="action-icon" src={wireFundsNo} />
          <div className="action-instructions">
            <p className="action-header">View Wire Instructions</p>
            <p className="action-sub-header">Required to complete your investment</p>
          </div>
          <Button class="next-step-button">View Wire Instructions</Button>
        </div>
      )}
      <AllocationsRocket />
      <Confetti className={`confetti ${!confetti && 'hidden'}`} />
    </section>
  );
}

export default DealNextSteps;
