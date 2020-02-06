import React, { useEffect, useState } from 'react'
import Loader from '../utils/Loader'
import _ from "lodash"
import { gql } from 'apollo-boost'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { Row, Col } from "reactstrap";
import { useAuth0 } from "../../react-auth0-spa";
import { nWithCommas } from '../../utils/numbers'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paper, TextField } from '@material-ui/core';
import InvestmentFlow from './DealFlow'

import "./style.scss"

const GET_INVESTOR_DEAL = gql`
  query Deal($company_name: String!) {
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
      invitedDeal(company_name: $company_name) {
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

export default function Deal () {
  const params = useParams()
  const history = useHistory()
  const { user, isAuthenticated, loading } = useAuth0()
  const [getDeal, { data, error, refetch, called }] = useLazyQuery(GET_INVESTOR_DEAL)
  const [createInvestment] = useMutation(CREATE_INVESTMENT, { onCompleted: () => refetch() })

  const [dealCompletion, setDealCompletion] = useState(0)

  useEffect(() => {
    if (data && !dealCompletion) {
      setDealCompletion(60)
    }
  }, [data])

  useEffect(() => {
    if (!loading && isAuthenticated && !called) {
      getDeal({ variables: { company_name: params.id }})
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
    if (error && error.message === "GraphQL error: REDIRECT") return history.push(`/`)
    if (error && user) refetch()
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



