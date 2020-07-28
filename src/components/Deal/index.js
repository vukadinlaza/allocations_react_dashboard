import React, {useEffect, useState} from 'react'
import Loader from '../utils/Loader'
import _ from "lodash"
import BN from 'bignumber.js'
import {gql} from 'apollo-boost'
import {useParams, useHistory, Link, useLocation} from 'react-router-dom'
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {useAuth} from "../../auth/useAuth";
import {nWithCommas} from '../../utils/numbers'
import {
  Paper,
  Typography, List, ListItem, ListItemText
} from '@material-ui/core';
import queryString from 'query-string'
import InvestmentFlow from './DealFlow'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import moment from 'moment'

import "./style.scss"

/***
 *
 * Deal page shows a deal docs/pledging/onboarding/wiring flow
 *
 **/

export const GET_INVESTOR_DEAL = gql`
  query Deal($deal_slug: String!, $fund_slug: String!) {
    investor {
      _id
      name
      first_name
      last_name
      entity_name
      country
      investor_type
      signer_full_name
      accredited_investor_status
      email
      documents
      invitedDeal(deal_slug: $deal_slug, fund_slug: $fund_slug) {
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
        memo
        documents {
          path
          link
        }
        pledges {
          amount
          timestamp
          initials
        }
        investment {
          _id
          amount
          status
        }
        dealParams {
          totalRoundSize
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
          portfolioTotalCarry
          portfolioEstimatedSetupCosts
          portfolioEstimatedSetupCostsDollar
          portfolioManagementFees
          portfolioManagementFeesDollar
        }
      }
    } 
  }
`

export const CREATE_INVESTMENT = gql`
  mutation CreateInvestment($investment: InvestmentInput!) {
    createInvestment(investment: $investment) {
      _id
    }
  }
`
// TODO: Change the slug in the DB if needed
// export const legacySlugMap = {
//   Xplore: "xplore",
//   Swarm: "swarm",
//   Volumetric: "volumetric",
//   Focusmate: "focusmate",
//   "Focusmate SPV": "focusmate-spv",
//   'volumetric-spv%20seed%20round': "volumetric-spv-seed-round"
// }

export default function Deal() {
  const mobile = useMediaQuery('(max-width:1200px)');
  const {organization, deal_slug} = useParams()
  const location = useLocation()
  const history = useHistory()
  const {userProfile, isAuthenticated, loading } = useAuth()
  const [getDeal, {data, error, refetch, called}] = useLazyQuery(GET_INVESTOR_DEAL)
  const [createInvestment] = useMutation(CREATE_INVESTMENT,
    {
      onCompleted: () => {
        // alert('Mutation Succeeded!')
        refetch()
      }
    }
  )

  useEffect(() => {
    if (!loading && !called && isAuthenticated) {
      getDeal({
        variables: {
          deal_slug: deal_slug,
          fund_slug: organization || "allocations"
        }
      })
    }
  }, [isAuthenticated, loading, called])


  useEffect(() => {
    if (data && !data.investor.invitedDeal.investment) {
      const investment = {
        deal_id: data.investor.invitedDeal._id,
        user_id: data.investor._id,
      }
      createInvestment({variables: {investment}})
    }
  }, [data])

  useEffect(() => {
    // theres been an error
    if (error) {
      const q = queryString.parse(location.search)
      if (q && q.ref === "public" && q.invite) {
        // need to redir back to public link (haven't been invited)
        return history.push(`/public/${organization || "allocations"}/deals/${deal_slug}?invite_code=${q.invite}&no_redirect=true`)
      }

      if (error.message === "GraphQL error: REDIRECT") return history.push(`/`)
      if (userProfile.email) refetch()
    }
  }, [error, userProfile])

  if (!data) return <Loader/>

  const {investor, investor: {invitedDeal: deal}} = data
  const {investment} = deal

  return (
    <>
      <div style={{width: mobile ? "100%" : "calc(100% - 300px)"}}>
        <h2 className="deal-header">{deal.company_name}</h2>
        <h4 className="deal-description">{deal.company_description}</h4>
        <InvestmentFlow deal={{...deal, deal_slug, organization}}
                        investment={investment}
                        investor={investor}
                        refetch={refetch}/>
      </div>

      <div style={{
        position: !mobile ? "absolute" : "relative",
        padding: "100px 16px",
        top: !mobile ? 0 : -32,
        bottom: 0,
        right: 0,
        width: !mobile ? 300 : "100%",
        borderLeft: !mobile ? "1px solid #dfe2e5" : 0,
      }}>
        <DealParams deal={deal}/>
        <InvestorData investor={investor}/>
      </div>
    </>
  )
}

