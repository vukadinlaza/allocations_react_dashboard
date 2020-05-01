import React, { useState, useEffect } from 'react'
import Loader from '../utils/Loader'
import _ from "lodash"
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'
import { useParams, useHistory, Link, useLocation } from 'react-router-dom'
import { nWithCommas } from '../../utils/numbers'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paper, TextField, Button, Table, TableBody, TableCell, TableRow, TableHead } from '@material-ui/core';
import ReactHtmlParser from 'react-html-parser';
import Chart from 'chart.js'
import KYC from '../forms/KYC'

function getOnboardingLinkType (link) {
  try {
    const url = new URL(link)
    if (url.hostname === "na3.docusign.net") {
      return "docusign"
    } else if (url.hostname === "app.hellosign.com") {
      return "hellosign"
    }
  } catch (e) {
    return "docusign"
  }
}

export default function InvestmentFlow ({ investment, deal, investor, refetch }) {
  const [status, setStatus] = useState("invited")

  useEffect(() => {
    // if just invited show data room otherwise show pledge page first
    if (investment) {
      if (investment.status === "invited") {
        setStatus("invited")
      } else {
        setStatus("pledging")
      }
    }
  }, [investment])

  if (!investment) return <Paper style={{padding: "25px"}}><Loader /></Paper>

  if (status === "complete") {
    return <CompleteInvestment investment={investment} />
  }

  const onboardingLinkType = getOnboardingLinkType(deal.onboarding_link)
  return (
    <React.Fragment>
      <InvestmentOverview investment={investment} />
      <Paper className="flow tile">
        <div className="flow-steps">
          <div onClick={() => setStatus('invited')} 
            className={`step step-data-room ${status === "invited" ? "step-active" : ""}`}>Data Room</div>
          <div onClick={() => setStatus('pledging')} 
            className={`step step-pledge ${status === "pledging" ? "step-active" : ""}`}>Pledge</div>
          {/**<div onClick={() => setStatus('kyc')}
            className={`step step-pledge ${status === "kyc" ? "step-active" : ""}`}>KYC</div>**/}
          <div onClick={() => setStatus('pledged')}
            className={`step step-onboard ${status === "pledged" ? "step-active" : ""}`}>Sign</div>
          <div onClick={() => setStatus('onboarded')}
            className={`step step-wire ${status === "onboarded" ? "step-active" : ""}`}>Wire</div>
        </div>
        {status === "invited" && <DataRoom deal={deal} />}
        {status === "pledging" && <Pledging investment={investment} investor={investor} deal={deal} refetch={refetch} />}
        {status === "kyc" && <KYC investor={investor} setStatus={setStatus} />}
        {status === "onboarded" && <Wire investment={investment} deal={deal} />}

        {/** Always render Onboarding so that the Docusign loads in... **/}
        {onboardingLinkType === "docusign" && <Onboarding status={status} investment={investment} deal={deal} investor={investor} />}
        {onboardingLinkType === "hellosign" && <HelloSignOnboarding status={status} investment={investment} deal={deal} investor={investor} />}
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
      {deal.memo && <div className="deal-memo">{ReactHtmlParser(deal.memo)}</div>}
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

function Wire ({ investment, deal }) {
  const link = deal.documents && deal.documents.find(d => d.path === "wire-instructions") 
    ? "https://" + deal.documents.find(d => d.path === "wire-instructions").link
    : null

  if (!link) {
    return <div className="wire" style={{padding: "20px"}}>Contact For Wire Details</div>
  }

  return (
    <div className="wire">
      <div className="crypto-wire">
        If you would like to wire with crypto contact us on Slack
      </div>
      <div className="wire-link">
        <div style={{marginBottom: "15px"}}>
          <FontAwesomeIcon icon={["far", "file-pdf"]} />
          <a href={link} target="_blank" rel="noopener noreferrer">Wire Instructions</a>
        </div>
        <div className="wire-doc-iframe">
          <div className="embed-responsive embed-responsive-1by1">
            <iframe className="embed-responsive-item" title="Onboarding Document" src={link}></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}

function PledgingLegacy ({ deal }) {
  return (
    <div className="pledging">
      <div className="pledge-link">
        <img src="https://img.icons8.com/color/48/000000/google-sheets.png" />
        <a href={deal.pledge_link} target="_blank" rel="noopener noreferrer">Pledge Document</a>
      </div>
    </div>
  )
}

const PLEDGE = gql`
  mutation Pledge($investment: InvestmentInput!) {
    updateInvestment(investment: $investment) {
      _id
      amount
      status
    }
  }
`

function Pledging ({ investment, deal, refetch, investor }) {
  const [amount, setAmount] = useState("")
  const [updateInvestment, { data, error }] = useMutation(PLEDGE, {
    onCompleted: refetch
  })

  useEffect(() => {
    setAmount(investment.amount || "")
  }, [])

  const updateAmount = e => {
    const val = e.target.value
    if (!isNaN(Number(val))) setAmount(val)
  }

  const submit = () => {
    // TODO - check that its over the min investment (if min investment exists)

    updateInvestment({ variables: {
      investment: {..._.omit(investment, '__typename'), status: "pledged", amount: Number(amount) }
    }})
  }

  const unpledge = () => {
    updateInvestment({ variables: {
      investment: {..._.omit(investment, '__typename'), status: "invited", amount: null }
    }})
  }

  // if no investor just show doc
  const noInvestor = !investor || _.isEmpty(investor)

  // old deal is deal created before May, 1
  const oldDeal = !deal.created_at || deal.created_at < 1588334400000
  if (oldDeal) {
    return (
      <div className="pledging">
        <PledgingLegacy deal={deal} />
      </div>
    )
  }

  if (noInvestor) {
    return (
      <div className="pledging">
        <div className="pledge-data">
          <PledgesViz deal={deal} />
          <PledgesTable deal={deal} />
        </div>
        <hr />
        <PledgingLegacy deal={deal} />
      </div>
    )
  }

  return (
    <div className="pledging">
      <div className="pledge-data">
        <PledgesViz deal={deal} />
        <PledgesTable deal={deal} />
      </div>

      <hr />

      {investment.status === "invited" && 
        <div className="pledging-form">
          <TextField variant="outlined" className="pledge-amount" label="Pledge Amount" value={amount} onChange={updateAmount} />
          <Button variant="contained" className="pledge-btn" color="secondary" onClick={submit}>Pledge</Button>
        </div>
      }
      {investment.status !== "invited" &&
        <div className="edit-pledge">
          <TextField variant="outlined" className="pledge-amount" label="Pledge Amount" value={amount} onChange={updateAmount} />
          <Button variant="contained" className="edit-btn" color="primary" onClick={submit}>Edit</Button>
          <Button variant="contained" className="unpledge-btn" color="secondary" onClick={unpledge}>Unpledge</Button>
        </div>
      }
      <hr />

      <div>or pledge via spreadsheet</div>

      <PledgingLegacy deal={deal} />
    </div>
  )
}

function PledgesTable ({ deal }) {
  if (!deal.pledges) return null

  return (
    <Paper className="pledges-table">
      <Table size="small">  
        <TableBody>
          {deal.pledges.map(pledge => (
            <TableRow key={pledge.timestamp}>
              <TableCell>{pledge.initials}</TableCell>
              <TableCell>${nWithCommas(pledge.amount)}</TableCell>
            </TableRow>
          ))}
          <TableRow className="total">
            <TableCell>Total</TableCell>
            <TableCell>${nWithCommas(_.sumBy(deal.pledges, 'amount'))}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  )
}

function PledgesViz ({ deal }) {
  const pledges = _.get(deal, 'pledges', null)

  useEffect(() => {
    if (!pledges || pledges.length === 0) return

    const ctx = document.getElementById('pledges-viz').getContext('2d')
    let formatted = []
    deal.pledges.reduce((acc, p) => {
      formatted.push({ timestamp: Number(p.timestamp), amount: acc + p.amount })
      return acc + p.amount
    }, 0)

    // pop a 0 on 1 day before first pledge
    formatted.unshift({ timestamp: formatted[0].timestamp - (60000 * 60 * 24), amount: 0 })
    formatted = _.orderBy(formatted, '')

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: formatted.map(p => new Date(p.timestamp).toLocaleString({}, { dateStyle: "short" })),
        datasets: [{
          backgroundColor: '#e6f9f3',
          borderColor: '#21ce99',
          data: formatted.map(p => {
            return { x: new Date(p.timestamp), y: p.amount }
          })
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              callback: (label, index, labels) => `$${nWithCommas(label)}`
            }
          }]
        }
      }
    })
  }, [deal])

  if (!pledges || pledges.length === 0) {
    return (
      <div className="pledges-viz-wrapper no-pledges">
        <p>No Pledges yet, be the first to pledge to {deal.company_name}!</p>
      </div>
    )
  }

  return <div className="pledges-viz-wrapper"><canvas id="pledges-viz" /></div>
}

