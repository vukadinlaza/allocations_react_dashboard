import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { toast } from 'react-toastify';
import TermsAndConditionsPanel from './TermsAndConditionsPanel';
import DealDocumentsPanel from './DealDocumentsPanel';
import InvestingAsPanel from './InvestingAsPanel';
import InvestmentAmountPanel from './InvestmentAmount';
import PersonalInformation from './PersonalInformation';
import PaymentInformation from './PaymentInformation';
import './styles.scss';

const CONFIRM_INVESTMENT = gql`
  mutation ConfirmInvestment($payload: Object) {
    confirmInvestment(payload: $payload) {
      _id
    }
  }
`;
const validate = (investor) => {
  const required = ['legalName', 'investor_type', 'country', 'fullName'];
  if (investor.country && investor.country === 'United States') {
    required.push('state');
  }
  if (investor.investor_type && investor.investor_type === 'entity') {
    required.push('accredited_investor_status');
  }
  return required.reduce((acc, attr) => (investor[attr] ? acc : [...acc, attr]), []);
};

function InvestmentPage({ deal, investor, toggleInvestmentPage }) {
  const history = useHistory();
  const { company_name } = deal;
  const [checkedTAT, setCheckedTAT] = useState(false);
  const [amount, setAmount] = useState('');
  const [investorFormData, setInvestor] = useState({});
  const [errors, setErrors] = useState([]);

  const [submitConfirmation, { data, error }] = useMutation(CONFIRM_INVESTMENT);

  const submitInvestmentConfirmation = () => {
    const validation = validate(investorFormData);
    setErrors(validation);

    if (validation.length > 0) {
      return toast.warning('Incomplete Form');
    }
    const payload = {
      ...investorFormData,
      investmentId: investor.invitedDeal.investment._id,
      investmentAmount: amount,
    };

    submitConfirmation({ variables: { payload } });
  };

  return (
    <section className="InvestmentPage">
      <Button className="back-button" onClick={() => history.push()}>
        <ArrowBackIcon />
        Back to Deal Page
      </Button>
      <div>
        <h1 className="investment-header">Invest in {company_name}</h1>
      </div>

      <div className="flex-container">
        <main>
          <InvestmentAmountPanel setAmount={setAmount} amount={amount} />
          <PersonalInformation errors={errors} investor={investorFormData} setInvestor={setInvestor} />
          <PaymentInformation />
        </main>
        <aside>
          <InvestingAsPanel />
          <DealDocumentsPanel deal={deal} />
        </aside>
      </div>
      <TermsAndConditionsPanel investor={investor} deal={deal} setCheckedTAT={setCheckedTAT} />
      <Button className="confirm-investment-button" disabled={!checkedTAT} onClick={submitInvestmentConfirmation}>
        Confirm investment
      </Button>
    </section>
  );
}

export default InvestmentPage;
