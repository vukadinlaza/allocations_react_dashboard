import React from 'react'
import _ from 'lodash'
import { gql } from 'apollo-boost'
import { Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { nWithCommas, formatDate } from '../../../utils/numbers'
import { Paper, LinearProgress, Table, TableBody, TableCell, TableRow, Button, Grid, TableHead } from '@material-ui/core'
import { Deal } from '../../admin/AdminHome/components/active-deals'
import "./style.scss"

const SUPERADMIN = gql`
  {
    superadmin {
      deals {
        _id
        company_name
        company_description
        created_at
        date_closed
        amount_raised
        target
        organization {
          name
        }
      }
      organizations {
        _id
        name
        approved
        created_at
        slug
        n_deals
        admins {
          name
        }
      }
      investors {
        _id
        name
        created_at
      }
    }
  }
`

const ALL_DEALS = gql`
{
  superadmin {
      deals {
        _id
        status
        date_closed
        appLink
        slug
        dealParams {
          wireDeadline
        }
        company_name
        company_description
        target
        amount_raised
        investments {
        _id
          status
          amount
          deal {
            _id
            company_name
          }
          investor {
            email
          }
        }
      }
    }
}
`

const DELETE_ORG = gql`
  mutation DeleteOrg($_id: String!) {
    deleteOrganization(_id: $_id)
  }
`

const APPROVE_ORG = gql`
  mutation ApproveOrg($org: OrganizationInput!) {
    updateOrganization(organization: $org) {
      _id
    }
  }
`

export default function SuperAdminOverview() {
  const { data, refetch } = useQuery(SUPERADMIN)
  const { data: allDeals, } = useQuery(ALL_DEALS)
  if (!data) return null
  if (!allDeals) return null
  const { deals: allDealsData } = allDeals.superadmin
  const { deals, organizations, investors } = data.superadmin

  const groupedDeals = _.groupBy(allDealsData, 'status')
  console.log(groupedDeals)


  return (
    <div className="SuperAdmin">
      <div style={{ marginBottom: '4rem' }}>
        <Row style={{ marginBottom: '1em' }}>
          <Col md={{ size: "3" }}><Paper style={{ padding: "20px" }}><h6 style={{ color: "rgba(0,0,0,0.3)" }}>Funds</h6><h2 style={{ textAlign: "center" }}>1</h2></Paper></Col>

          <Col md={{ size: "3" }}><Paper style={{ padding: "20px" }}><h6 style={{ color: "rgba(0,0,0,0.3)" }}>Deals</h6><h2 style={{ textAlign: "center" }}>{organizations?.length}</h2></Paper></Col>

          <Col md={{ size: "3" }}><Paper style={{ padding: "20px" }}><h6 style={{ color: "rgba(0,0,0,0.3)" }}>Onboarding Deals</h6><h2 style={{ textAlign: "center" }}>{_.get(groupedDeals, 'onboarding', []).length}</h2></Paper></Col>

          <Col md={{ size: "3" }}><Paper style={{ padding: "20px" }}><h6 style={{ color: "rgba(0,0,0,0.3)" }}>Closed Deals</h6><h2 style={{ textAlign: "center" }}>{_.get(groupedDeals, 'closed', []).length}</h2></Paper></Col>
        </Row>

        <Grid container>
          <Grid item xs={12}>
            <Paper>
              <h4 style={{ marginBottom: "20px", padding: "16px" }}>Deals</h4>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Closes</TableCell>
                    <TableCell>Progress</TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allDealsData.map(deal => {
                    return <Deal deal={deal} investments={deal.investments} />
                  })}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </div>


      <Row>
        <Col md={{ size: 6 }}>
          <Paper style={{ padding: "20px" }}>
            <div>
              Funds &nbsp;
              <span className="square-number">{organizations.length}</span>
            </div>
            <Paper style={{ maxHeight: "500px", overflow: "scroll" }}>
              <Table>
                <TableBody>
                  {organizations.map(org => (
                    <Org key={org._id} org={org} refetch={refetch} />
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Paper>
        </Col>
        <Col sm={{ size: 6 }}>
          <Paper style={{ padding: "20px" }}>
            <div className="deals-title">Deals &nbsp;<span className="square-number">{deals.length}</span></div>
            <Paper style={{ maxHeight: "500px", overflow: "scroll" }}>
              <Table size="small">
                <TableBody>
                  {deals.map(deal => (
                    <LegacyDeal key={deal._id} deal={deal} />
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Paper>
        </Col>
      </Row>
    </div>
  )
}

function Org({ org, refetch }) {
  const [updateOrganization, { data }] = useMutation(APPROVE_ORG, {
    onCompleted: refetch
  })
  const approve = () => {
    updateOrganization({ variables: { org: { _id: org._id, approved: true } } })
  }

  return (
    <TableRow className="org-info">
      <TableCell className="name">
        {org.name}{!org.approved &&
          <Button size="small" variant="contained" color="secondary" onClick={approve}>approve</Button>}
      </TableCell>
      <TableCell><i>created: {org.created_at ? formatDate(Number(org.created_at)) : null}</i></TableCell>
      <TableCell>
        Deals: <b>{org.n_deals}</b>
      </TableCell>
      <TableCell>
        <Link to={`/admin/${org.slug}`}>admin</Link>
      </TableCell>
    </TableRow>
  )
}

function LegacyDeal({ deal }) {
  const val = (Number(deal.amount_raised) / (Number(deal.target) || Infinity)) * 100

  const organization = _.get(deal, 'organization.name', 'allocations')
  return (
    <TableRow className="deal-info">
      <TableCell className="company-name">{deal.company_name} <br /><small>({organization})</small></TableCell>
      <TableCell><i>closes: {deal.date_closed ? formatDate(deal.date_closed) : "unknown"}</i></TableCell>
      <TableCell>
        <LinearProgress className="progress-bar" variant="determinate" color="secondary" value={val} />
        <div className="text-center">${nWithCommas(deal.amount_raised)} of ${nWithCommas(deal.target)}</div>
      </TableCell>
      <TableCell>
        <Link to={`/admin/${organization}/deals/${deal._id}/edit`}>edit</Link>
      </TableCell>
    </TableRow>
  )
}
