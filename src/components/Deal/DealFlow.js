import React, { useState, useEffect } from 'react'
import Loader from '../utils/Loader'
import _ from "lodash"
import { gql } from 'apollo-boost'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useParams, useHistory, Link, useLocation } from 'react-router-dom'
import { nWithCommas } from '../../utils/numbers'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Paper,
  Grid,
  TextField,
  Button,
  ButtonBase,
  Table,
  TableBody,
  ButtonGroup,
  TableCell,
  TableRow,
  Typography,
  TableHead
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';

import ReactHtmlParser from 'react-html-parser';
import Chart from 'chart.js'
import classNames from 'classnames'
import DocusignKYCEmbeddedForm from '../forms/kycTab'
import { makeStyles } from "@material-ui/core/styles";

/***
 *
 * All the pieces of the deal flow
 * which includes showing the deal data room
 * the pledging chart/actions
 * the embedded docusign onboarding document
 * the wiring document
 *
 **/

export const DEAL_INVESTMENTS = gql`
  query deal($_id: String!) {
    deal(_id: $_id) {
      _id
      investments {
          status
          amount
          investor {
              _id
              email
              documents
          }
        documents {
          link
          path
        }
      }
    }
  }
`

function getOnboardingLinkType(link) {
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

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    backgroundColor: "#f9fbfb",
  },
  divider: {
    margin: "16px -16px"
  },
  tabs: {
    borderTop: "1px solid #dfe3e9",
    borderBottom: "1px solid #dfe3e9",
    background: "#f7f9fa",
    minHeight: 44,
    margin: "40px 0",
  },
  text: {
    color: "#7f8ea3"
  },
  tab: {
    height: 75,
    width: "100%"
  },
  activeTab: {
    height: 75,
    width: "100%",
    borderBottom: "3px solid #205DF5",
    outline: "0 !important",
  },
  button: {
    margin: ".5rem"
  }
}));

export default function InvestmentFlow({ investment, deal, investor, refetch }) {
  const [status, setStatus] = useState("invited")
  const classes = useStyles();

  const onboardingLinkType = getOnboardingLinkType(deal.onboarding_link) || 'docusign'
  const { approved } = deal
  const hasSigned = investment?.status === 'signed' || investment?.status === 'wired' || investment?.status === 'complete'
  const hasWired = investment?.status === 'wired' || investment?.status === 'complete'
  const docs = _.get(investor, 'documents') || []
  const hasKyc = docs.find(d => d.documentName && (d.documentName.includes('W-8') || d.documentName.includes('W-9')))  return (
    <React.Fragment>
      {/* <InvestmentOverview investment={investment}/> */}

      <div className={classes.tabs}>
        <Grid container justify="center">
          <Grid item xs={12} sm={3}>
            <ButtonBase className={status === "invited" ? classes.activeTab : classes.tab}
              style={{ borderRight: "1px solid #e1e9ec" }}
              onClick={() => setStatus('invited')}>
              Data Room {investment && <CheckIcon color="secondary" style={{ marginLeft: '0.5rem' }} />}
            </ButtonBase>
          </Grid>
          {/* <Grid item xs={12} sm={3}>
          <ButtonBase className={status === "pledging" ? classes.activeTab : classes.tab}
                      style={{borderRight: "1px solid #e1e9ec"}}
                      onClick={() => setStatus('pledging')}>
            Pledge
          </ButtonBase>
        </Grid> */}

          <Grid item xs={12} sm={3}>
            <ButtonBase className={status === "pledged" ? classes.activeTab : classes.tab}
              style={{ borderRight: "1px solid #e1e9ec", cursor: approved ? "cursor" : "not-allowed" }}
              onClick={() => approved && setStatus('pledged')}>
              Sign {!approved && <FontAwesomeIcon icon="lock" />} {hasSigned && <CheckIcon color="secondary" style={{ marginLeft: '0.5rem' }} />}
            </ButtonBase>
          </Grid>

          <Grid item xs={12} sm={3}>
            <ButtonBase className={status === "kyc" ? classes.activeTab : classes.tab}
              style={{ borderRight: "1px solid #e1e9ec", cursor: approved ? "cursor" : "not-allowed" }}
              onClick={() => approved && setStatus('kyc')}>
              KYC {!approved && <FontAwesomeIcon icon="lock" />} {hasKyc && <CheckIcon color="secondary" style={{ marginLeft: '0.5rem' }} />}
            </ButtonBase>
          </Grid>

          <Grid item xs={12} sm={3}>
            <ButtonBase className={status === "onboarded" ? classes.activeTab : classes.tab}
              style={{ cursor: approved ? "cursor" : "not-allowed" }}
              onClick={() => approved && setStatus('onboarded')}>
              Wire {!approved && <FontAwesomeIcon icon="lock" />} {hasWired && <CheckIcon color="secondary" style={{ marginLeft: '0.5rem' }} />}
            </ButtonBase>
          </Grid>
        </Grid>
      </div>

      <>
        {status === "invited" && <DataRoom deal={deal} />}
        {status === "pledging" && <Pledging investment={investment} investor={investor} deal={deal} refetch={refetch} />}
        {status === "onboarded" && <Wire investment={investment} deal={deal} />}
        {/** Always render Onboarding so that the Docusign loads in... **/}
        {(onboardingLinkType === "docusign" && status === 'pledged') &&
          < Onboarding status={status} investment={investment} deal={deal} investor={investor} />}
        {status === 'kyc' && <KYCDocusign status={status} investment={investment} deal={deal} investor={investor} />}
        {onboardingLinkType === "hellosign" &&
          <HelloSignOnboarding status={status} investment={investment} deal={deal} investor={investor} />}
      </>
    </React.Fragment>
  )
}

