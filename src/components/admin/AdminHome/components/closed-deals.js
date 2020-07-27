import React from 'react'
import _ from 'lodash'
import {Paper, Table, TableBody, TableCell, TableRow, Button, Grid, Typography, Divider} from '@material-ui/core'
import {useHistory} from "react-router-dom"
import {makeStyles} from "@material-ui/core/styles";
import {nWithCommas, formatDate} from '../../../../utils/numbers'


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    minWidth: '100%',
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
export default ({orgData}) => {
    const classes = useStyles();
    const history = useHistory()
    const {closed } = _.groupBy(orgData.deals, d => d.status === "closed" ? "closed" : "active")
    const { organization } = orgData
    return (
        <Grid container>
          <Paper className={classes.paper}>
            <Grid container>
                <Grid item xs={10}>
                <Typography variant="h6">
                    🎉 Closed Deals: {(closed || []).length}
                </Typography>
                </Grid>
                <Grid item xs={2} style={{textAlign: "right"}}>
                <Button
                    onClick={() => history.push(`/admin/${organization.slug}/deals`)}
                    color="primary"
                    style={{padding: "3px 4px"}}>View All</Button>
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
                    <Button color="primary" onClick={() => history.push(`/admin/${organization.slug}/deals/${deal._id}/edit`)}>
                        edit
                        </Button>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </Paper>
        </Grid>
    )
}