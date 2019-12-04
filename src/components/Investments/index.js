import React, { useEffect } from 'react'
import _ from 'lodash'
import { useParams, Link } from 'react-router-dom';
import { gql } from 'apollo-boost'
import { useLazyQuery } from '@apollo/react-hooks';
import { useAuth0 } from "../../react-auth0-spa";
import { Row, Container, Col } from 'reactstrap'
import { nWithCommas } from '../../utils/numbers'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from '../utils/Loader'

import { Table, TableBody, TableCell, TableRow, TableHead, Paper } from '@material-ui/core'

import "./style.scss";

const GET_INVESTMENTS = gql`
  {
    allInvestments {
      _id
      amount
      deal {
        _id
        company_name
        company_description
        date_closed
      }
      investor {
        _id
        first_name
        last_name
      }
    }
  }
`

export default function UserInvestments () {
  const params = useParams()
  const adminView = params && params.id

  const { user } = useAuth0()
  const [getInvestments, { data, loading, error }] = useLazyQuery(GET_INVESTMENTS)

  useEffect(() => {
    if (user && user.email) getInvestments()
  }, [user])

  if (error) return <div>{error.message}</div>

  if (!data) return <div><Loader /></div>

  const investments = data.allInvestments
  return (
    <div className="Investments">
      <Row>
        <Col sm="10" className="offset-sm-1">
          <div className="investment-stats row">
            <Col sm="6">
              <Paper className="investments-n">Investments: <span>{investments.length}</span></Paper>
            </Col>
            <Col sm="6">
              <Paper className="investments-sum">Total Invested: <span>${nWithCommas(_.sumBy(investments, 'amount'))}</span></Paper>
            </Col>
          </div>
          <Paper className="table-wrapper">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Investor</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="center">Date Closed</TableCell>
                  <TableCell align="right">Docs</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_.orderBy(investments, i => new Date(i.deal.date_closed).getTime(), 'desc').map(investment => (
                  <TableRow key={investment._id}>
                    <TableCell>{investment.investor.first_name} {investment.investor.last_name}</TableCell>
                    <TableCell scope="row">{investment.deal.company_name}</TableCell>
                    <TableCell>{investment.deal.company_description}</TableCell>
                    <TableCell align="right">${nWithCommas(investment.amount)}</TableCell>
                    <TableCell align="center">{investment.deal.date_closed}</TableCell>
                    <TableCell align="right">
                      {investment.documents ? <a href={investment.documents} target="_blank">
                        <FontAwesomeIcon icon="external-link-alt" />
                      </a> : ""} 
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