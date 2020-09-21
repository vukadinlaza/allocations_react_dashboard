import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { useParams, Redirect, Link, useHistory } from 'react-router-dom';
import { gql } from 'apollo-boost'
import { useLazyQuery } from '@apollo/react-hooks';
import { useAuth } from "../../auth/useAuth";
import { Row, Col } from 'reactstrap'
import { nWithCommas, formatDate } from '../../utils/numbers'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from '../utils/Loader'
import { Table, TableBody, TableCell, Grid, TableRow, TableHead, Paper, Hidden, ButtonBase, Button } from '@material-ui/core'
import "./style.scss";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const GET_INVESTOR = gql`
  query GetInvestor($email: String, $_id: String) {
    investor(email: $email, _id: $_id) {
      _id
      first_name
      last_name
      email
      investments {
        _id
        status
        amount
        deal {
          _id
          company_name
          company_description
          date_closed
          appLink
          dealParams {
            totalRoundSize
            allocation
            totalCarry
            minimumInvestment
            signDeadline
            wireDeadline
            estimatedSetupCosts
            estimatedSetupCostsDollar
            estimatedTerm
            managementFees
            managementFeesDollar
            portfolioTotalCarry
            portfolioEstimatedSetupCosts
            portfolioEstimatedSetupCostsDollar
            portfolioManagementFees
            portfolioManagementFeesDollar
            fundTotalCarry
            fundEstimatedSetupCosts
            fundEstimatedSetupCostsDollar
            fundManagementFees
            fundManagementFeesDollar
            fundGeneralPartner
            fundEstimatedTerm
          }
        }
        documents {
          link
          path
        }
      }
    }
  }
`
const useStyles = makeStyles((theme) => ({
  totalInvested: {
    padding: "8px 16px",
    backgroundColor: '#d3eae0',
    color: "#4bc076",
    fontSize: "20px",
    borderRadius: "10px"
  },
  paper: {
    padding: theme.spacing(2),
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
    height: 42,
    width: "100%"
  },
  subtitle: {
    color: "#3A506B",
    marginTop: 16
  },
  activeTab: {
    height: 42,
    paddingTop: 3,
    width: "100%",
    borderBottom: "3px solid #205DF5",
    outline: "0 !important",
  },
  button: {
    margin: ".5rem"
  },
  orgName: {
    color: '#3A506B',
    fontWeight: 'bolder'
  }
}));
const TABLE_ORDER = {
  "invited": { status: 'invited', display: 'Invited', order: 0 },
  "pledged": { status: 'pledged', display: 'Pledged', order: 1 },
  "onboarded": { status: 'onboarded', display: 'Onboarded', order: 2 },
  "signed": { status: 'signed', display: 'Signed', order: 3 },
  "wired": { status: 'wired', display: 'Wired', order: 4 },
  "complete": { status: 'complete', display: 'Complete', order: 5 }
}
const TR = ({ investment, showDocs, setShowDocs }) => {
  const history = useHistory()
  console.log(investment)
  return (
    <TableRow key={investment._id} className="investment-row">
      <TableCell style={{ maxWidth: '200px', minWith: '200px', width: '200px' }} scope="row">{investment.deal.company_name}</TableCell>
      <Hidden xsDown><TableCell style={{ maxWidth: '300px', minWith: '300px', width: '300px' }}>{_.truncate(investment.deal.company_description, { length: 35 })}</TableCell></Hidden>
      <TableCell align="right">{investment.amount ? "$" + nWithCommas(investment.amount) :
        <i>TBD</i>}</TableCell>
      <TableCell align="center"><InvestmentStatus investment={investment} /></TableCell>
      <TableCell align="center">{formatDate(investment.deal.dealParams.wireDeadline)}</TableCell>
      <TableCell align="right" style={{ display: 'flex', justifyContent: 'space-between' }}>
        {investment?.documents?.length >= 1 && <Button variant="contained" size="small" color="primary" onClick={() => setShowDocs(showDocs ? null : investment)}
        >
          Documents
        </Button>}
        <Button variant="contained" size="small" color="secondary" onClick={() => history.push(_.get(investment, 'deal.appLink', ""))}>
          View
        </Button>
      </TableCell>
    </TableRow>
  )
}
export default function UserInvestments() {
  const classes = useStyles();
  const [showDocs, setShowDocs] = useState(null)
  const [activeInvestments, setActiveInvestments] = useState({ status: 'invited' })
  const { userProfile, error } = useAuth(GET_INVESTOR)


  const investments = _.orderBy(
    userProfile.investments,
    [
      i => TABLE_ORDER[i.status].order,
      i => new Date(i.deal.dealParams.wireDeadline).getTime(),
    ],
    ['asc', 'desc'],
  )
  const onboardingInvestments = investments.filter(i => !['invited', 'complete'].includes(i.status))
  const invitedInvestments = investments.filter(i => i.status === 'invited')
  const completeInvestments = investments.filter(i => i.status === 'complete')


  if (error) {
    if (error.message === "GraphQL error: permission denied" && userProfile && userProfile.email) {
      return <Redirect to="/signup" />
    }
    return <div>{error.message}</div>
  }
  if (!userProfile.email) return <div><Loader /></div>

  let type = null
  if (showDocs) {
    type = showDocs.status === 'complete' ? completeInvestments : showDocs.status === 'invited' ? invitedInvestments : onboardingInvestments
    type.splice(type.findIndex(i => i._id === showDocs._id) + 1, 0, { showDocs })
  }
  return (
    <>
      <div className={classes.tabs}>
        <Grid container>
          <Grid item xs={12} sm={4} md={2}>
            <ButtonBase className={activeInvestments.status === "invited" ? classes.activeTab : classes.tab}
              onClick={() => setActiveInvestments({ status: 'invited', investments: invitedInvestments })}>
              Invited
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <ButtonBase className={activeInvestments.status === "onboarding" ? classes.activeTab : classes.tab}
              onClick={() => setActiveInvestments({ status: 'onboarding', investments: onboardingInvestments })}>
              Onboarding
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <ButtonBase className={activeInvestments.status === "complete" ? classes.activeTab : classes.tab}
              onClick={() => setActiveInvestments({ status: 'complete', investments: completeInvestments })}>
              Completed
            </ButtonBase>
          </Grid>
        </Grid>
      </div>

      <>
        <Tab investments={showDocs ? type : (activeInvestments.investments || invitedInvestments)} showDocs={showDocs} setShowDocs={setShowDocs} type={activeInvestments.status} />
      </>
    </>
  )
}


