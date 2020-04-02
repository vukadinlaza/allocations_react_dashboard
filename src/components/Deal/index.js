import React, { useEffect, useState } from 'react'
import Loader from '../utils/Loader'
import _ from "lodash"
import { gql } from 'apollo-boost'
import { useParams, useHistory, Link, useLocation } from 'react-router-dom'
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { Row, Col } from "reactstrap";
import { useAuth0 } from "../../react-auth0-spa";
import { nWithCommas } from '../../utils/numbers'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paper, TextField } from '@material-ui/core';
import queryString from 'query-string'
import InvestmentFlow from './DealFlow'

import "./style.scss"

const GET_INVESTOR_DEAL = gql`
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
        investment {
          _id
          amount
          status
        }
      }
    } 
  }
`

const CREATE_INVESTMENT = gql`
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
  Focusmate: "focusmate"
}

export default function Deal () {
  const { organization, deal_slug } = useParams()
  const location = useLocation()
  const history = useHistory()
  const { user, isAuthenticated, loading } = useAuth0()
  const [getDeal, { data, error, refetch, called }] = useLazyQuery(GET_INVESTOR_DEAL)
  const [createInvestment] = useMutation(CREATE_INVESTMENT, { onCompleted: () => refetch() })

  useEffect(() => {
    if (!loading && isAuthenticated && !called) {
      const _deal_slug = legacySlugMap[deal_slug] || deal_slug
      getDeal({ variables: { deal_slug: _deal_slug, fund_slug: organization || "allocations" }})
    }
  }, [isAuthenticated, loading, called])

  useEffect(() => {
    if (data) window._slaask.updateContact({name: data.investor.name})
  }, [data])

  useEffect(() => {
    if (data && !data.investor.invitedDeal.investment) {
      const investment = { deal_id: data.investor.invitedDeal._id, user_id: data.investor._id }
      createInvestment({ variables: { investment }})
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

  if (!data) return <Loader />

  const { investor, investor: { invitedDeal: deal } } = data
  const { investment } = deal

  return (
    <div className="Deal">
      <h2 className="deal-header">{deal.company_name}</h2>
      <h4 className="deal-description">{deal.company_description}</h4>

      <Row>
        <Col sm="8">
          <Paper className="investment-flow tile">
            <InvestmentFlow deal={deal}
              investment={investment} 
              investor={investor} />
          </Paper>
        </Col>
        <Col sm="4">
          <Paper className="investment-details tile">
            <div className="small-header">Closing Date</div>
            <Paper className="closing-date">
              <FontAwesomeIcon icon="clock" size="lg" />
              <span>{deal.date_closed}</span>
            </Paper>
            <div className="small-header">Lead</div>
            <Paper className="deal-lead">
              <span>{deal.deal_lead}</span>
            </Paper>
          </Paper>
          <InvestorData investor={investor} />
        </Col>
      </Row>
    </div>
  )
}

function InvestorData ({ investor }) {
  if (!investor) return <Paper className="tile"><Loader /></Paper>

  return (
    <Paper className="investor-details tile">
      <div className="small-header">My Info [<Link to="/profile">edit</Link>]</div>
      <div>
        <TextField style={{width: "100%"}} label="Investor Type" value={_.upperFirst(investor.investor_type)} disabled />
      </div>
      <div>
        <TextField style={{width: "100%"}} label="Country" value={investor.country} disabled />
      </div>
      <div>
        <TextField style={{width: "100%"}} label="Accreditation" value={investor.accredited_investor_status} disabled />
      </div>
      <div>
        <TextField style={{width: "100%"}} label="Subscriber Name" value={investor.name} disabled />
      </div>
      <div>
        <TextField style={{width: "100%"}} label="Signer Full Name" value={investor.signer_full_name} disabled />
      </div>
    </Paper>
  )
}



