import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Button } from '@material-ui/core';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { toast } from 'react-toastify';
import TermsAndConditionsPanel from './TermsAndConditionsPanel';
import DealDocumentsPanel from './DealDocumentsPanel';
import InvestmentAmountPanel from './InvestmentAmount';
import PersonalInformation from './PersonalInformation';
import SecondSignature from './SecondSignature';
import './styles.scss';
import Loader from '../../utils/Loader';
import SPVDocumentModal from './SpvDocumentModal';
import { getClientIp } from '../../../utils/ip';
import { nWithCommas } from '../../../utils/numbers';
import { useAuth } from '../../../auth/useAuth';

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
      investments {
        investor {
          _id
        }
        submissionData {
          country
          investor_type
          legalName
          accredited_investor_status
          fullName
        }
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
      }
    }
  }
`;

const GET_PERSONAL_INFO = gql`
  query InvestorPersonalInfo {
    investor {
      _id
      investorPersonalInfo {
        investor {
          _id
        }
        submissionData {
          country
          state
          investor_type
          legalName
          accredited_investor_status
          fullName
        }
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
const GET_PREVIEW = gql`
  mutation getInvestmentPreview($payload: Object) {
    getInvestmentPreview(payload: $payload) {
      previewLink
    }
  }
`;
const ADD_USER_AS_VIEWED = gql`
  mutation addUserAsViewed($user_id: String!, $deal_id: String!) {
    addUserAsViewed(user_id: $user_id, deal_id: $deal_id) {
      _id
    }
  }
`;

// if individual remove signfull name
const validate = (investor, org, requireSecondSigChecked) => {
  let required = ['legalName', 'investor_type', 'country', 'accredited_investor_status'];
  if (org === 'irishangels') {
    required = required.filter((d) => d !== 'accredited_investor_status');
  }
  if (investor.country && investor.country === 'United States') {
    required.push('state');
  }
  if (investor.investor_type === 'entity' && !investor.fullName) {
    required.push('fullName');
  }

  let errors = [];
  errors = required.reduce((acc, attr) => (investor[attr] ? acc : [...acc, attr]), []);

  if (requireSecondSigChecked.secondSigInfo) {
    errors.push(
      'secondLegalName',
      'secondEmail',
      'secondSignerSSN',
      'secondSignerInitials',
      'secondSigConsent',
    );
    errors = errors.reduce(
      (acc, attr) => (investor.secondInvestor[attr] ? acc : [...acc, attr]),
      [],
    );
  }
  return errors;
};

function InvestmentPage() {
  const history = useHistory();
  const location = useLocation();
  const { organization: org, deal_slug } = useParams();
  const [addUserAsViewed, { called }] = useMutation(ADD_USER_AS_VIEWED);
  const { userProfile } = useAuth();
  const organization = org || 'allocations';

  const { data, refetch } = useQuery(GET_DEAL, {
    variables: {
      deal_slug,
      fund_slug: organization || 'allocations',
    },
  });

  const { data: personalInfo } = useQuery(GET_PERSONAL_INFO);

  useEffect(() => {
    if (data?.deal?._id && userProfile?._id && !called) {
      addUserAsViewed({
        variables: {
          user_id: userProfile._id,
          deal_id: data?.deal?._id,
        },
      });
    }
  });

  const [checkedTAT, setCheckedTAT] = useState(false);
  const [showSpvModal, setShowSpvModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [populated, setPopulated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [investorFormData, setInvestor] = useState({
    country: '',
    country_search: '',
    state: '',
    state_search: '',
  });
  const [requireSecondSig, setRequireSecondSig] = useState(false);
  const [requireSecondSigChecked, setRequireSecondSigChecked] = useState({
    secondSigInfo: false,
    secondSigConsent: false,
  });
  const [errors, setErrors] = useState([]);

  const handleSecondSig = (investorType) => {
    if (investorType === 'individual') return setRequireSecondSig(true);

    setRequireSecondSigChecked(() => ({
      secondSigInfo: false,
      secondSigConsent: false,
    }));
    setRequireSecondSig(false);
  };

  useEffect(() => {
    const pAmount = history?.location?.state?.amount;
    if (pAmount) {
      setAmount(pAmount);
    }
  }, [history]);

  const populateInvestorData = () => {
    const personalData = personalInfo?.investor?.investorPersonalInfo?.submissionData;
    const editPersonalData = location?.state?.submission;
    let updatedInvestorData = { ...investorFormData };
    if (!personalData && !editPersonalData) return;
    if (editPersonalData) {
      const editAmount = location.state.amount;
      updatedInvestorData = { ...investorFormData, ...editPersonalData };
      setAmount(editAmount);
    } else if (personalData) {
      updatedInvestorData = { ...investorFormData, ...personalData };
      if (personalData.investor_type === 'individual') {
        setRequireSecondSig(true);
      }
    }
    setInvestor(updatedInvestorData);
    setPopulated(true);
  };

  const [submitConfirmation] = useMutation(CONFIRM_INVESTMENT, {
    onCompleted: () => {
      refetch();
      setLoading(false);
      const message = location?.state?.submission
        ? 'Investment updated successfully.'
        : 'Investment created successfully.';
      toast.success(message);
      const path = organization
        ? `/next-steps/${organization}/${deal_slug}`
        : `/next-steps/${deal_slug}`;
      history.push(path, { investorFormData });
    },
    onError: () => {
      toast.error('Sorry, Something went wrong. Try again or contact support@allocations.com');
    },
  });

  const [getInvestmentPreview, { data: previewData, loading: loadingPreview }] =
    useMutation(GET_PREVIEW);

  if (!data || loading) return <Loader />;

  const { deal } = data;
  const {
    company_name,
    dealParams: { minimumInvestment },
  } = deal;

  const confirmInvestment = () => {
    const validation = validate(investorFormData, organization, requireSecondSigChecked);
    setErrors(validation);

    if (validation.length > 0) return toast.warning('Incomplete Form');
    if (!amount) return toast.warning('Please enter a valid investment amount.');
    if (parseInt(amount, 10) < 1000)
      return toast.warning('Please enter an investment amount greater than $1000.');

    const payload = {
      ...investorFormData,
      investmentAmount: nWithCommas(amount),
      dealId: deal._id,
      docSpringTemplateId: deal.docSpringTemplateId,
    };

    getInvestmentPreview({ variables: { payload } });
    setShowSpvModal(true);
  };

  const submitInvestment = async () => {
    const ip = await getClientIp();
    const isEdit = location?.state?.submission;
    const payload = {
      ...investorFormData,
      investmentAmount: nWithCommas(amount),
      clientIp: ip,
      dealId: deal._id,
      docSpringTemplateId: deal.docSpringTemplateId,
    };

    if (isEdit) payload.investmentId = location.state.investmentId;

    submitConfirmation({ variables: { payload } });
    setShowSpvModal(false);
    setLoading(true);
  };

  if (!populated) populateInvestorData(deal);

  return (
    <section className="InvestmentPage">
      <div className="nav-btn-container">
        <Button
          className="back-button"
          onClick={() => history.push(`/deals/${organization}/${deal_slug}`)}
        >
          <ArrowBackIcon />
          Back to Deal Page
        </Button>
        <Button
          className="next-button"
          onClick={() => history.push(`/next-steps/${organization}/${deal_slug}`)}
        >
          Next Steps
          <ArrowForwardIcon />
        </Button>
      </div>
      <div>
        <h1 className="investment-header">Invest in {company_name}</h1>
      </div>

      <div className="flex-container">
        <InvestmentAmountPanel
          setAmount={setAmount}
          amount={amount}
          minimumInvestment={minimumInvestment}
        />
        <div className="side-panel">
          <DealDocumentsPanel deal={deal} />
        </div>
        <PersonalInformation
          org={org}
          errors={errors}
          investor={investorFormData}
          setInvestor={setInvestor}
          handleSecondSig={handleSecondSig}
        />
        {requireSecondSig && org === 'irishangels' && (
          <SecondSignature
            requireSecondSigChecked={requireSecondSigChecked}
            setRequireSecondSigChecked={setRequireSecondSigChecked}
            setInvestor={setInvestor}
            errors={errors}
          />
        )}
        <TermsAndConditionsPanel
          confirmInvestment={confirmInvestment}
          deal={deal}
          checkedTAT={checkedTAT}
          setCheckedTAT={setCheckedTAT}
          isEdit={location?.state?.submission}
          requireSecondSigChecked={requireSecondSigChecked.secondSigInfo}
        />
      </div>

      <SPVDocumentModal
        open={showSpvModal}
        setOpen={setShowSpvModal}
        deal={deal}
        submitInvestment={submitInvestment}
        previewData={previewData}
        loadingPreview={loadingPreview}
        requireSecondSigChecked={requireSecondSigChecked.secondSigInfo}
      />
    </section>
  );
}

export default InvestmentPage;
