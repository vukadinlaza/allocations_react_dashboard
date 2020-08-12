import React, { useEffect } from 'react'
import _ from 'lodash'
import { Link, useParams } from 'react-router-dom';
import { gql } from 'apollo-boost'
import { useLazyQuery } from '@apollo/react-hooks';
import { useAuth } from "../../auth/useAuth";
import { Row, Col } from 'reactstrap'
import { nWithCommas } from '../../utils/numbers'
import Loader from "../utils/Loader"

import { Table, TableBody, TableCell, TableRow, TableHead, Paper, Button } from '@material-ui/core'

import "./style.scss";

/***
 *
 * All investors in table view for superadmins
 *
 **/

const GET_INVESTORS = gql`
  query GetOrg($slug: String!) {
    organization(slug: $slug) {
      _id
      deals {
        _id
        investments {
          _id
          investor {
            _id
            first_name
            last_name
            email
            investments {
              _id
              amount
            }
          }
        }
      }
    }
  }
`

export default function Investors() {
  const { organization } = useParams()
  const { userProfile } = useAuth()
  const [getInvestors, { data, error }] = useLazyQuery(GET_INVESTORS, { variables: { slug: organization } })

  useEffect(() => {
    if (userProfile && userProfile.email) getInvestors()
  }, [userProfile])

  if (error) return <div>{error.message}</div>

  if (!data?.organization?.deals) return <div><Loader /></div>

  const { organization: { deals } } = data
  const investors = _.uniq(deals.reduce((acc, deal) => {
    const investors = deal.investments.map(investment => investment.investor)
    return [...acc, ...investors]
  }, []).filter(inv => inv), 'email')
  return (
    <div className="Investors">
      <Row>
        {organization === "allocations" && <Col sm={{ size: 12 }}>
          <Paper className="actions">
            <Link to="/investors/new">
              <Button variant="contained" color="secondary">INVITE INVESTOR</Button>
            </Link>
          </Paper>
        </Col>}
        <Col sm="12">
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
                    <TableCell>{investor.investor_type === "entity" ? investor.entity_name : `${investor.first_name} ${investor.last_name}`}</TableCell>
                    <TableCell>{investor.email}</TableCell>
                    <TableCell>{investor.investments.length}</TableCell>
                    <TableCell>${nWithCommas(_.sumBy(investor.investments, 'amount'))}</TableCell>
                    <TableCell>
                      {organization === "allocations" && <Link to={`/investor/${investor._id}/home`}>
                        Use site as {investor.first_name || investor.entity_name}
                      </Link>
                      }
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