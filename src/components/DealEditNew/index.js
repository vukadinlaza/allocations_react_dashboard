import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useParams, useHistory } from 'react-router-dom';
import { gql } from 'apollo-boost';
import _ from 'lodash';
import { Button } from '@material-ui/core';
import { toast } from 'react-toastify';
import BasicInfoSettings from './BasicInfoSettings';
import DeadlineSettings from './DeadlineSettings';
import SPVTermSettings from './SPVTermSettings';
import DealSettings from './DealSettings';
import PortfolioCompanySettings from './PortfolioCompanySettings';
import FundTerms from './FundTermSettings';
import './styles.scss';
import { ORG_OVERVIEW } from '../admin/AdminHome';


const validInputs = [
  '_id',
  'company_name',
  'company_description',
  'date_closed',
  'deal_lead',
  'pledge_link',
  'onboarding_link',
  'embed_code',
  'status',
  'closed',
  'allInvited',
  'amount',
  'memo',
  'investmentType',
  'differentPortfolioTerms',
  'target',
  'amount_raised',
  'no_exchange',
  'last_valuation',
  'dealParams',
  'Annual',
  'One-Time',
  'docSpringTemplateId',
];

const dealParamsValidInputs = [
  'allocation',
  'dealType',
  'dealMultiple',
  'totalCarry',
  'keyHighlights',
  'risks',
  'minimumInvestment',
  'maximumInvestment',
  'totalManagementFee',
  'totalRoundSize',
  'signDeadline',
  'wireDeadline',
  'estimatedSetupCosts',
  'estimatedSetupCostsDollar',
  'estimatedTerm',
  'managementFees',
  'managementFeesDollar',
  'managementFeeType',
  'portfolioTotalCarry',
  'portfolioEstimatedSetupCosts',
  'portfolioEstimatedSetupCostsDollar',
  'portfolioManagementFees',
  'portfolioManagementFeeType',
  'portfolioManagementFeesDollar',
  'fundTotalCarry',
  'fundEstimatedSetupCosts',
  'fundEstimatedSetupCostsDollar',
  'fundManagementFees',
  'fundManagementFeesDollar',
  'fundManagementFeeType',
  'fundGeneralPartner',
  'fundEstimatedTerm',
  'coinvestors',
  'dealLogo',
];

const UPDATE_DEAL = gql`
  mutation UpdateDeal($org: String!, $deal: DealInput!) {
    updateDeal(org: $org, deal: $deal) {
      _id
      company_name
      company_description
      date_closed
      deal_lead
      pledge_link
      onboarding_link
      status
      allInvited
      investmentType
      differentPortfolioTerms
      inviteKey
      memo
      target
      amount_raised
      docSpringTemplateId
      invitedInvestors {
        _id
        name
      }
      dealParams {
        risks
        totalRoundSize
        dealType
        dealMultiple
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
`;

const GET_DEAL = gql`
  query Deal($id: String!, $slug: String!) {
    organization(slug: $slug) {
      _id
      deal(_id: $id) {
        _id
        slug
        company_name
        company_description
        date_closed
        deal_lead
        pledge_link
        onboarding_link
        allInvited
        status
        inviteKey
        target
        amount_raised
        memo
        last_valuation
        no_exchange
        appLink
        publicLink
        docSpringTemplateId
        dealCoverImageKey
        investmentType
        differentPortfolioTerms
        documents {
          path
          link
        }
        investments {
          _id
          status
          amount
          investor {
            _id
            name
          }
        }
        invitedInvestors {
          _id
          name
          email
        }
        emailInvites {
          status
          sent_at
          to
          opened
          opened_at
        }
        dealParams {
          totalRoundSize
          dealType
          dealMultiple
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

const DELETE_DEAL = gql`
  mutation DeleteDeal($_id: String!) {
    deleteDeal(_id: $_id)
  }