export function DealParams({deal}) {
  const {dealParams, date_closed, deal_lead} = deal

  const allocationPercent = dealParams.totalRoundSize && dealParams.allocation
    ? new BN(dealParams.allocation).dividedBy(dealParams.totalRoundSize).times(100).toFixed(0)
    : null

  const setupCosts = dealParams.totalRoundSize && dealParams.estimatedSetupCosts
    ? new BN(dealParams.estimatedSetupCosts).dividedBy(dealParams.totalRoundSize).times(100).toFixed(0)
    : null

  const show = allocationPercent || 
                setupCosts || 
                dealParams.totalCarry || 
                dealParams.minimumInvestment || 
                dealParams.totalManagementFee || 
                dealParams.signDeadline || 
                dealParams.wireDeadline ||
                dealParams.estimatedSetupCosts ||
                dealParams.estimatedSetupCostsDollar ||
                dealParams.estimatedTerm || 
                dealParams.managementFees ||
                dealParams.managementFeesDollar || 
                dealParams.portfolioTotalCarry || 
                dealParams.portfolioEstimatedSetupCosts ||
                dealParams.portfolioEstimatedSetupCostsDollar || 
                dealParams.portfolioManagementFees ||
                dealParams.portfolioManagementFeesDollar

  const formattedDate_sign = moment(dealParams.signDeadline).format('Do MMMM YYYY')
  const formattedDate_wire = moment(dealParams.wireDeadline).format('Do MMMM YYYY')

  return (
    <>
      <div style={{
        backgroundColor: "#f7f9fa",
        height: 44,
        display: "flex",
        justifyContent: "space-between",
        marginTop: 8,
        textAlign: "left",
        padding: "10px",
        borderTop: "1px solid #dfe3e9",
        borderBottom: "1px solid #dfe3e9"
      }}>
        <span>
        Deadlines
      </span>
      </div>
      <List>
      {show && <> <ListItem>
          <ListItemText
            primary="Signing Deadline"
            secondary={_.upperFirst(formattedDate_sign)}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Wiring Deadline"
            secondary={_.upperFirst(formattedDate_wire)}
          />
        </ListItem>
      </> }
        </List>

        <div style={{
        backgroundColor: "#f7f9fa",
        height: 44,
        display: "flex",
        justifyContent: "space-between",
        marginTop: 8,
        textAlign: "left",
        padding: "10px",
        borderTop: "1px solid #dfe3e9",
        borderBottom: "1px solid #dfe3e9"
      }}>
        <span>
        SPV Terms
      </span>
      </div>
      <List>
        <ListItem>
          <ListItemText
            primary="Organizer"
            secondary={deal.deal_lead}
          />
        </ListItem>
      {show && <>
        {/* {dealParams.allocation && <ListItem>
          <ListItemText
            primary="Allocation"
            secondary={'$' + dealParams.allocation}
          />
        </ListItem>}
        {dealParams.minimumInvestment && <ListItem>
          <ListItemText
            primary="Min. Investment"
            secondary={'$' + nWithCommas(dealParams.minimumInvestment)}
          />
        </ListItem>}
        {dealParams.totalCarry && <ListItem>
          <ListItemText
            primary="Total Carry"
            secondary={dealParams.totalCarry + '%'}
          />
        </ListItem>} */}
        {dealParams.estimatedSetupCosts && <ListItem>
          <ListItemText
            primary="Est. Setup Costs"
            secondary={dealParams.estimatedSetupCosts + '% (excludes blue sky fees)'}
          />
        </ListItem>}
        {dealParams.estimatedSetupCostsDollar && <ListItem>
          <ListItemText
            primary="Est. Setup Costs"
            secondary={'$' + dealParams.estimatedSetupCostsDollar + ' (excludes blue sky fees)'}
          />
        </ListItem>}
        {dealParams.managementFees && <ListItem>
          <ListItemText
            primary="Management Fees"
            secondary={dealParams.managementFees + '% (annual)'}
          />
        </ListItem>}
        {dealParams.managementFeesDollar && <ListItem>
          <ListItemText
            primary="Management Fees"
            secondary={'$' + dealParams.managementFeesDollar}
          />
        </ListItem>}
        {dealParams.estimatedTerm && <ListItem>
          <ListItemText
            primary="Estimated Term"
            secondary={dealParams.estimatedTerm}
          />
        </ListItem>}
        </>}
        </List>

        {(dealParams.portfolioTotalCarry || dealParams.portfolioEstimatedSetupCosts || dealParams.portfolioManagementFees) && <div style={{
        backgroundColor: "#f7f9fa",
        height: 44,
        display: "flex",
        justifyContent: "space-between",
        marginTop: 8,
        textAlign: "left",
        padding: "10px",
        borderTop: "1px solid #dfe3e9",
        borderBottom: "1px solid #dfe3e9"
      }}>
        <span>
        Portfolio Company Terms
      </span>
      </div>
        }
      <List>
      {show && <>
        {dealParams.portfolioTotalCarry && <ListItem>
          <ListItemText
            primary="Total Carry"
            secondary={dealParams.portfolioTotalCarry + '%'}
          />
        </ListItem>}
        {dealParams.portfolioEstimatedSetupCosts && <ListItem>
          <ListItemText
            primary="Est. Setup Costs"
            secondary={dealParams.portfolioEstimatedSetupCosts + '%'}
          />
        </ListItem>}
        {dealParams.portfolioEstimatedSetupCostsDollar && <ListItem>
          <ListItemText
            primary="Est. Setup Costs"
            secondary={'$' + dealParams.portfolioEstimatedSetupCostsDollar}
          />
        </ListItem>}
        {dealParams.portfolioManagementFees && <ListItem>
          <ListItemText
            primary="Management Fees"
            secondary={dealParams.portfolioManagementFees + '%'}
          />
        </ListItem>}
        {dealParams.portfolioManagementFeesDollar && <ListItem>
          <ListItemText
            primary="Management Fees"
            secondary={'$' + dealParams.portfolioManagementFeesDollar}
          />
        </ListItem>}
      </>}
      </List>
    </>
  )
}


function InvestorData({investor}) {
  if (!investor) return <Paper className="tile"><Loader/></Paper>

  return (
    <>
      <div style={{
        backgroundColor: "#f7f9fa",
        height: 44,
        display: "flex",
        justifyContent: "space-between",
        marginTop: 16,
        textAlign: "left",
        padding: "10px",
        borderTop: "1px solid #dfe3e9",
        borderBottom: "1px solid #dfe3e9"
      }}>
        <span>
        My Info
      </span>
        <Link to="/profile">Edit</Link>
      </div>


      <List>
        <ListItem>
          <ListItemText
            primary="Investor Type"
            secondary={_.upperFirst(investor.investor_type)}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Country"
            secondary={investor.country}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Accreditation"
            secondary={investor.accredited_investor_status}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Subscriber Name"
            secondary={investor.name}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Signer Full Name"
            secondary={investor.signer_full_name}
          />
        </ListItem>
      </List>
    </>
  )
}



