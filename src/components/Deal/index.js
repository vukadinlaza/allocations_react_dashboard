import React, { useEffect, useState } from 'react'
import Loader from '../utils/Loader'
import { gql } from 'apollo-boost'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks';
import { Container, Row, Col } from "reactstrap";
import Gravatar from "react-gravatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table, TableBody, TableCell, TableRow, TableHead, Paper, LinearProgress } from '@material-ui/core';

import "./style.scss"

const GET_INVESTOR_DEAL = gql`
  query Deal($company_name: String!) {
    investor {
      _id
      first_name
      last_name
      entity_name
      country
      investor_type
      signer_full_name
      accredited_investor_status
      email
      invitedDeal(company_name: $company_name) {
        company_name
        company_description
        date_closed
        deal_lead
        pledge_link
        onboarding_link
        status
        closed
      }
    } 
  }
`

export default function Deal () {
  const params = useParams()
  const [deal, setDeal] = useState(null) 
  const { data, error, loading } = useQuery(GET_INVESTOR_DEAL, { variables: { company_name: params.id }})
  const [dealCompletion, setDealCompletion] = useState(0)

  useEffect(() => {
    if (deal && !dealCompletion) {
      setDealCompletion(60)
    }
  }, [deal])

  useEffect(() => {
    if (data && !deal) setDeal(data.investor.invitedDeal)
  }, [deal, data])

  if (!deal) return <Loader />

  return (
    <div className="Deal">
      <h2 className="deal-header">{deal.company_name}</h2>
      <h4 className="deal-description">{deal.company_description}</h4>

      <Row>
        <Col sm="8">
          <Paper className="investment-flow tile">
            <Paper className="investment tile" style={{marginBottom: "10px"}}>
              <div className="small-header">My Investment</div>
              <span className="investment-amount">$10,000</span>
              <span className={`investment-status investment-${"pledged"}`}>PLEDGED</span>
            </Paper>

            <InvestmentFlow investment={{status: "pledged"}} deal={deal} />
          </Paper>
        </Col>
        <Col sm="4">
          <Paper className="investment-details tile">
            <div className="small-header">Round Filled</div>
            <Paper className="closing-date">
              <LinearProgress style={{height: "25px"}} variant="determinate" value={dealCompletion} color="secondary" />
            </Paper>
            <div className="small-header">Closing Date [tentative]</div>
            <Paper className="closing-date">
              <FontAwesomeIcon icon="clock" size="lg" />
              <span>January 12</span>
            </Paper>
            <div className="small-header">Lead</div>
            <Paper className="deal-lead">
              <Gravatar
                email="hanspaulpizzinini@gmail.com"
                default="Profile"
                className="nav-user-profile rounded-circle"
                width="50"
              />
              <span>Hans Pizzinini</span>
            </Paper>
          </Paper>
        </Col>
      </Row>
    </div>
  )
}

function InvestmentFlow ({ investment, deal }) {
  console.log(deal.onboarding_link)
  const status = "onboarding"
  return (
    <Paper className="flow tile">
      <div className="flow-steps">
        <div className={`step step-pledge ${status === "pledge" ? "step-active" : ""}`}>Pledge</div>
        <div className={`step step-onboard ${status === "onboarding" ? "step-active" : ""}`}>Onboard</div>
        <div className={`step step-wire ${status === "wire" ? "step-active" : ""}`}>Wire</div>
      </div>
      <div className="document-iframe">
        <div className="iframe-container">
          <iframe src={deal.onboarding_link} />
        </div>
      </div>
    </Paper>
  )
}



