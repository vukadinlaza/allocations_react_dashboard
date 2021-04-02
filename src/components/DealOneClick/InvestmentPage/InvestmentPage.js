import React, { useState, useEffect } from 'react';
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
import Loader from '../../utils/Loader';
import WireInstructions from './WireInstructions';
import YourDocumentsPanel from './YourDocumentsPanel';
import SPVDocumentModal from './SpvDocumentModal';
import { getClientIp } from '../../../utils/ip';

const CONFIRM_INVESTMENT = gql`
  mutation ConfirmInvestment($payload: Object) {
    confirmInvestment(payload: $payload) {
      _id
    }
  }
`;

// if individual remove signfull name
const validate = (investor) => {
  const required = ['legalName', 'investor_type', 'country', 'accredited_investor_status'];
  if (investor.country && investor.country === 'United States') {
    required.push('state');
  }
  if (investor.investor_type === 'entity' && !investor.fullName) {
    required.push('fullName');
  }
  return required.reduce((acc, attr) => (investor[attr] ? acc : [...acc, attr]), []);
};

function InvestmentPage({ deal, investor, toggleInvestmentPage, refetch, investment, organzation }) {
  const history = useHistory();
  const { company_name, slug } = deal;
  const [checkedTAT, setCheckedTAT] = useState(false);
  const [showSpvModal, setShowSpvModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [investorFormData, setInvestor] = useState({});
  const [errors, setErrors] = useState([]);

  const [submitConfirmation, { data, called }] = useMutation(CONFIRM_INVESTMENT, {
    onCompleted: () => {
      refetch();
      toast.success('Investment created successfully.');
      setTimeout(() => {
        const path = organzation ? `/next-steps/${organzation}/${slug}` : `/next-steps/${slug}`;
        history.push(path, { investorFormData });
      }, 2000);
    },
  });

  useEffect(() => {
    if (called && data) {
      refetch();
    }
  });
  const confirmInvestment = () => {
    const validation = validate(investorFormData);
    setErrors(validation);

    if (validation.length > 0) {
      return toast.warning('Incomplete Form');
    }

    if (!amount) {
      return toast.warning('Please enter a valid investment amount.');
    }
    setShowSpvModal(true);
  };
  const submitInvestment = async () => {
    const ip = await getClientIp();
    const payload = {
      ...investorFormData,
      investmentId: investment._id,
      investmentAmount: amount,
      clientIp: ip,
      dealId: deal._id,
      docSpringTemplateId: deal.docSpringTemplateId,
    };

    submitConfirmation({ variables: { payload } });
    setShowSpvModal(false);
  };

  const {
    dealParams: { minimumInvestment, maximumInvestment },
  } = deal;

  return (
    <section className="InvestmentPage">
      <Button className="back-button" onClick={() => toggleInvestmentPage((open) => !open)}>
        <ArrowBackIcon />
        Back to Deal Page
      </Button>
      <div>
        <h1 className="investment-header">Invest in {company_name}</h1>
      </div>

      <div className="flex-container">
        <main>
          <InvestmentAmountPanel
            setAmount={setAmount}
            amount={amount}
            minimumInvestment={minimumInvestment}
            maximumInvestment={maximumInvestment}
          />
          <PersonalInformation errors={errors} investor={investorFormData} setInvestor={setInvestor} />
          {/* <PaymentInformation /> */}
          <TermsAndConditionsPanel
            confirmInvestment={confirmInvestment}
            investor={investor}
            deal={deal}
            checkedTAT={checkedTAT}
            setCheckedTAT={setCheckedTAT}
          />
        </main>
        <aside>
          <InvestingAsPanel />
          <DealDocumentsPanel deal={deal} />
          <YourDocumentsPanel investment={investment} />
          {((investment && investment.status === 'signed') || (investment && investment.status === 'wired')) && (
            <div className="wire-container">
              <WireInstructions deal={deal} />
            </div>
          )}
        </aside>
      </div>

      <SPVDocumentModal open={showSpvModal} setOpen={setShowSpvModal} deal={deal} submitInvestment={submitInvestment} />
    </section>
  );
}

export default InvestmentPage;
