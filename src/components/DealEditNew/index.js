import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useParams, useHistory } from 'react-router-dom';
import _ from 'lodash';
import { Button } from '@material-ui/core';
import { toast } from 'react-toastify';
import BasicInfoSettings from './BasicInfoSettings';
import DeadlineSettings from './DeadlineSettings';
import SPVTermSettings from './SPVTermSettings';
import DealSettings from './DealSettings';
import PortfolioCompanySettings from './PortfolioCompanySettings';
import FundTerms from './FundTermSettings';
import useStyles from './styles';

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
  'is3c7',
];

const ORG_OVERVIEW = gql`
  query GetOrg($slug: String!, $status: String) {
    organization(slug: $slug) {
      _id
      name
      slug
      deals(status: $status) {
        _id
        raised
        appLink
        status
        date_closed
        dealParams {
          wireDeadline
          dealMultiple
        }
        company_name
        company_description
        target
        investments {
          amount
          investor {
            investingAs
          }
        }
      }
    }
    investor {
      _id
      admin
      documents
    }
  }
`;

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
        is3c7
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
          is3c7
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
  const styles = useStyles();
  const { id, organization } = useParams();
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    dealParams: {},
    documents: [],
  });

  const { data, refetch } = useQuery(GET_DEAL, { variables: { id, slug: organization } });

  const [updateDeal] = useMutation(UPDATE_DEAL, {
    onCompleted: () => toast.success('Deal updated successfully'),
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

  const getTabClassName = (tab) => `${styles.tabButton} ${activeTab === tab && styles.active}`;

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
    // eslint-disable-next-line no-alert
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
    deal: (
      <DealSettings
        formData={formData}
        setFormData={setFormData}
        handleFormSubmit={handleFormSubmit}
        refetch={refetch}
      />
    ),
    fund: <FundTerms formData={formData} setFormData={setFormData} />,
    portfolio: <PortfolioCompanySettings formData={formData} setFormData={setFormData} />,
  };

  if (errorMessage) return <div>{errorMessage}</div>;

  const dealPageUrl = formData.slug ? `/deals/${organization}/${formData.slug}` : '';

  return (
    <section className={styles.dealEditNew}>
      <Button onClick={() => history.push(dealPageUrl)} className={styles.viewDealPageButton}>
        View Deal Page
      </Button>
      <div className={styles.sectionHeader}>
        <h1>Edit Deal</h1>
        <div className={styles.tabsContainer}>
          <button
            onClick={() => handleTabClick('basic')}
            className={getTabClassName('basic')}
            type="button"
          >
            Basic Info
          </button>

          <button
            onClick={() => handleTabClick('deadline')}
            className={getTabClassName('deadline')}
            type="button"
          >
            Deadlines
          </button>

          {formData.investmentType === 'spv' ? (
            <button
              onClick={() => handleTabClick('spv')}
              className={getTabClassName('spv')}
              type="button"
            >
              SPV Terms
            </button>
          ) : (
            <button
              onClick={() => handleTabClick('fund')}
              className={getTabClassName('fund')}
              type="button"
            >
              Fund Terms
            </button>
          )}

          {formData.differentPortfolioTerms && formData.investmentType === 'spv' && (
            <button
              onClick={() => handleTabClick('portfolio')}
              className={getTabClassName('portfolio')}
              type="button"
            >
              Portfolio Company Terms
            </button>
          )}

          <button
            onClick={() => handleTabClick('deal')}
            className={getTabClassName('deal')}
            type="button"
          >
            Deal Settings
          </button>
        </div>
      </div>

      <div className={styles.content}>{settingsComponentMap[activeTab]}</div>

      <div className={`${styles.saveChanges} ${activeTab === 'deal' && styles.lastPage}`}>
        {activeTab !== 'deal' && (
          <Button onClick={handleContinueClick} className={styles.continue}>
            Next
          </Button>
        )}

        <Button onClick={handleFormSubmit} className={styles.saveAndExit}>
          Save
        </Button>

        {activeTab === 'deal' && (
          <Button onClick={handleDeleteDeal} className={styles.deleteDeal}>
            Delete deal
          </Button>
        )}
      </div>
    </section>
  );
}

export default DealEditNew;
