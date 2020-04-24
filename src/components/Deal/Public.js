import React, { useEffect, useState } from 'react'
import Loader from '../utils/Loader'
import queryString from 'query-string'
import _ from "lodash"
import { gql } from 'apollo-boost'
import { useParams, useHistory, useLocation, Link } from 'react-router-dom'
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { Row, Col } from "reactstrap";
import { nWithCommas } from '../../utils/numbers'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paper, TextField } from '@material-ui/core';
import InvestmentFlow from './DealFlow'
import { legacySlugMap, DealParams } from './'

import "./style.scss"

const GET_PUBLIC_DEAL = gql`
  query PublicDeal($deal_slug: String!, $fund_slug: String!, $invite_code: String!) {
    publicDeal(deal_slug: $deal_slug, fund_slug: $fund_slug, invite_code: $invite_code) {
      _id
      slug
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
      dealParams {
        totalRoundSize
        allocation
        totalCarry
        minimumInvestment
        totalManagementFee
        estimatedSetupCosts
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

function isLoggedIn() {
  return localStorage.getItem("auth0-token")
}

export default function PublicDeal () {
  const params = useParams()
  const location = useLocation()
  const history = useHistory()
  const [error, setError] = useState(null)
  const [getDeal, { data, error: apiError, refetch, called }] = useLazyQuery(GET_PUBLIC_DEAL)
  const [createInvestment] = useMutation(CREATE_INVESTMENT, { onCompleted: refetch })

  const deal_slug = legacySlugMap[params.deal_slug] || params.deal_slug

  useEffect(() => {
    const { invite_code, no_redirect } = queryString.parse(location.search)
    if (isLoggedIn() && !no_redirect) {
      history.push(params.organization === "allocations" 
        ? `/deals/${deal_slug}?ref=public&invite=${invite_code}` 
        : `/deals/${params.organization}/${deal_slug}?ref=public&invite=${invite_code}`
      )
    }

    if (invite_code) {
      getDeal({ variables: { deal_slug, fund_slug: params.organization, invite_code }})
    } else {
      setError("You do not have permission to see this deal")
    }
  }, [])

  if (!data) return <Loader />

  if (error) return (
    <div className="error-block">
      {error}
    </div>
  )

  const { publicDeal: deal } = data

  return (
    <div className="Deal">
      <h2 className="deal-header">{deal.company_name}</h2>
      <h4 className="deal-description">{deal.company_description}</h4>

      <Row>
        <Col sm="8">
          <Paper className="investment-flow tile">
            <InvestmentFlow deal={deal}
              investment={{status: "invited"}} 
              investor={{}} />
          </Paper>
        </Col>
        <Col sm="4">         
          <DealParams deal={deal} />
        </Col>
      </Row>
    </div>
  )
}
