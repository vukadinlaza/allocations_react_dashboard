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
            {/**<PledgeChart sheet={deal.pledge_link} />**/}
            {/**<div className="small-header">Round Filled</div>
            <Paper className="closing-date">
              <LinearProgress style={{height: "25px"}} variant="determinate" value={dealCompletion} color="secondary" />
            </Paper>**/}
            <div className="small-header">Closing Date</div>
            <Paper className="closing-date">
              <FontAwesomeIcon icon="clock" size="lg" />
              <span>{deal.date_closed}</span>
            </Paper>
            <div className="small-header">Lead</div>
            <Paper className="deal-lead">
              {/**<Gravatar
                email="hanspaulpizzinini@gmail.com"
                default="Profile"
                className="nav-user-profile rounded-circle"
                width="50"
              />**/}
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

function InvestmentFlow ({ investment, deal, investor }) {
  const [status, setStatus] = useState(null)

  useEffect(() => {
    if (investment) setStatus(investment.status)
  }, [investment])

  if (!investment) return <Paper style={{padding: "25px"}}><Loader /></Paper>

  if (status === "complete") {
    return <CompleteInvestment investment={investment} />
  }

  return (
    <React.Fragment>
      <InvestmentOverview investment={investment} />
      <Paper className="flow tile">
        <div className="flow-steps">
          {/**<div onClick={() => setStatus('viewing')} 
            className={`step step-pledge ${status === "viewing" ? "step-active" : ""}`}>Data Room</div>**/}
          <div onClick={() => setStatus('invited')} 
            className={`step step-pledge ${status === "invited" ? "step-active" : ""}`}>Pledge</div>
          <div onClick={() => setStatus('pledged')}
            className={`step step-onboard ${status === "pledged" ? "step-active" : ""}`}>Sign</div>
          <div onClick={() => setStatus('onboarded')}
            className={`step step-wire ${status === "onboarded" ? "step-active" : ""}`}>Wire</div>
        </div>
        {status === "pledged" && <Onboarding investment={investment} deal={deal} investor={investor} />}
        {status === "invited" && <Pledging investment={investment} deal={deal} />}
        {status === "onboarded" && <Wire investment={investment} deal={deal} />}
      </Paper>
    </React.Fragment>
  )
}

function CompleteInvestment ({ investment }) {
  return (
    <InvestmentOverview investment={investment} />
  )
}

function InvestmentOverview ({ investment }) {
  if (investment.status === "invited") {
    return (
      <Paper className="tile investment-invited">
        <div>You've been invited to participate in this deal!<br />If you'd like to invest please fill out the pledging spreadsheet</div>
      </Paper>
    )
  }

  return (
    <Paper className="investment tile" style={{marginBottom: "10px"}}>
      <div className="small-header">My Investment</div>
      <span className="investment-amount">{investment.amount ? "$" + nWithCommas(investment.amount) : ""}</span>
      <span className={`investment-status investment-${investment.status}`}>{(investment.status || "").toUpperCase()}</span>
    </Paper>
  )
}

const wireLink = "https://allocations-public.s3.us-east-2.amazonaws.com/wire_instructions.pdf"
function Wire ({ investment, deal }) {
  return (
    <div className="pledging">
      <div className="pledge-link">
        <div style={{marginBottom: "15px"}}>
          <FontAwesomeIcon icon={["far", "file-pdf"]} />
          <a href={wireLink} target="_blank" rel="noopener noreferrer">Wire Instructions</a>
        </div>
        <div className="embed-responsive embed-responsive-1by1">
          <iframe className="embed-responsive-item" title="Onboarding Document" src={wireLink}></iframe>
        </div>
      </div>
    </div>
  )
}

function Pledging ({ investment, deal }) {
  return (
    <div className="pledging">
      <div className="pledge-link">
        <img src="https://img.icons8.com/color/48/000000/google-sheets.png" />
        <a href={deal.pledge_link} target="_blank" rel="noopener noreferrer">Pledge Document</a>
      </div>
    </div>
  )
}

function Onboarding ({ investment, deal, investor }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 5000)
  }, [])

  if (!deal.onboarding_link) {
    return (
      <div className="waiting tile">Hang tight! ⌛<br/>Onboarding link coming soon</div>
    )
  }

  if (!investor) return <Loader />

  deal.onboarding_link = "https://na3.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=ea036281-201e-495f-aae3-e032bb40dd75&env=na3-eu1&acct=97ababd0-ed90-438a-a2c7-7162a7aa3d64"

  const params = {
    Member_Type: _.upperFirst(investor.investor_type),
    Member_Email: investor.email,
    "Name 7a634dac-6bba-4543-83c0-2aed22ddd047": investor.signer_full_name,
    "Country of residence": investor.country,
    "subscriber name": investor.name
  }

  const investorStatus = investor.accredited_investor_status
  switch (investor.investor_type) {
    case "entity": {
      params["Accredited Entity"] = investorStatus
      break
    }
    case "individual": {
      params["Accredited individual"] = investorStatus
      break
    }
    default: {
      break
    }
  }

  let urlParameters = Object.entries(params)
    .map(e => e.map(encodeURI).join("=")).join('&')

  return (
    <div className="document-iframe">
      {loading && <div className="temp-loader"><Loader /></div>}
      <div className="external-sign-link">
        <a href={`${deal.onboarding_link}&${urlParameters}`} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon="signature" /> Open Directly
        </a>
      </div>
      <div className="embed-responsive embed-responsive-1by1">
        <iframe className="embed-responsive-item" title="Wire Instructions" src={`${deal.onboarding_link}&${urlParameters}`}></iframe>
      </div>
    </div>
  )
}



