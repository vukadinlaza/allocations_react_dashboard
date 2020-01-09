import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { useParams, Redirect } from 'react-router-dom';
import { gql } from 'apollo-boost'
import { useLazyQuery } from '@apollo/react-hooks';
import { useAuth0 } from "../../react-auth0-spa";
import { Row, Container, Col } from 'reactstrap'
import { nWithCommas } from '../../utils/numbers'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from '../utils/Loader'

import { Table, TableBody, TableCell, TableRow, TableHead, Paper, Hidden } from '@material-ui/core'

import "./style.scss";

const GET_INVESTOR = gql`
  query GetInvestor($email: String, $_id: String) {
    investor(email: $email, _id: $_id) {
      _id
      first_name
      last_name
      email
      investments {
        _id
        amount
        deal {
          _id
          company_name
          company_description
          date_closed
        }
        documents {
          link
          path
        }
      }
    }
  }
`
export default function UserInvestments () {
  const params = useParams()
  const adminView = params && params.id
  const [showDocs, setShowDocs] = useState(null)

  const { user, isAuthenticated } = useAuth0()
  const [getInvestor, { data, loading, error, called, refetch }] = useLazyQuery(GET_INVESTOR)

  useEffect(() => {
    if (isAuthenticated && !called) {
      adminView ? getInvestor({ variables: { _id: params.id }}) : getInvestor()
    }
  }, [isAuthenticated, called])

  useEffect(() => {
    if (error && user) refetch()
  }, [error, user])

  if (error) {
    if (error.message === "GraphQL error: permission denied" && user && user.email) {
      return <Redirect to="/signup" />
    }
    return <div>{error.message}</div>
  }

  if (!data) return <div><Loader /></div>

  const investments = _.orderBy(data.investor.investments, i => new Date(i.deal.date_closed).getTime(), 'desc')
  if (showDocs) {
    investments.splice(investments.findIndex(i => i._id === showDocs._id) + 1, 0, { showDocs })
  }
  return (
    <div className="Investments">
      <Row>
        <Col sm="10" className="offset-sm-1">
          <div className="investment-stats row">
            <Col sm="6">
              <Paper className="investments-n">Investments: <span>{showDocs ? investments.length - 1 : investments.length}</span></Paper>
            </Col>
            <Col sm="6">
              <Paper className="investments-sum">Total Invested: <span>${nWithCommas(_.sumBy(investments, 'amount'))}</span></Paper>
            </Col>
          </div>
          <Paper className="table-wrapper">
            <Table>
              <TableHead>
                <TableRow>
                  <Hidden xsDown><TableCell>Investor</TableCell></Hidden>
                  <TableCell>Company</TableCell>
                  <Hidden xsDown><TableCell>Description</TableCell></Hidden>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="center">Date Closed</TableCell>
                  <TableCell align="right">Docs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {investments.map((investment) => (
                  investment.showDocs ? <DocsRow key={showDocs._id + "-docs"} docs={showDocs.documents} />
                    : <TableRow key={investment._id} className="investment-row">
                        <Hidden xsDown><TableCell>{data.investor.first_name} {data.investor.last_name}</TableCell></Hidden>
                        <TableCell scope="row">{investment.deal.company_name}</TableCell>
                        <Hidden xsDown><TableCell>{investment.deal.company_description}</TableCell></Hidden>
                        <TableCell align="right">${nWithCommas(investment.amount)}</TableCell>
                        <TableCell align="center">{investment.deal.date_closed}</TableCell>
                        <TableCell align="right">
                          {_.get(investment, 'documents.length', 0) > 0
                            ? showDocs && (showDocs._id === investment._id) 
                              ? <FontAwesomeIcon icon="times" onClick={() => setShowDocs(null)} /> 
                              : <FontAwesomeIcon icon="info-circle" onClick={() => setShowDocs(investment)} />
                            : ""
                          } 
                        </TableCell>
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
    return path.split('/')[1]
  } catch {
    return path
  }
}

function DocsRow ({ docs }) {
  return (
    <TableRow>
      <TableCell colSpan={6}>
        {docs.map(doc => (
          <div key={doc.path} className="doc-wrapper">
            <div className="doc">
              <FontAwesomeIcon icon={["far", "file-pdf"]} />
            </div>
            <div className="filename">
              <span><a href={`https://${doc.link}`} target="_blank">{filename(doc.path)}</a></span>
            </div>
          </div>
        ))}
      </TableCell>
    </TableRow>
  )
}