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
        _id
        company_name
        company_description
        date_closed
        deal_lead
        pledge_link
        onboarding_link
        status
        closed
        investment {
          _id
          amount
          status
        }
      }
    } 
  }
`

export default function Deal () {
  const params = useParams()
  // const [deal, setDeal] = useState(null)
  // const [investor, setInvestor] = useState(null) 
  // const [investment, setInvestment] = useState(null)
  const { data, error, loading } = useQuery(GET_INVESTOR_DEAL, { variables: { company_name: params.id }})
  const [dealCompletion, setDealCompletion] = useState(0)

  useEffect(() => {
    if (data && !dealCompletion) {
      setDealCompletion(60)
    }
  }, [data])

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

function InvestmentFlow ({ investment, deal, investor }) {
  if (!investment) return <Paper style={{padding: "25px"}}><Loader /></Paper>

  // const { status } = investment
  const status = "pledged"

  return (
    <React.Fragment>
        <Paper className="investment tile" style={{marginBottom: "10px"}}>
          <div className="small-header">My Investment</div>
          <span className="investment-amount">$10,000</span>
          {status !== "viewed" && <span className={`investment-status investment-${status}`}>{(status || "").toUpperCase()}</span>}
        </Paper>
      <Paper className="flow tile">
        <div className="flow-steps">
          <div className={`step step-pledge ${status === "viewed" ? "step-active" : ""}`}>Pledge</div>
          <div className={`step step-onboard ${status === "pledged" ? "step-active" : ""}`}>Onboard</div>
          <div className={`step step-wire ${status === "onboarded" ? "step-active" : ""}`}>Wire</div>
        </div>
        {status === "pledged" && <Onboarding investment={investment} deal={deal} investor={investor} />}
        {status === "viewed" && <Pledging investment={investment} deal={deal} />}
        {status === "onboarded" && <Wire investment={investment} deal={deal} />}
      </Paper>
    </React.Fragment>
  )
}

function Wire ({ investment, deal }) {
  return (
    <div className="pledging">
      <div className="pledge-link">
        <FontAwesomeIcon icon={["far", "file-pdf"]} />
        <a href={deal.wire_link || "#"} target="_blank">Wire Instructions</a>
      </div>
    </div>
  )
}

function Pledging ({ investment, deal }) {
  return (
    <div className="pledging">
      <div className="pledge-link">
        <img src="https://img.icons8.com/color/48/000000/google-sheets.png" />
        <a href={deal.pledge_link} target="_blank">Pledge Document</a>
      </div>
    </div>
  )
}

const investorParams = ["country_of_residence"]

function Onboarding ({ investment, deal, investor }) {
  if (!deal.onboarding_link) {
    return (
      <div className="waiting tile">Hang tight! ⌛<br/>Onboarding link coming soon</div>
    )
  }

  if (!investor) return <Loader />

  // const params = {
  //   // Member_Type: investor.investor_type,
  //   Member_Email: investor.email,
  //   Member_country_of_residence: investor.country
  //   // Member_Subscriber_name: investor.
  // }
  // let urlParameters = Object.entries(params).map(e => e.join('=')).join('&')
  // console.log(deal.onboarding_link)

  return (
    <div className="document-iframe">
      <div className="iframe-container">
        <iframe src={deal.onboarding_link} />
      </div>
    </div>
  )
}



