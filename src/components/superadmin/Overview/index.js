import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { gql } from 'apollo-boost'
import { Row, Col } from 'reactstrap'
import { Link, useHistory } from 'react-router-dom'
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { useQuery, useMutation } from '@apollo/react-hooks'
import { nWithCommas, formatDate } from '../../../utils/numbers'
import FormModal from '../../Modal'
import { Paper, LinearProgress, Table, TableBody, TableCell, TableRow, Button, Grid, TableHead, MenuItem, FormControl, Select, InputLabel, Typography } from '@material-ui/core'
import { Deal } from '../../admin/AdminHome/components/active-deals'
import EditOrg from '../../forms/editOrg'
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
        raised
        dealParams {
          wireDeadline
        }
        company_name
        company_description
        target
        amount_raised
        organization {
          slug
        }
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
  const [activeDeals, setActiveDeals] = useState([])
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('all')
  const [activeData, setActiveData] = useState({ type: 'orgs' })
  const { data: allDeals } = useQuery(ALL_DEALS)
  const modalBody = {};

  useEffect(() => {
    if (allDeals?.superadmin?.deals) {
      setActiveDeals(allDeals.superadmin.deals)
    }
  }, [allDeals?.superadmin?.deals])

  if (!data) return null
  if (!allDeals) return null


  const { deals: allDealsData } = allDeals.superadmin
  const { deals, organizations, investors } = data.superadmin

  const groupedDeals = _.groupBy(allDealsData, 'status')

  const filter = (e) => {
    const value = e.target.value
    if (value === 'all') {
      console.log(allDealsData)
      setActiveDeals(allDealsData)
    } else {
      setActiveDeals(groupedDeals[value] || [])
    }
    setType(value)
  }

  const formsMap = {
    orgsForm: <EditOrg orgData={open.org} refetch={refetch} />
  }

  let form = null
  if (open) {
    form = formsMap[open.type]
  }
  console.log(form)

  return (
    <div className="SuperAdmin">
      <div style={{ marginBottom: '4rem' }}>
        <Row style={{ marginBottom: '1em' }}>
          <Col md={{ size: "3" }}><Paper onClick={() => setActiveData({ data: organizations, type: 'orgs' })} style={{ padding: "20px" }}><h6 style={{ color: "rgba(0,0,0,0.3)" }}>Funds</h6><h2 style={{ textAlign: "center" }}>{organizations?.length}</h2></Paper></Col>

          <Col md={{ size: "3" }}><Paper onClick={() => setActiveData({ data: allDealsData, type: 'deals' })} style={{ padding: "20px" }}><h6 style={{ color: "rgba(0,0,0,0.3)" }}>Deals</h6><h2 style={{ textAlign: "center" }}>{organizations?.length}</h2></Paper></Col>

          <Col md={{ size: "3" }}><Paper style={{ padding: "20px" }}><h6 style={{ color: "rgba(0,0,0,0.3)" }}>Onboarding Deals</h6><h2 style={{ textAlign: "center" }}>{_.get(groupedDeals, 'onboarding', []).length}</h2></Paper></Col>

          <Col md={{ size: "3" }}><Paper style={{ padding: "20px" }}><h6 style={{ color: "rgba(0,0,0,0.3)" }}>Closed Deals</h6><h2 style={{ textAlign: "center" }}>{_.get(groupedDeals, 'closed', []).length}</h2></Paper></Col>
        </Row>

        <Grid container>
          {activeData.type === 'deals' && <DealsTabel activeDeals={activeDeals} type={type} filter={filter} />}
          {activeData.type === 'orgs' && <FundsTabel organizations={organizations} type={type} filter={filter} setOpen={setOpen} />}
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
      <FormModal
        open={open}
        setOpen={setOpen}
        form={form}
      />
    </div>
  )
}

function Org({ org, refetch, setOpen }) {
  const history = useHistory()
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
      <TableCell>{org.created_at ? formatDate(Number(org.created_at)) : null}</TableCell>
      <TableCell>
        {org.slug}
      </TableCell>
      <TableCell>
        {org.approved ? <CheckCircleRoundedIcon color="secondary" style={{ marginLeft: '1.5rem' }} /> : <CancelRoundedIcon color="red" style={{ marginLeft: '1.5rem' }} />}
      </TableCell>
      <TableCell style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button variant="contained" color="primary" onClick={() => {
          setOpen({ type: 'orgsForm', org })
        }}> Edit</Button>
        <Button variant="contained" color="secondary" onClick={() => history.push(`admin/${org.slug}`)}> View</Button>
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



const DealsTabel = ({ type, filter, activeDeals }) => {
  return (
    <Grid item xs={12}>
      <Paper>
        <Grid container spacing={2} justify="space-between" >
          <Grid item xs={12} sm={12} md={6}>
            <Typography variant="h4" style={{ marginBottom: "20px", padding: "16px", maxWidth: '50%' }}>Deals</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '1rem' }}>
            <FormControl variant="outlined" style={{ width: "60%" }}>
              <InputLabel>Deal Status</InputLabel>
              <Select value={type}
                onChange={filter}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
                <MenuItem value="onboarding">Onboarding</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
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
            {activeDeals.map(deal => {
              return <Deal deal={deal} investments={deal.investments} />
            })}
          </TableBody>
        </Table>
      </Paper>
    </Grid>
  )
}


const FundsTabel = ({ organizations, setOpen }) => {
  return (
    <Grid item xs={12}>
      <Paper>
        <Grid container spacing={2} justify="space-between" >
          <Grid item xs={12} sm={12} md={6}>
            <Typography variant="h4" style={{ marginBottom: "20px", padding: "16px", maxWidth: '50%' }}>Funds</Typography>
          </Grid>
          {/* <Grid item xs={12} sm={12} md={6} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '1rem' }}>
            <FormControl variant="outlined" style={{ width: "60%" }}>
              <InputLabel>Deal Status</InputLabel>
              <Select value={type}
                onChange={filter}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
                <MenuItem value="onboarding">Onboarding</MenuItem>
              </Select>
            </FormControl>
          </Grid> */}
        </Grid>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Approved</TableCell>
              <TableCell>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {organizations.map(org => {
              return <Org org={org} setOpen={setOpen} />
            })}
          </TableBody>
        </Table>
      </Paper>
    </Grid>
  )
}