import React, { useEffect } from 'react'
import _ from 'lodash'
import { useParams, Link } from 'react-router-dom';
import { gql } from 'apollo-boost'
import { useLazyQuery } from '@apollo/react-hooks';
import { useAuth0 } from "../../react-auth0-spa";
import { Row, Container, Col } from 'reactstrap'
import { nWithCommas } from '../../utils/numbers'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "../utils/Loader"

import { Table, TableBody, TableCell, TableRow, TableHead, Paper } from '@material-ui/core'

import "./style.scss";

const GET_INVESTORS = gql`
  {
    allInvestors {
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
        }
      }
    }
  }
`

export default function Investments () {
  const { user } = useAuth0()
  const [getInvestors, { data, loading, error }] = useLazyQuery(GET_INVESTORS)

  useEffect(() => {
    if (user && user.email) getInvestors()
  }, [user])

  if (error) return <div>{error.message}</div>

  if (!data) return <div><Loader /></div>

  const investors = data.allInvestors
  return (
    <div className="Investors">
      <Row>
        <Col sm="10" className="offset-sm-1">
          <Paper className="table-wrapper">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Investor</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Investments</TableCell>
                  <TableCell>Total Invested</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_.orderBy(investors, ({ investments }) => _.sumBy(investments, 'amount'), 'desc').map(investor => (
                  <TableRow key={investor._id}>
                    <TableCell>{investor.first_name} {investor.last_name}</TableCell>
                    <TableCell>{investor.email}</TableCell>
                    <TableCell>{investor.investments.length}</TableCell>
                    <TableCell>${nWithCommas(_.sumBy(investor.investments, 'amount'))}</TableCell>
                    <TableCell>
                      <Link to={`/investor/${investor._id}/home`}>
                        Use site as {investor.first_name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link to={`/investor/${investor._id}/edit`}>Edit</Link>
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