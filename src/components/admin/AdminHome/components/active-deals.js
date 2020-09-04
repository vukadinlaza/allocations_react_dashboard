import React, { useState } from 'react'
import _ from 'lodash'
import { useParams } from 'react-router-dom'
import { nWithCommas } from '../../../../utils/numbers'
import {
  Paper,
  Table,
  IconButton,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Button,
  LinearProgress,
  Grid,
  Hidden
} from '@material-ui/core'
import Loader from '../../../utils/Loader'
import { useHistory } from "react-router-dom"
import Typography from "@material-ui/core/Typography";
import moment from 'moment'
import InvestmentFlow from './investment-flow'
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

/***
 *
 * AdminHome is the overview of all a funds deals, investors, investments
 * looks similar to the investor home page but for fund admins
 *
 **/

export const ActiveDeals = ({ orgData }) => {
  const history = useHistory();

  if (!orgData) return <Loader />

  const { active } = _.groupBy(orgData.deals, d => d.status === "closed" ? "closed" : "active")
  return (
    <Grid container>
      <Grid item xs={12}>
        <Paper>
          <Grid container xs={12} justify="space-between" style={{ padding: "16px" }}>
            <Typography variant="h6" gutterBottom>
              Active Deals: {(active || []).length}
            </Typography>
            <Button color="primary"
              variant="contained" onClick={() => history.push(`/admin/${orgData.slug}/deal/new`)}>Create Deal</Button>
          </Grid>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Closes</TableCell>
                <Hidden only="xs">
                  <TableCell>Progress</TableCell>
                  <TableCell></TableCell>
                </Hidden>
                <TableCell>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(active || []).map(deal => (
                <Deal key={deal._id} deal={deal} />
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  )
}


// clicking on the whole row opens the investment board
export const Deal = ({ deal }) => {
  const history = useHistory();
  const { organization } = useParams();
  const [activeDeal, setActiveDeal] = useState();
  const raised = deal?.raised
  const val = (Number(raised) / (Number(deal.target) || Infinity)) * 100;
  // this isnt built into the app yet
  const hasSOW = true;

  const formattedDate_closed = moment(deal?.dealParams?.wireDeadline).format('Do MMMM YYYY')

  return (
    <>
      <TableRow hover onClick={() => setActiveDeal(activeDeal ? false : deal)}>
        <TableCell><strong>{deal.company_name}</strong></TableCell>
        <TableCell>{formattedDate_closed ? formattedDate_closed : "TBD"}</TableCell>
        <Hidden only="xs">
          <TableCell>
            <div>{Math.round(val || 0)}%</div>
            <LinearProgress className="deal-progress" variant="determinate" color="secondary" value={val} />
            <div>${nWithCommas(raised)} of ${nWithCommas(deal.target)}</div>
          </TableCell>
          <TableCell>
          </TableCell>
        </Hidden>
        <TableCell style={{ textAlign: "right" }}>
          <>
            <Button color="primary" style={{ textTransform: 'lowercase' }} onClick={() => history.push(`/admin/${organization || deal.slug}/deals/${deal._id}/edit`)}>
              Edit
          </Button>
            <Button color="primary" style={{ textTransform: 'lowercase' }} onClick={() => history.push(deal.appLink || "#")}>
              View
          </Button>
          </>
          <IconButton>
            {activeDeal ?
              <ExpandLessIcon /> : <ExpandMoreIcon />
            }
          </IconButton>
        </TableCell>
      </TableRow>
      {activeDeal && <TableRow style={{ borderTop: "0", maxWidth: '300px' }}>
        <TableCell colspan="5">
          <InvestmentFlow dealId={deal._id} />
        </TableCell>
      </TableRow>
      }
    </>
  )
}