const Tab = ({ investments, showDocs, setShowDocs, type }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Hidden smUp>
          <Typography variant="h6" gutterBottom>{_.startCase(_.toLower(type))} Deals:</Typography>
          <Paper>
            <Table dense>
              {investments.map((investment) => (
                investment.showDocs ? <DocsRow key={showDocs._id + "-docs"} docs={showDocs.documents} />
                  : <TR key={investment._id} investment={investment} showDocs={showDocs}
                    setShowDocs={setShowDocs} />
              ))}
            </Table>
          </Paper>
          <br />
        </Hidden>
        <Hidden only="xs">
          <Paper>
            <Typography variant="h6" style={{ paddingLeft: "16px", paddingTop: "16px", }} gutterBottom>
              {_.startCase(_.toLower(type))} Deals
              </Typography>
            <Typography variant="subtitle2" style={{ paddingLeft: "16px", paddingBottom: "16px" }}>
              Below is a list of your investments.
              </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <Hidden xsDown><TableCell>Description</TableCell></Hidden>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Closing Date</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {investments.map((investment) => (
                  investment.showDocs ? <DocsRow key={showDocs._id + "-docs"} docs={showDocs.documents} />
                    : <TR key={investment._id} investment={investment} showDocs={showDocs}
                      setShowDocs={setShowDocs} />
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Hidden>
      </Grid>
    </Grid>
  )
}

function InvestmentStatus({ investment }) {
  const { status } = investment
  return (
    <span className={`investment-status investment-status-${status}`}>{status}</span>
  )
}

function filename(path) {
  try {
    return path.split('/')[2]
  } catch {
    return path
  }
}

function DocsRow({ docs }) {
  return (
    <>
      <TableRow>
        <TableCell colSpan={6}>
          <Typography variant="subtitle2" style={{ marginBottom: '1rem' }}>
            Documents may take up to 7 days to appear here after signing.
          </Typography>
          {docs.map(doc => (
            <div key={doc.path} className="doc-wrapper">
              <div className="filename">
                <FontAwesomeIcon color="#F48FB1" icon={["far", "file-pdf"]} className="doc-icon" />
                <span><a href={`https://${doc.link}`} target="_blank"
                  rel="noopener noreferrer">{filename(doc.path)}</a></span>
              </div>
            </div>
          ))}
        </TableCell>
      </TableRow>
    </>
  )
}
