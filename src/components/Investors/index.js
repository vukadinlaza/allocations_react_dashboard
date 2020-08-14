import React, { useEffect } from 'react'
import _ from 'lodash'
import { Link, useParams } from 'react-router-dom';
import { gql } from 'apollo-boost'
import { useLazyQuery } from '@apollo/react-hooks';
import { useAuth } from "../../auth/useAuth";
import { Row, Col } from 'reactstrap'
import { nWithCommas } from '../../utils/numbers'
import Loader from "../utils/Loader"
import { getDisplayName } from '../../utils/displayName';

import { Table, TableBody, TableCell, TableRow, TableHead, Paper, Button, Grid } from '@material-ui/core'

import "./style.scss";
import Typography from "@material-ui/core/Typography";

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
      {/* {organization === "allocations" && <Col sm={{ size: 12 }}>
          <Paper className="actions">
            <Link to="/investors/new">
              <Button variant="contained" color="secondary">INVITE INVESTOR</Button>
            </Link>
          </Paper>
        </Col>} */}
      <Grid container>
        <Grid item xs={12}>
          <Paper className="table-wrapper">
            <Grid container xs={12} justify="space-between" style={{ padding: "16px" }}>
              <Typography variant="h6" gutterBottom>
                Investors
            </Typography>
              {organization === "allocations" && <Link to="/investors/new">
                <Button variant="contained" color="secondary">INVITE INVESTOR</Button>
              </Link>}
            </Grid>
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
                    <TableCell>{getDisplayName({ investor })}</TableCell>
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}