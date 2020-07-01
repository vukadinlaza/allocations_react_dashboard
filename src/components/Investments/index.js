import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { useParams, Link } from 'react-router-dom';
import { gql } from 'apollo-boost'
import { useLazyQuery } from '@apollo/react-hooks';
import { useAuth0 } from "../../react-auth0-spa";
import { Row, Col } from 'reactstrap'
import { nWithCommas, formatDate } from '../../utils/numbers'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from '../utils/Loader'
import * as Chart from '../../utils/chart'
import * as d3 from 'd3'

import { Table, TableBody, TableCell, TableRow, TableHead, Paper, Button } from '@material-ui/core'

import "./style.scss";

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
      data: acc.data.concat([{...i, amount: cumsum}])
    }
  }, {data: [], cumsum: 0})

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

export default function Investments () {
  const { organization } = useParams()
  const [showDocs, setShowDocs] = useState(null)

  const { user } = useAuth0()
  const [getInvestments, { data, error }] = useLazyQuery(GET_INVESTMENTS)

  useEffect(() => {
    if (user && user.email) getInvestments({ variables: { slug: organization } })
  }, [user])

  if (error) return <div>{error.message}</div>

  if (!data) return <div><Loader /></div>

  const investments = _.orderBy(_.get(data, 'organization.investments', []), i => new Date(i.deal.date_closed).getTime(), 'desc')
  if (showDocs) {
    investments.splice(investments.findIndex(i => i._id === showDocs._id) + 1, 0, { showDocs })
  }

  return (
    <div className="Investments">
      <Row>
        <Col sm="10" className="offset-sm-1">
          <div className="investment-stats row">
            <Col sm="6">
              <Paper className="investments-n">
                Investments: <span>{investments.length}</span>
                <Button variant="contained"
                  color="secondary">
                  <Link to="/admin/investment/new">Add Investment</Link>
                </Button>
              </Paper>
            </Col>
            <Col sm="6">
              <Paper className="investments-sum">Total Invested: <span>${nWithCommas(_.sumBy(investments, 'amount'))}</span></Paper>
            </Col>
          </div>
          <Paper className="table-wrapper">
            <Table className="investments-table">
              <TableHead style={{fontWeight: "bold"}}>
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
                          <span className={`investment-status investment-status-${investment.status}`}>{investment.status}</span>
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
                        <TableCell align="center"><Link to={`/admin/investments/${investment._id}/edit`}>edit</Link></TableCell>
                      </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Col>
      </Row>
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

function DocsRow ({ docs }) {
  return (
    <TableRow>
      <TableCell colSpan={7}>
        {docs.map(doc => (
          <div className="doc-wrapper">
            <div className="doc">
              <FontAwesomeIcon icon={["far", "file-pdf"]} />
            </div>
            <div className="filename">
              <span><a href={`https://${doc.link}`} target="_blank" rel="noopener noreferrer">{filename(doc.path)}</a></span>
            </div>
          </div>
        ))}
      </TableCell>
    </TableRow>
  )
}