`;

function DealEditNew() {
  const { id, organization } = useParams();
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('deal');
  const [formData, setFormData] = useState({
    dealParams: {},
    documents: []
  });

  const { data, refetch, error, loading } = useQuery(GET_DEAL, { variables: { id, slug: organization } });

  const [updateDeal] = useMutation(UPDATE_DEAL, {
    onCompleted: () => toast.success('Deal updated successfully.'),
  });

  const [deleteDeal] = useMutation(DELETE_DEAL, {
    variables: { _id: formData._id },
    refetchQueries: [{ query: ORG_OVERVIEW, variables: { slug: organization } }],
    onCompleted: () => history.push(`/admin/${organization}`),
  });

  useEffect(() => {
    if (data) {
      if (data?.organization?.deal) {
        setFormData((prevState) => ({ ...prevState, ...data.organization.deal }));
      } else {
        setErrorMessage('Not Authorized to View this Deal');
      }
    }
  }, [data]);

  const toggleDifferentSPVTerms = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      differentPortfolioTerms: value,
    }));
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getTabClassName = (tab) => `tab-button ${activeTab === tab && 'active'}`;

  const handleContinueClick = () => {
    window.scrollTo({
      top: 0,
      left: 100,
      behavior: 'smooth',
    });

    // eslint-disable-next-line default-case
    switch (activeTab) {
      case 'basic':
        return setActiveTab('deadline');
      case 'deadline': {
        if (formData.investmentType === 'spv') {
          return setActiveTab('spv');
        }
        return setActiveTab('fund');
      }
      case 'spv':
        if (formData.differentPortfolioTerms) {
          return setActiveTab('portfolio');
        }
        return setActiveTab('deal');

      case 'portfolio':
        return setActiveTab('deal');
      case 'fund':
        return setActiveTab('deal');
    }
  };

  const handleFormSubmit = () => {
    updateDeal({
      variables: {
        deal: {
          ..._.pick(formData, validInputs),
          dealParams: _.pick(formData.dealParams, dealParamsValidInputs),
        },
        org: organization,
      },
    });
  };

  const handleDeleteDeal = () => {
    if (window.confirm(`Are you sure you'd like to delete ${formData.company_name}`)) {
      deleteDeal();
    }
  };

  const settingsComponentMap = {
    basic: <BasicInfoSettings formData={formData} setFormData={setFormData} />,
    deadline: <DeadlineSettings formData={formData} setFormData={setFormData} />,
    spv: (
      <SPVTermSettings
        formData={formData}
        setFormData={setFormData}
        toggleDifferentSPVTerms={toggleDifferentSPVTerms}
      />
    ),
    deal: <DealSettings formData={formData} setFormData={setFormData} refetch={refetch} />,
    fund: <FundTerms formData={formData} setFormData={setFormData} />,
    portfolio: <PortfolioCompanySettings formData={formData} setFormData={setFormData} />,
  };

  if (errorMessage) return <div className="Error">{errorMessage}</div>;

  const dealPageUrl = formData.slug ? `/deals/${organization}/${formData.slug}` : ''

  return (
    <section className="DealEditNew">

      <Button onClick={() => history.push(dealPageUrl)} className="view-deal-page-button">View Deal Page</Button>
      <div className="section-header">
        <h1>Edit Deal</h1>
        <div className="tabs-container">
          <button onClick={() => handleTabClick('basic')} className={getTabClassName('basic')}>
            Basic Info
          </button>

          <button onClick={() => handleTabClick('deadline')} className={getTabClassName('deadline')}>
            Deadlines
          </button>

          {formData.investmentType === 'spv' ? (
            <button onClick={() => handleTabClick('spv')} className={getTabClassName('spv')}>
              SPV Terms
            </button>
          ) : (
            <button onClick={() => handleTabClick('fund')} className={getTabClassName('fund')}>
              Fund Terms
            </button>
          )}

          {formData.differentPortfolioTerms && formData.investmentType === 'spv' && (
            <button onClick={() => handleTabClick('portfolio')} className={getTabClassName('portfolio')}>
              Portfolio Company Terms
            </button>
          )}

          <button onClick={() => handleTabClick('deal')} className={getTabClassName('deal')}>
            Deal Settings
          </button>
        </div>
      </div>

      <div className="content">{settingsComponentMap[activeTab]}</div>

      <div className={`save-changes ${activeTab === 'deal' && 'lastPage'}`}>
        {activeTab !== 'deal' && (
          <Button onClick={handleContinueClick} className="continue">
            Continue
          </Button>
        )}

        <Button onClick={handleFormSubmit} className="save-and-exit">
          Save and Exit
        </Button>

        {activeTab === 'deal' && (
          <Button onClick={handleDeleteDeal} className="delete-deal">
            Delete deal
          </Button>
        )}
      </div>
    </section>
  );
}

export default DealEditNew;
