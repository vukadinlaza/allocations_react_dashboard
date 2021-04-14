import React, { useState, useEffect } from 'react';
import { useMutation, useLazyQuery, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Button } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
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
import YourDocumentsPanel from './YourDocumentsPanel';
import SPVDocumentModal from './SpvDocumentModal';
import { getClientIp } from '../../../utils/ip';
import { nWithCommas } from '../../../utils/numbers';
import InvestmentHistory from './InvestmentHistory/InvestmentHistory';

const GET_DEAL = gql`
  query Deal($deal_slug: String!, $fund_slug: String!) {
    deal(deal_slug: $deal_slug, fund_slug: $fund_slug) {
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

function InvestmentPage({}) {
  const history = useHistory();
  const { organization, deal_slug } = useParams();

  const { data, refetch } = useQuery(GET_DEAL, {
    variables: {
      deal_slug,
      fund_slug: organization || 'allocations',
    },
  });

  const [checkedTAT, setCheckedTAT] = useState(false);
  const [showSpvModal, setShowSpvModal] = useState(false);
  const [amount, setAmount] = useState('');

  const [investorFormData, setInvestor] = useState({
    country: '',
    country_search: '',
    state: '',
    state_search: '',
  });
  const [errors, setErrors] = useState([]);

  const [submitConfirmation] = useMutation(CONFIRM_INVESTMENT, {
    onCompleted: () => {
      refetch();
      toast.success('Investment created successfully.');
      const path = organization ? `/next-steps/${organization}/${deal_slug}` : `/next-steps/${deal_slug}`;
      history.push(path, { investorFormData });
    },
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

    if (parseInt(amount) < 1000) {
      return toast.warning('Please enter an investment amount greater than $1000.');
    }
    setShowSpvModal(true);
  };
  const submitInvestment = async () => {
    const ip = await getClientIp();
    const payload = {
      ...investorFormData,
      investmentAmount: nWithCommas(amount),
      clientIp: ip,
      dealId: deal._id,
      docSpringTemplateId: deal.docSpringTemplateId,
    };

    console.log('PAYLOAD', payload);

    submitConfirmation({ variables: { payload } });
    setShowSpvModal(false);
  };

  if (!data) return <Loader />;

  const { deal } = data;
  const {
    company_name,
    dealParams: { minimumInvestment },
  } = deal;

  return (
    <section className="InvestmentPage">
      <Button className="back-button" onClick={() => history.push(`/deals/${organization}/${deal_slug}`)}>
        <ArrowBackIcon />
        Back to Deal Page
      </Button>
      <div>
        <h1 className="investment-header">Invest in {company_name}</h1>
      </div>

      <div className="flex-container">
        <InvestmentAmountPanel setAmount={setAmount} amount={amount} minimumInvestment={minimumInvestment} />
        <div className="side-panel">
          <InvestingAsPanel />
          <InvestmentHistory deal={deal} setInvestor={setInvestor} investor={investorFormData} />
          <DealDocumentsPanel deal={deal} />
          {/* <YourDocumentsPanel investment={investment} /> */}
        </div>
        <PersonalInformation errors={errors} investor={investorFormData} setInvestor={setInvestor} />
        <TermsAndConditionsPanel
          confirmInvestment={confirmInvestment}
          deal={deal}
          checkedTAT={checkedTAT}
          setCheckedTAT={setCheckedTAT}
        />
      </div>

      <SPVDocumentModal open={showSpvModal} setOpen={setShowSpvModal} deal={deal} submitInvestment={submitInvestment} />
    </section>
  );
}

export default InvestmentPage;
