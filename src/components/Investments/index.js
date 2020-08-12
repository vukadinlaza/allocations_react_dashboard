import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { useParams, Link, useHistory } from 'react-router-dom';
import { gql } from 'apollo-boost'
import { useLazyQuery } from '@apollo/react-hooks';
import { useAuth } from "../../auth/useAuth";
import { Row, Col } from 'reactstrap'
import { nWithCommas, formatDate } from '../../utils/numbers'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from '../utils/Loader'
import * as Chart from '../../utils/chart'
import * as d3 from 'd3'

import { Grid, Table, TableBody, TableCell, TableRow, TableHead, Paper, Button } from '@material-ui/core'
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";


/***
 *
 * Investments table for fund admin/superadmin
 *
 **/

const GET_INVESTMENTS = gql`
  query GetOrg($slug: String!) {
    organization(slug: $slug) {
      _id
      investments {
        _id
        status
        amount
        deal {
          _id
          company_name
          company_description
          date_closed
          slug
        }
        documents {
          path
          link
        }
        investor {
          _id
          name
          first_name
          last_name
          investor_type
          entity_name
        }
      }
    }
  }
`

function renderChart(investments) {
  const margins = { top: 0, bottom: 0, left: 0, right: 0 }
  const { g, chartWidth, chartHeight } = Chart.initResponsive("#investments-timeseries-chart", margins)

  const { data } = investments.reduce((acc, i) => {
    const cumsum = acc.cumsum + i.amount
    return {
      cumsum,
      data: acc.data.concat([{ ...i, amount: cumsum }])
    }
  }, { data: [], cumsum: 0 })

  const x = d3.scaleTime()
    .rangeRound([0, chartWidth])
    .domain(d3.extent(data, d => new Date(d.date_closed)))

  const y = d3.scaleLinear()
    .range([chartHeight, 0])
    .domain(d3.extent(data, d => new Date(d.date_closed)))

  const line = d3.line()
    .x(d => x(new Date(d.date_closed)))
    .y(d => y(d.amount))
    .curve(d3.curveMonotoneX)

  g.append("path")
    .datum(data)
    .attr("stroke", "#00D394")
    .attr("stroke-width", 1)
    .attr("fill", "#00D394")
    .attr("d", line)
}

const useStyles = makeStyles((theme) => ({
  green: {
    color: theme.palette.secondary.main
  },
  paper: {
    padding: theme.spacing(2)
  }
}));


export default function Investments() {
  const { organization } = useParams()
  const [showDocs, setShowDocs] = useState(null)
  const history = useHistory()
  const classes = useStyles()

  const { userProfile } = useAuth()
  const [getInvestments, { data, error }] = useLazyQuery(GET_INVESTMENTS)

  useEffect(() => {
    if (userProfile && userProfile.email) getInvestments({ variables: { slug: organization } })
  }, [userProfile])

  if (error) return <div>{error.message}</div>

  if (!data) return <div><Loader /></div>

  const investments = _.orderBy(_.get(data, 'organization.investments', []), i => new Date(i.deal.date_closed).getTime(), 'desc')
  if (showDocs) {
    investments.splice(investments.findIndex(i => i._id === showDocs._id) + 1, 0, { showDocs })
  }

  return (
    <>
      <Paper className={classes.paper}>
        <Grid container justify="space-between">
          <Grid item>
          <Typography variant="h6" gutterBottom>
              Total Invested: <span className={classes.green}>${nWithCommas(_.sumBy(investments, 'amount'))}</span>
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained"
              color="secondary" onClick={() => history.push(`/admin/investment/new`)}>
              Add Investment
          </Button>
          </Grid>
        </Grid>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Investor</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Closing Date</TableCell>
              <TableCell align="right">Docs</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {investments.map((investment) => (
              investment.showDocs ? <DocsRow docs={showDocs.documents} />
                : <TableRow key={investment._id} className="investment-row">
                  <TableCell>{_.get(investment, 'investor.name')}</TableCell>
                  <TableCell scope="row">{investment.deal.company_name}</TableCell>
                  <TableCell>{investment.deal.company_description}</TableCell>
                  <TableCell align="right">{investment.amount ? "$" + nWithCommas(investment.amount) : "TBD"}</TableCell>
                  <TableCell>
                    <span
                      className={`investment-status investment-status-${investment.status}`}>{investment.status}</span>
                  </TableCell>
                  <TableCell align="center">{formatDate(investment.deal.date_closed)}</TableCell>
                  <TableCell align="right">
                    {_.get(investment, 'documents.length', 0) > 0
                      ? showDocs && (showDocs._id === investment._id)
                        ? <FontAwesomeIcon icon="times" onClick={() => setShowDocs(null)} />
                        : <FontAwesomeIcon icon="info-circle" onClick={() => setShowDocs(investment)} />
                      : ""
                    }
                  </TableCell>
                  <TableCell align="center"><Link
                    to={`/admin/${organization}/investments/${investment._id}/edit`}>edit</Link></TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
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
      <TableCell colSpan={7}>
        {docs.map(doc => (
          <div className="doc-wrapper">
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