function DataRoom({ deal }) {
  return (
    <div className="deal-data-room">
      {(deal.documents || []).filter(d => d.path !== "wire-instructions").map(doc => (
        <span key={doc.path}>
          <a href={`https://${doc.link}`} target="_blank" rel="noopener noreferrer"><FontAwesomeIcon
            icon="link" /> {doc.path}</a>
        </span>
      ))}
      {deal.memo && <div className="deal-memo">{ReactHtmlParser(deal.memo)}</div>}
    </div>
  )
}

function CompleteInvestment({ investment }) {
  return (
    <InvestmentOverview investment={investment} />
  )
}

function InvestmentOverview({ investment }) {
  if (investment.status === "invited") {
    return (
      <Paper className="tile investment-invited">
        <div>You have been invited to participate in this deal!<br />Please review the signing docs and wire details
          below.
        </div>
      </Paper>
    )
  }

  return (
    <Paper className="investment tile" style={{ marginBottom: "10px" }}>
      <div className="small-header">My Investment</div>
      <span className="investment-amount">{investment.amount ? "$" + nWithCommas(investment.amount) : ""}</span>
      <span
        className={`investment-status investment-${investment.status}`}>{(investment.status || "").toUpperCase()}</span>
    </Paper>
  )
}

function Wire({ investment, deal }) {
  const link = deal.documents && deal.documents.find(d => d.path === "wire-instructions")
    ? "https://" + deal.documents.find(d => d.path === "wire-instructions").link
    : null

  if (!link) {
    return <div className="wire" style={{ padding: "20px" }}>Contact For Wire Details</div>
  }

  return (
    <div className="wire" style={{ textAlign: "center" }}>
      <div className="banner same-user-warning">Please ensure to wire from the same entity you have signed from.</div>
      <div className="wire-link">
        <div style={{ marginBottom: "15px" }}>
          <FontAwesomeIcon icon={["far", "file-pdf"]} />
          <a href={link} target="_blank" rel="noopener noreferrer"> Wire Instructions</a>
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

function PledgingLegacy({ deal }) {
  return (
    <a href={deal.pledge_link} target="_blank" rel="noopener noreferrer">
      <svg style={{ height: 18, margin: "0 8px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3800 4800">
        <g>
          <path fill="#0F9D57" d="M0 4800h3800V840L2960 0H0" />
          <path fill="#57BB8A" d="M2960 840h840L2960 0" />
          <path fill="#098540" d="M3800 1680V840h-840" />
        </g>
        <g>
          <path fill="#FFF"
            d="M1695 2822h1023v424H1695v-424zm-635 0h459v424h-459v-424zm635-635h1023v459H1695v-459zm-635 0h459v459h-459v-459zm635-599h1023v458H1695v-458zm-635 0h459v458h-459v-458zM884 3422h2011V1411H884v2011z" />
        </g>
      </svg>
      <strong style={{ color: "#4bc076" }}>
        Pledge Document
      </strong>
    </a>
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

function Pledging({ investment, deal, refetch, investor }) {
  const [amount, setAmount] = useState("")
  const classes = useStyles();
  const [updateInvestment, { data, error }] = useMutation(PLEDGE, {
    onCompleted: refetch
  })

  useEffect(() => {
    setAmount(investment.amount || "")
  }, [investment.amount])

  const updateAmount = e => {
    const val = e.target.value
    if (!isNaN(Number(val))) setAmount(val)
  }

  const submit = () => {
    // TODO - check that its over the min investment (if min investment exists)

    updateInvestment({
      variables: {
        investment: { ..._.omit(investment, '__typename'), status: "pledged", amount: Number(amount) }
      }
    })
  }

  const unpledge = () => {
    updateInvestment({
      variables: {
        investment: { ..._.omit(investment, '__typename'), status: "invited", amount: null }
      }
    })
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
    <>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <Paper className={classes.paper}>
            {investment.status === "invited" &&
              <>
                <TextField fullWidth variant="outlined" style={{ marginBottom: 16 }} label="Pledge Amount" value={amount}
                  onChange={updateAmount} />
                <Button size="large" fullWidth variant="contained" color="primary" onClick={submit}>Pledge</Button>

                <Typography variant="body2" className={classes.text}
                  style={{ marginTop: 8, textAlign: "center", lineHeight: "34px" }}>or <br />
                pledge via spreadsheet <PledgingLegacy
                    deal={deal} />

                </Typography>

              </>
            }
            {investment.status !== "invited" &&
              <>
                <TextField fullWidth variant="outlined" className="pledge-amount" label="Pledge Amount" value={amount}
                  onChange={updateAmount} />
                <ButtonGroup style={{ marginTop: 16 }}>
                  <Button variant="contained" color="primary" onClick={submit}>Edit</Button>
                  <Button color="primary" onClick={unpledge}>Unpledge</Button>
                </ButtonGroup>
              </>
            }
          </Paper>

          <PledgesViz deal={deal} />

        </Grid>

        <Grid item xs={12} sm={5}>
          <PledgesTable deal={deal} />
        </Grid>

      </Grid>
    </>
  )
}

function PledgesTable({ deal }) {
  const classes = useStyles();

  if (!deal.pledges) return null

  return (
    <Paper className={classes.paper}>
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

function PledgesViz({ deal }) {
  const classes = useStyles();
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
  }, [deal, pledges])

  if (!pledges || pledges.length === 0) {
    return (
      <div style={{ marginTop: 16, textAlign: "center" }}><small>
        No graph available yet, be the first to pledge to {deal.company_name}!
      </small>
      </div>
    )
  }

  return <Paper className={classes.paper} style={{ marginTop: 16 }}>
    <canvas id="pledges-viz" />
  </Paper>
}

function HelloSignOnboarding({ investment, deal, investor, status }) {
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

function filename(path) {
  try {
    return path.split('/')[2]
  } catch {
    return path
  }
}

function Onboarding({ investment, deal, investor, status }) {
  const [loading, setLoading] = useState(true)
  const [signed, setSigned] = useState(false)
  const classes = useStyles()
  const location = useLocation()
  const { data, } = useQuery(DEAL_INVESTMENTS, {
    variables: { _id: deal._id },
    pollInterval: 1000
  })

  const hasSigned = data?.deal?.investments.find(inv => (inv.status === 'signed' && inv?.investor?._id === investor?._id))

  const doc = _.get(hasSigned, 'documents[0]')

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  useEffect(() => {
    if (hasSigned) {
      setSigned(true)
    }
  }, [hasSigned])

  if (!deal.onboarding_link) {
    return (
      <div style={{ display: status === "pledged" ? "block" : "none" }}>Hang tight! ⌛<br />Onboarding
        link coming soon</div>
    )
  }

  if (!investor) return <Loader />

  const params = {
    userEmail: investor.email,
  }

  let urlParameters = Object.entries(params)
    .map(e => e.map(encodeURI).join("=")).join('&')

  let link = location.pathname.includes('/public/')
    ? deal.onboarding_link
    : `${deal.onboarding_link}&${urlParameters}`

  if (deal.onboarding_link.includes('demo')) {
    link = `${deal.onboarding_link}&${urlParameters}`
  }

  if (signed) return (
    <Paper className={classes.paper}>
      <Typography variant="subtitle1">
        Thanks for signing! You can view your signed documents below.
      </Typography>
      <Typography variant="subtitle2">
        <span><a href={`https://${doc.link}`} target="_blank"
          rel="noopener noreferrer">{filename(doc.path)}</a></span>      </Typography>
    </Paper>)
  return (
    <div className={status === "pledged" ? "document-iframe" : "document-iframe hide"}>
      {loading && <div className="temp-loader"><Loader /></div>}
      <div className="external-sign-link">
        <a href={link} target="_blank" rel="noopener noreferrer">
          <h3><FontAwesomeIcon icon="signature" /> Open Directly</h3>
        </a>
      </div>
      <div className="embed-responsive embed-responsive-1by1">
        <iframe className="embed-responsive-item" title="Wire Instructions" src={link}></iframe>
      </div>
    </div>
  )
}


function KYCDocusign({ deal, investor, status }) {
  const [loading, setLoading] = useState(true)
  const [kycData, setKYCData] = useState({})
  const [link, setLink] = useState()
  const classes = useStyles()

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  if (!investor) return <Loader />
  const docs = _.get(investor, 'documents') || []
  const kycDoc = docs.find(d => d.documentName && (d.documentName.includes('W-8') || d.documentName.includes('W-9')))



  if (kycDoc) return (
    <Paper className={classes.paper}>
      <Typography variant="subtitle1">
        We already have a W8/W9 document on file for you.
      </Typography>
    </Paper>)

  if (!link?.redirectUrl) return <DocusignKYCEmbeddedForm setLink={setLink} deal_slug={deal.deal_slug} org={deal.organization} />

  return (
    <Paper className={classes.paper}>
      <div className={status === "kyc" ? "document-iframe" : "document-iframe hide"}>
        {loading && <div className="temp-loader"><Loader /></div>}
        <div className="external-sign-link">

          <Typography variant="h4" align="center" >{link.formName}</Typography >
          <a href={link.redirectUrl} target="_blank" rel="noopener noreferrer center">
            <h3><FontAwesomeIcon icon="signature" /> Open Directly </h3>
          </a>
        </div>
        <div className="embed-responsive embed-responsive-1by1">
          <iframe className="embed-responsive-item" title="Wire Instructions" src={link.redirectUrl}></iframe>
        </div>
      </div>
    </Paper>
  )
}

const KYCCheck = ({ kycData, setKYCData }) => {
  const classes = useStyles()

  return (
    <>
      <Grid container justify="center" className="kyc-check">
        <Paper className={`paper-container ${classes.paper}`}>
          {(!kycData.entityType && !kycData.hasOwnProperty('usCitizen')) && <>
            <Typography variant="subtitle1">
              Are you a U.S. citizen?
        </Typography>
            <Button variant="contained" size="medium" color="primary" className={classes.button}
              onClick={() => setKYCData({ ...kycData, usCitizen: true })}>
              Yes
        </Button>
            <Button variant="contained" size="medium" color="primary" className={classes.button}
              onClick={() => setKYCData({ ...kycData, usCitizen: false })}
            >
              No
        </Button> </>}


          {kycData.hasOwnProperty('usCitizen') && <>
            <Typography variant="subtitle1">
              Are you an Entity or Individual investor?
        </Typography>
            <Button variant="contained" size="medium" color="primary" className={classes.button} onClick={() => setKYCData({ ...kycData, entityType: 'entity' })} >
              Entity
        </Button>
            <Button variant="contained" size="medium" color="primary" className={classes.button} onClick={() => setKYCData({ ...kycData, entityType: 'individual' })}>
              Individual
        </Button>
          </>
          }

          {/* <Button variant="contained" color="secondary" size="small" className='reset-button'> Reset </Button> */}
        </Paper>
      </Grid>
    </>
  )
}


