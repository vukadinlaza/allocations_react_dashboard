import React, { useState, useEffect } from 'react'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useParams, useHistory } from 'react-router-dom';
import { gql } from 'apollo-boost';
import BasicInfoSettings from './BasicInfoSettings'
import DeadlineSettings from './DeadlineSettings'
import SPVTermSettings from './SPVTermSettings'
import DealSettings from './DealSettings'
import PortfolioCompanySettings from './PortfolioCompanySettings'
import FundTerms from './FundTermSettings';
import './styles.scss'


import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Grid,
  Divider,
  IconButton,
} from '@material-ui/core';



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

function DealEditNew() {

  const { id, organization } = useParams();
  const { data, refetch, error, loading } = useQuery(GET_DEAL, { variables: { id, slug: organization } });
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    if (data) {
      if (data?.organization?.deal) {
        setFormData(prevState => ({ ...prevState, ...data.organization.deal }))
      } else {
        setErrorMessage('Not Authorized to View this Deal');
      }
    }
  }, [data]);


  const [activeTab, setActiveTab] = useState('fund')
  const [differentSPVTerms, toggleDifferentSPVTerms] = useState(false)
  const [formData, setFormData] = useState({
    investmentType: 'fund',
    dealParams: {
      dealType: '506b'
    }
  })

  console.log('formdata', formData)

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  const getTabClassName = tab => `tab-button ${activeTab === tab && 'active'}`

  const handleContinueClick = () => {

    window.scrollTo({
      top: 0,
      left: 100,
      behavior: 'smooth',
    });

    switch (activeTab) {
      case 'basic':
        return setActiveTab('deadline')
      case 'deadline':
        {
          if (formData.investmentType === 'spv') {
            return setActiveTab('spv')
          } else {
            return setActiveTab('fund')
          }
        }
      case 'spv':
        if (differentSPVTerms) {
          return setActiveTab('portfolio')
        } else {
          return setActiveTab('deal')
        }
      case 'portfolio':
        return setActiveTab('deal')
      case 'fund':
        return setActiveTab('deal')
    }
  }

  const handleDeleteDeal = () => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      // handle deal delete here
    }
  }

  console.log('active tab', activeTab)

  const settingsComponentMap = {
    'basic': <BasicInfoSettings formData={formData} setFormData={setFormData} />,
    'deadline': <DeadlineSettings formData={formData} setFormData={setFormData} />,
    'spv': <SPVTermSettings formData={formData} setFormData={setFormData} differentSPVTerms={differentSPVTerms} toggleDifferentSPVTerms={toggleDifferentSPVTerms} />,
    'deal': <DealSettings formData={formData} setFormData={setFormData} />,
    'fund': <FundTerms formData={formData} setFormData={setFormData} />,
    'portfolio': <PortfolioCompanySettings formData={formData} setFormData={setFormData} />
  }

  return (
    <section className="DealEditNew">

      <div className="section-header">
        <h1>Edit Deal</h1>
        <div className="tabs-container">

          <button
            onClick={() => handleTabClick('basic')}
            className={getTabClassName('basic')}
          >
            Basic Info
          </button>

          <button
            onClick={() => handleTabClick('deadline')}
            className={getTabClassName('deadline')}
          >
            Deadlines
          </button>

          {
            formData.investmentType === 'spv' ?
              (<button
                onClick={() => handleTabClick('spv')}
                className={getTabClassName('spv')}
              >
                SPV Terms
              </button>) :
              (<button
                onClick={() => handleTabClick('fund')}
                className={getTabClassName('fund')}
              >
                Fund Terms
              </button>)
          }

          {
            differentSPVTerms && formData.investmentType === 'spv' &&
            (
              <button
                onClick={() => handleTabClick('portfolio')}
                className={getTabClassName('portfolio')}
              >
                Portfolio Company Terms
              </button>
            )
          }

          <button
            onClick={() => handleTabClick('deal')}
            className={getTabClassName('deal')}
          >
            Deal Settings
          </button>

        </div>
      </div>

      <div className="content">
        {settingsComponentMap[activeTab]}
      </div>

      <div className={`save-changes ${activeTab === 'deal' && 'lastPage'}`}>

        {
          activeTab !== 'deal' && (
            <Button onClick={handleContinueClick} className="continue">
              Continue
            </Button>
          )
        }

        <Button className="save-and-exit">
          Save and Exit
        </Button>

        {
          activeTab === 'deal' && (
            <Button onClick={handleDeleteDeal} className="delete-deal">
              Delete deal
            </Button>
          )
        }

      </div>

    </section>
  )
}

export default DealEditNew
