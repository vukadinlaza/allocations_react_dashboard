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
import { Table, TableBody, TableCell, Grid, TableRow, TableHead, Paper, Hidden } from '@material-ui/core'
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
}));
const TABLE_ORDER = {
  "invited": { status: 'invited', display: 'Invited', order: 0 },
  "pledged": { status: 'pledged', display: 'Pledged', order: 1 },
  "onboarded": { status: 'onboarded', display: 'Onboarded', order: 2 },
  "signed": { status: 'signed', display: 'Signed', order: 3 },
  "wired": { status: 'wired', display: 'Wired', order: 4 },
  "complete": { status: 'complete', display: 'Complete', order: 5 }
}
const TR = ({ investment, showDocs, setShowDocs, type }) => {
  return (
    <TableRow key={investment._id} className="investment-row">
      <TableCell scope="row">{investment.deal.company_name}</TableCell>
      <Hidden xsDown><TableCell>{investment.deal.company_description}</TableCell></Hidden>
      <TableCell align="right">{investment.amount ? "$" + nWithCommas(investment.amount) :
        <i>TBD</i>}</TableCell>
      <TableCell align="center"><InvestmentStatus investment={investment} /></TableCell>
      <TableCell align="center">{formatDate(investment.deal.date_closed)}</TableCell>
      <TableCell align="right">
        {_.get(investment, 'documents.length', 0) > 0
          ? showDocs && (showDocs._id === investment._id)
            ? <FontAwesomeIcon icon="times" onClick={() => setShowDocs(null)} />
            : <FontAwesomeIcon icon="info-circle" onClick={() => setShowDocs({ ...investment, type })} />
          : ""
        }
      </TableCell>
    </TableRow>
  )
}
export default function UserInvestments() {
  const classes = useStyles();
  const history = useHistory()
  const [showDocs, setShowDocs] = useState(null)
  const { userProfile, error, } = useAuth(GET_INVESTOR)
  if (error) {
    if (error.message === "GraphQL error: permission denied" && userProfile && userProfile.email) {
      return <Redirect to="/signup" />
    }
    return <div>{error.message}</div>
  }
  if (!userProfile.email) return <div><Loader /></div>
  const investments = _.orderBy(
    userProfile.investments,
    [
      i => TABLE_ORDER[i.status].order,
      i => new Date(i.deal.date_closed).getTime(),
    ],
    ['asc', 'desc'],
  )
  const pendingInvesments = investments.filter(i => i.status !== 'complete')
  const completeInvestments = investments.filter(i => i.status === 'complete')
  if (showDocs) {
    const type = showDocs.type === 'pending' ? pendingInvesments : completeInvestments
    type.splice(investments.findIndex(i => i._id === showDocs._id) + 1, 0, { showDocs })
  }
  return (
    <>
      <Grid container spacing={2}>
        <Grid item>
          <div className={classes.totalInvested}>
            Total Invested: <span>${nWithCommas(_.sumBy(investments, 'amount'))}</span>
          </div>
          {/* Peer: Total amount of investments is not shown in the design anymore
           <Typography variant="h6">
            Investments: <span>{showDocs ? investments.length - 1 : investments.length}</span>
          </Typography>
          */}
        </Grid>
        <Grid item xs={12}>
          <Hidden smUp>
            <h6>Pending Deals:</h6>
            <Paper>
              <Table dense>
                {pendingInvesments.map((investment) => (
                  investment.showDocs ? <DocsRow key={showDocs._id + "-docs"} docs={showDocs.documents} />
                    : <TR key={investment._id} investment={investment} type="pending" showDocs={showDocs} setShowDocs={setShowDocs} />
                ))}
              </Table>
            </Paper>
            <br />
            <h6>Completed:</h6>
            <Paper>
              <Table dense>
                {completeInvestments.map((investment) => (
                  investment.showDocs ? <DocsRow key={showDocs._id + "-docs"} docs={showDocs.documents} />
                    : <TR key={investment._id} investment={investment} type="complete" showDocs={showDocs} setShowDocs={setShowDocs} />
                ))}
              </Table>
            </Paper>
          </Hidden>
          <Hidden only="xs">
            <h6>
              Pending Deals:</h6>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Company</TableCell>
                    <Hidden xsDown><TableCell>Description</TableCell></Hidden>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Closing Date</TableCell>
                    <TableCell align="right">Docs</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingInvesments.map((investment) => (
                    investment.showDocs ? <DocsRow key={showDocs._id + "-docs"} docs={showDocs.documents} />
                      : <TR key={investment._id} investment={investment} type="pending" showDocs={showDocs} setShowDocs={setShowDocs} />
                  ))}
                </TableBody>
              </Table>
            </Paper>
            <br />
            <h6>Completed:</h6>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Company</TableCell>
                    <Hidden xsDown><TableCell>Description</TableCell></Hidden>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Closing Date</TableCell>
                    <TableCell align="right">Docs</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {completeInvestments.map((investment) => (
                    investment.showDocs ? <DocsRow key={showDocs._id + "-docs"} docs={showDocs.documents} />
                      : <TR key={investment._id} investment={investment} type="complete" showDocs={showDocs} setShowDocs={setShowDocs} />
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Hidden>
        </Grid>
      </Grid>
    </>
  )
}
function InvestmentStatus({ investment }) {
  const { status } = investment
  return (
    <Link to={_.get(investment, 'deal.appLink', "")}>
      <span className={`investment-status investment-status-${status}`}>{status}</span>
    </Link>
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
    <TableRow>
      <TableCell colSpan={6}>
        {docs.map(doc => (
          <div key={doc.path} className="doc-wrapper">
            <div className="doc">
              <FontAwesomeIcon icon={["far", "file-pdf"]} />
            </div>
            <div className="filename">
              <span><a href={`https://${doc.link}`} target="_blank"
                rel="noopener noreferrer">{filename(doc.path)}</a></span>
            </div>
          </div>
        ))}
      </TableCell>
    </TableRow>
  )
}