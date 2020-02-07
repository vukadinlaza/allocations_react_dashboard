import React, { useEffect, useState } from 'react'
import Loader from '../utils/Loader'
import queryString from 'query-string'
import _ from "lodash"
import { gql } from 'apollo-boost'
import { useParams, useHistory, useLocation, Link } from 'react-router-dom'
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { Row, Col } from "reactstrap";
import { useAuth0 } from "../../react-auth0-spa";
import { nWithCommas } from '../../utils/numbers'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paper, TextField } from '@material-ui/core';
import InvestmentFlow from './DealFlow'

import "./style.scss"

const GET_PUBLIC_DEAL = gql`
  query PublicDeal($company_name: String!, $invite_code: String!) {
    publicDeal(company_name: $company_name, invite_code: $invite_code) {
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

export default function PublicDeal () {
  const params = useParams()
  const location = useLocation()
  const history = useHistory()
  const [error, setError] = useState(null)
  const [getDeal, { data, error: apiError, refetch, called }] = useLazyQuery(GET_PUBLIC_DEAL)
  const [createInvestment] = useMutation(CREATE_INVESTMENT, { onCompleted: () => refetch() })

  useEffect(() => {
    const { invite_code } = queryString.parse(location.search)
    if (invite_code) {
      getDeal({ variables: { company_name: params.company_name, invite_code }})
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
        </Col>
      </Row>
    </div>
  )
}