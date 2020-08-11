import React from 'react'
import _ from 'lodash'
import {gql} from 'apollo-boost'
import {Row, Col} from 'reactstrap'
import {Link} from 'react-router-dom'
import {useQuery, useMutation} from '@apollo/react-hooks'
import {nWithCommas, formatDate} from '../../../utils/numbers'
import {Paper, LinearProgress, Table, TableBody, TableCell, TableRow, Button} from '@material-ui/core'
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
  const {data, refetch} = useQuery(SUPERADMIN)

  if (!data) return null

  const {deals, organizations, investors} = data.superadmin
  return (
    <div className="SuperAdmin">
      <h2 style={{marginBottom: "20px"}}>🔮 Superadmin</h2>
      <Row>
        <Col md={{size: 6}}>
          <Paper style={{padding: "20px"}}>
            <div>
              Funds &nbsp;
              <span className="square-number">{organizations.length}</span>
            </div>
            <Paper style={{maxHeight: "500px", overflow: "scroll"}}>
              <Table>
                <TableBody>
                  {organizations.map(org => (
                    <Org key={org._id} org={org} refetch={refetch}/>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Paper>
        </Col>
        <Col sm={{size: 6}}>
          <Paper style={{padding: "20px"}}>
            <div className="deals-title">Deals &nbsp;<span className="square-number">{deals.length}</span></div>
            <Paper style={{maxHeight: "500px", overflow: "scroll"}}>
              <Table size="small">
                <TableBody>
                  {deals.map(deal => (
                    <Deal key={deal._id} deal={deal}/>
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

function Org({org, refetch}) {
  const [updateOrganization, {data}] = useMutation(APPROVE_ORG, {
    onCompleted: refetch
  })
  const approve = () => {
    updateOrganization({variables: {org: {_id: org._id, approved: true}}})
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

function Deal({deal}) {
  const val = (Number(deal.amount_raised) / (Number(deal.target) || Infinity)) * 100

  const organization = _.get(deal, 'organization.name', 'allocations')
  return (
    <TableRow className="deal-info">
      <TableCell className="company-name">{deal.company_name} <br/><small>({organization})</small></TableCell>
      <TableCell><i>closes: {deal.date_closed ? formatDate(deal.date_closed) : "unknown"}</i></TableCell>
      <TableCell>
        <LinearProgress className="progress-bar" variant="determinate" color="secondary" value={val}/>
        <div className="text-center">${nWithCommas(deal.amount_raised)} of ${nWithCommas(deal.target)}</div>
      </TableCell>
      <TableCell>
        <Link to={`/admin/${organization}/deals/${deal._id}/edit`}>edit</Link>
      </TableCell>
    </TableRow>
  )
}
