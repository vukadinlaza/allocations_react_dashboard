import React, { useState } from 'react'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useParams, useHistory } from 'react-router-dom';
import { gql } from 'apollo-boost';
import BasicInfoSettings from './BasicInfoSettings'
import DeadlineSettings from './DeadlineSettings'
import SPVTermSettings from './SPVTermSettings'
import DealSettings from './DealSettings'
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


  const [activeTab, setActiveTab] = useState('deal')

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  const getTabClassName = tab => `tab-button ${activeTab === tab && 'active'}`

  const handleContinueClick = () => {
    switch (activeTab) {
      case 'basic':
        return setActiveTab('deadline')
      case 'deadline':
        return setActiveTab('spv')
      case 'spv':
        return setActiveTab('deal')
    }
  }

  const settingsComponentMap = {
    'basic': <BasicInfoSettings />,
    'deadline': <DeadlineSettings />,
    'spv': <SPVTermSettings />,
    'deal': <DealSettings />,
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

          <button
            onClick={() => handleTabClick('spv')}
            className={getTabClassName('spv')}
          >
            SPV Terms
          </button>

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
            <Button onClick={handleContinueClick} className="delete-deal">
              Delete deal
            </Button>
          )
        }

      </div>

    </section>
  )
}

export default DealEditNew
