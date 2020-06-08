import React, {useState, useEffect} from 'react'
import _ from 'lodash'
import {useMutation, useQuery} from '@apollo/react-hooks'
import {gql} from 'apollo-boost'
import {useAuth} from "../../../auth/useAuth"
import {useParams, Link} from 'react-router-dom'
import {nWithCommas, formatDate} from '../../../utils/numbers'
import {Paper, Table, TableBody, TableCell, TableRow, TableHead, Button, LinearProgress} from '@material-ui/core'
import {Col, Row} from 'reactstrap'
import Loader from '../../utils/Loader'
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {useHistory} from "react-router-dom"
import Typography from "@material-ui/core/Typography";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";

/***
 *
 * AdminHome is the overview of all a funds deals, investors, investments
 * looks similar to the investor home page but for fund admins
 *
 **/

export const ORG_OVERVIEW = gql`
  query GetOrg($slug: String!) {
    organization(slug: $slug) {
      _id
      name
      slug
      deals {
        _id
        status
        date_closed
        company_name
        company_description
        target
        amount_raised
        investments {
          _id
          amount
          status
        }
      }
      investors {
        _id
        name
        investments {
          _id
          amount
          deal {
            _id
          }
        }
      }
      investments {
        _id
        status
        amount
        deal {
          _id
          company_name
        }
        investor {
          _id
          name
        }
      }
      complianceTasks {
        _id
        completed
        status
        is_signature
        signature_template
        signature_url
        task
      }
    }
    investor {
      _id
      admin
    }
  }
`


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    maxWidth: 800,
    marginBottom: theme.spacing(4),
  },
  divider: {
    margin: "16px -16px"
  },
  table: {
    width: "calc(100% + 32px)",
    margin: "16px -16px"
  },
}));

function sumOrgInvestments({investor, deals}) {
  const deal_ids = deals.map(d => d._id)
  return investor.investments.reduce((acc, inv) => {
    if (deal_ids.includes(inv.deal._id)) {
      return acc + (inv.amount || 0)
    }
    return acc
  }, 0)
}

export default function AdminHome() {
  const classes = useStyles();
  const history = useHistory()

  const {organization} = useParams()
  const {data, error, refetch} = useQuery(ORG_OVERVIEW, {
    variables: {slug: organization}
  })

  if (!data) return <Loader/>

  const org = data.organization

  const {active, closed} = _.groupBy(org.deals, d => d.status === "closed" ? "closed" : "active")

  return (
    <>
      <Grid container>
        {data.investor.admin && <Grid item xs={12}>
          <SuperAdmin org={org}/>
        </Grid>}
        <Grid item>
          <Paper className={classes.paper}>
            <Typography variant="h6">
              Welcome to <strong>{org.name}</strong>, Admin!
            </Typography>
            <Typography variant="subtitle2" style={{marginBottom: 16}}>
              This is where you can manage your deals and investors 🗃 🔮
            </Typography>
            <Button color="primary" variant="contained" onClick={() => history.push(`/admin/${organization}/deal/new`)}>
              Create Deal
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Paper className={classes.paper}>
        <Grid container>
          <Grid item xs={10}>
            <Typography variant="h6">
              💡 Active Deals: {(active || []).length}
            </Typography>
          </Grid>
          <Grid item xs={2} style={{textAlign: "right"}}>
            <Button
              onClick={() => history.push(`/admin/${organization}/deals`)} className="all-btn"
              color="primary"
              style={{padding: "3px 4px"}}>See All</Button>
          </Grid>
        </Grid>

        <Divider className={classes.divider} style={{marginBottom: -16}}/>

        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Closes</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(active || []).map(deal => (
              <Deal key={deal._id} deal={deal}/>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Paper className={classes.paper}>
        <Grid container>
          <Grid item xs={10}>
            <Typography variant="h6">
              🎉 Closed Deals: {(closed || []).length}
            </Typography>
          </Grid>
          <Grid item xs={2} style={{textAlign: "right"}}>
            <Button
              onClick={() => history.push(`/admin/${organization}/deals`)}
              color="primary"
              style={{padding: "3px 4px"}}>See All</Button>
          </Grid>
        </Grid>

        <Divider className={classes.divider} style={{marginBottom: -16}}/>

        <Table>
          <TableBody>
            {(closed || []).map(deal => (
              <TableRow key={deal._id} className="deal-info">
                <TableCell className="company-name">{deal.company_name}</TableCell>
                <TableCell>${nWithCommas(deal.amount_raised)}</TableCell>
                <TableCell><i>closed {formatDate(deal.date_closed)}</i></TableCell>
                <TableCell>
                  <Link to={`/admin/${organization}/deals/${deal._id}/edit`}>edit</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Paper className={classes.paper}>
        <Grid container>
          <Grid item xs={10}>
            <Typography variant="h6">
              💵 Recent Investments: {(closed || []).length}
            </Typography>
          </Grid>
          <Grid item xs={2} style={{textAlign: "right"}}>
            <Button onClick={() => history.push(`/admin/${organization}/investments`)} className="all-btn"
                    color="primary"
                    style={{padding: "3px 4px"}}>
              See All</Button>
          </Grid>
        </Grid>

        <Divider className={classes.divider} style={{marginBottom: -16}}/>

        <Table>
          <TableBody>
            {_.take((org.investments || []), 10).filter(i => i.status !== "invited").map(investment => (
              <TableRow key={investment._id}>
                <TableCell>{investment.deal.company_name}</TableCell>
                <TableCell>{_.get(investment, 'investor.name')}</TableCell>
                <TableCell>${nWithCommas(investment.amount)}</TableCell>
                <TableCell>{investment.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  )
}

function SuperAdmin({org}) {
  const history = useHistory();
  return (
    <Paper className="superadmin-section" style={{marginBottom: "20px", padding: "10px", textAlign: "center"}}>
      You are a SuperAdmin &nbsp;<Button onClick={() => history.push(`/admin/${org.slug}/manager`)} size="small"
                                         variant="contained" color="secondary">Manage</Button>
    </Paper>
  )
}

function Deal({deal}) {
  const history = useHistory();
  const {organization} = useParams();
  const val = (Number(deal.amount_raised) / (Number(deal.target) || Infinity)) * 100;

  return (
    <TableRow hover>
      <TableCell><strong>{deal.company_name}</strong></TableCell>
      <TableCell>{deal.date_closed ? formatDate(deal.date_closed) : "TBD"}</TableCell>
      <TableCell>
        <div>{Math.round(val || 0)}%</div>
        <LinearProgress className="deal-progress" variant="determinate" color="secondary" value={val}/>
        <div>${nWithCommas(deal.amount_raised)} of ${nWithCommas(deal.target)}</div>
      </TableCell>
      <TableCell style={{textAlign: "right"}}>
        <Button color="primary" onClick={() => history.push(`/admin/${organization}/deals/${deal._id}/edit`)}>
          edit
        </Button>
      </TableCell>
    </TableRow>
  )
}

