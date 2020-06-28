import React, {useEffect, useState} from 'react'
import Loader from '../utils/Loader'
import _ from "lodash"
import BN from 'bignumber.js'
import {gql} from 'apollo-boost'
import {useParams, useHistory, Link, useLocation} from 'react-router-dom'
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {useAuth0} from "../../react-auth0-spa";
import {nWithCommas} from '../../utils/numbers'
import {
  Paper,
  Typography, List, ListItem, ListItemText
} from '@material-ui/core';
import queryString from 'query-string'
import InvestmentFlow from './DealFlow'
import useMediaQuery from '@material-ui/core/useMediaQuery';

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

export const legacySlugMap = {
  Xplore: "xplore",
  Swarm: "swarm",
  Volumetric: "volumetric",
  Focusmate: "focusmate",
  "Focusmate SPV": "focusmate-spv",
  'volumetric-spv%20seed%20round': "volumetric-spv-seed-round"
}

const {NODE_ENV} = process.env

export default function Deal() {
  const mobile = useMediaQuery('(max-width:1200px)');
  const {organization, deal_slug} = useParams()
  const location = useLocation()
  const history = useHistory()
  const {user, isAuthenticated, loading, loginWithRedirect, auth0Client} = useAuth0()
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
    if (auth0Client && !isAuthenticated) {
      loginWithRedirect({appState: {targetUrl: location.pathname}, initialScreen: 'signIn'})
    }
  }, [auth0Client, isAuthenticated])

  useEffect(() => {
    if (!loading && !called && isAuthenticated) {
      const _deal_slug = legacySlugMap[deal_slug] || deal_slug
      getDeal({variables: {deal_slug: _deal_slug, fund_slug: organization || "allocations"}})
    }
  }, [isAuthenticated, loading, called])

  useEffect(() => {
    if (data && NODE_ENV !== "test") window._slaask.updateContact({name: data.investor.name})
  }, [data])

  useEffect(() => {
    if (data && !data.investor.invitedDeal.investment) {
      const investment = {deal_id: data.investor.invitedDeal._id, user_id: data.investor._id}
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
      if (user) refetch()
    }
  }, [error, user])

  if (!data) return <Loader/>

  const {investor, investor: {invitedDeal: deal}} = data
  const {investment} = deal

  console.log("APPROVED?", deal.approved)

  return (
    <>
      <div style={{width: mobile ? "100%" : "calc(100% - 300px)"}}>
        <h2 className="deal-header">{deal.company_name}</h2>
        <h4 className="deal-description">{deal.company_description}</h4>
        <InvestmentFlow deal={deal}
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

  const show = allocationPercent || setupCosts || dealParams.totalCarry || dealParams.minimumInvestment || dealParams.totalManagementFee

  return (
    <>
      <Typography variant="h6">Estimated Closing Date</Typography>
      <>
        <span>{deal.date_closed}</span>
      </>
      <Typography>Lead</Typography>
      <span>{deal.deal_lead}</span>

      {show && <>
        {allocationPercent && <div className="allocation">
          <span>Allocation</span>
          <span>{allocationPercent}%</span>
        </div>}
        {dealParams.totalCarry && <div className="total-carry">
          <span>Total Carry</span>
          <span>{dealParams.totalCarry}%</span>
        </div>}
        {dealParams.minimumInvestment && <div className="min-investment">
          <span>Min Investment</span>
          <span>${nWithCommas(dealParams.minimumInvestment)}</span>
        </div>}
      </>}
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



