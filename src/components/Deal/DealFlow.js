import React, { useState, useEffect } from 'react'
import Loader from '../utils/Loader'
import _ from "lodash"
import { gql } from 'apollo-boost'
import { useParams, useHistory, Link } from 'react-router-dom'
import { nWithCommas } from '../../utils/numbers'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paper, TextField } from '@material-ui/core';

export default function InvestmentFlow ({ investment, deal, investor }) {
  const [status, setStatus] = useState("data-room")

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
          <div onClick={() => setStatus('invited')} 
            className={`step step-data-room ${status === "invited" ? "step-active" : ""}`}>Data Room</div>
          <div onClick={() => setStatus('pledging')} 
            className={`step step-pledge ${status === "pledging" ? "step-active" : ""}`}>Pledge</div>
          <div onClick={() => setStatus('pledged')}
            className={`step step-onboard ${status === "pledged" ? "step-active" : ""}`}>Sign</div>
          <div onClick={() => setStatus('onboarded')}
            className={`step step-wire ${status === "onboarded" ? "step-active" : ""}`}>Wire</div>
        </div>
        {status === "invited" && <DataRoom deal={deal} />}
        {status === "pledged" && <Onboarding investment={investment} deal={deal} investor={investor} />}
        {status === "pledging" && <Pledging investment={investment} deal={deal} />}
        {status === "onboarded" && <Wire investment={investment} deal={deal} />}
      </Paper>
    </React.Fragment>
  )
}

function DataRoom ({ deal }) {
  return (
    <div className="deal-data-room">
      {(deal.documents || []).filter(d => d.path !== "wire-instructions").map(doc => (
        <span key={doc.path}>
          <a href={`https://${doc.link}`} target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon="link" /> {doc.path}</a>
        </span>
      ))}
      {deal.memo && <div className="deal-memo"><b>{deal.memo}</b></div>}
    </div>
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
        <div>You have been invited to participate in this deal!<br />Please review the signing docs and wire details below.</div>
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

const defaultWireLink = "https://allocations-public.s3.us-east-2.amazonaws.com/wire_instructions.pdf"
function Wire ({ investment, deal }) {
  const link = deal.documents && deal.documents.find(d => d.path === "wire-instructions") 
    ? "https://" + deal.documents.find(d => d.path === "wire-instructions").link
    : defaultWireLink

  return (
    <div className="pledging">
      <div className="pledge-link">
        <div style={{marginBottom: "15px"}}>
          <FontAwesomeIcon icon={["far", "file-pdf"]} />
          <a href={link} target="_blank" rel="noopener noreferrer">Wire Instructions</a>
        </div>
        <div className="embed-responsive embed-responsive-1by1">
          <iframe className="embed-responsive-item" title="Onboarding Document" src={link}></iframe>
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