import React, {useState, useEffect} from 'react'
import _ from 'lodash'
import {useMutation, useQuery} from '@apollo/react-hooks'
import {gql} from 'apollo-boost'
import {useParams} from 'react-router-dom'
import {nWithCommas, formatDate} from '../../../../utils/numbers'
import {Paper, Table, TableBody, TableCell, TableRow, TableHead, Button, LinearProgress, Grid } from '@material-ui/core'
import Loader from '../../../utils/Loader'
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom"
import Typography from "@material-ui/core/Typography";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Divider from "@material-ui/core/Divider";

/***
 *
 * AdminHome is the overview of all a funds deals, investors, investments
 * looks similar to the investor home page but for fund admins
 *
 **/

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(4),
    minHeight: '100%'
  },
  divider: {
    margin: "16px -16px"
  },
  table: {
    width: "calc(100% + 32px)",
    margin: "16px -16px"
  },
}));

export default function ActiveDeals({orgData}) {
  const classes = useStyles();
  const history = useHistory()

  if (!orgData) return <Loader/>

  const org = orgData.organization

  const {active} = _.groupBy(org.deals, d => d.status === "closed" ? "closed" : "active")

  return (
      <Grid container>
          <Grid item xs={12}>
          <Paper className={classes.paper}>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    💡 Active Deals: {(active || []).length}
                  </Typography>
                    <Button color="primary"
                    className="all-btn"
                    style={{padding: "3px 4px"}} onClick={() => history.push(`/admin/${org.slug}/deal/new`)}>
                    Create Deal
                  </Button>
                </Grid>
                <Grid item xs={2} style={{textAlign: "left"}}>
                  <Button
                    onClick={() => history.push(`/admin/${org.slug}/deals`)} className="all-btn"
                    color="primary"
                    style={{padding: "3px 4px"}}>View All</Button>
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
          </Grid>
      </Grid>
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

