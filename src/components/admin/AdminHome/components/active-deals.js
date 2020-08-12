import React, {useState} from 'react'
import _ from 'lodash'
import {useParams} from 'react-router-dom'
import {nWithCommas} from '../../../../utils/numbers'
import {Paper, Table, TableBody, TableCell, TableRow, TableHead, Button, LinearProgress, Grid} from '@material-ui/core'
import Loader from '../../../utils/Loader'
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom"
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import moment from 'moment'
import InvestmentFlow from './investmentFlow/index'


/***
 *
 * AdminHome is the overview of all a funds deals, investors, investments
 * looks similar to the investor home page but for fund admins
 *
 **/

export default function ActiveDeals({orgData}) {
  const history = useHistory();

  if (!orgData) return <Loader/>

  const org = orgData.organization

  const {active} = _.groupBy(org.deals, d => d.status === "closed" ? "closed" : "active")
  return (
    <Grid container>
      <Grid item xs={12}>
        <Paper>
          <Grid container xs={12} justify="space-between" style={{padding: "16px"}}>
            <Typography variant="h6" gutterBottom>
              Active Deals: {(active || []).length}
            </Typography>
            <Button color="primary"
                  variant="contained" onClick={() => history.push(`/admin/${org.slug}/deal/new`)}>Create Deal</Button>
        </Grid>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Closes</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>SOW</TableCell>
                <TableCell>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(active || []).map(deal => (
                <Deal key={deal._id} deal={deal} investments={org.investments}/>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  )
}


// clicking on the whole row opens the investment board
function Deal({deal, investments}) {
  const history = useHistory();
  const {organization} = useParams();
  const [activeDeal, setActiveDeal] = useState();
  const val = (Number(deal.amount_raised) / (Number(deal.target) || Infinity)) * 100;
  // this isnt built into the app yet
  const hasSOW = true;

  const formattedDate_closed = moment(deal.date_closed).format('Do MMMM YYYY')

  return (
    <>
      <TableRow hover onClick={() => setActiveDeal(activeDeal ? false : deal)}>
        <TableCell><strong>{deal.company_name}</strong></TableCell>
        <TableCell>{formattedDate_closed ? formattedDate_closed : "TBD"}</TableCell>
        <TableCell>
          <div>{Math.round(val || 0)}%</div>
          <LinearProgress className="deal-progress" variant="determinate" color="secondary" value={val}/>
          <div>${nWithCommas(deal.amount_raised)} of ${nWithCommas(deal.target)}</div>
        </TableCell>
        <TableCell>{<FontAwesomeIcon icon={hasSOW ? 'check-circle' : 'times-circle'} size="lg"
                                     color="green"/>}</TableCell>
        <TableCell style={{textAlign: "right"}}>
          <Button color="primary" onClick={() => history.push(`/admin/${organization}/deals/${deal._id}/edit`)} style={{ textTransform: 'lowercase'}}>
            edit
          </Button>
        </TableCell>
      </TableRow>
      {activeDeal && <TableRow>
        <InvestmentFlow deal={deal} investments={investments}/>
      </TableRow>
      }
    </>
  )
}