function HelloSignOnboarding ({ investment, deal, investor, status }) {
  const location = useLocation()

  if (!investor) return <Loader />

  return (
    <div className={status === "pledged" ? "document-iframe" : "document-iframe hide"}>
      <div className="external-sign-link">
        <a href={deal.onboarding_link} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon="signature" /> Onboarding Document
        </a>
      </div>
    </div>
  )
}

function Onboarding ({ investment, deal, investor, status }) {
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 5000)
  }, [])

  if (!deal.onboarding_link) {
    return (
      <div className="waiting tile" style={{display: status === "pledged" ? "block" : "none"}}>Hang tight! ⌛<br/>Onboarding link coming soon</div>
    )
  }

  if (!investor) return <Loader />

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

  const link = location.pathname.includes('/public/')
    ? deal.onboarding_link
    : `${deal.onboarding_link}&${urlParameters}`

  return (
    <div className={status === "pledged" ? "document-iframe" : "document-iframe hide"}>
      {loading && <div className="temp-loader"><Loader /></div>}
      <div className="external-sign-link">
        <a href={link} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon="signature" /> Open Directly
        </a>
      </div>
      <div className="embed-responsive embed-responsive-1by1">
        <iframe className="embed-responsive-item" title="Wire Instructions" src={link}></iframe>
      </div>
    </div>
  )
}