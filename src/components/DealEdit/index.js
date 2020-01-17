import React, { useState, useEffect } from 'react'
import { useSimpleReducer } from '../../utils/hooks'
import _, { get, isEqual } from "lodash"
import { useParams } from "react-router-dom"
import { Row, Col } from 'reactstrap'
import { useAuth0 } from "../../react-auth0-spa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nWithCommas } from '../../utils/numbers'
import * as API from "../../api"
import UserSearch from "../forms/UserSearch"

import { gql } from 'apollo-boost'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'

import { Table, TableBody, TableCell, TableRow, Paper, Button } from '@material-ui/core'
import { FormControl, Select, MenuItem, InputLabel, TextField, InputAdornment } from "@material-ui/core"
import "./style.scss"

const GET_DEAL = gql`
  query Deal($id: String!) {
    deal(_id: $id) {
      _id
      company_name
      company_description
      date_closed
      deal_lead
      pledge_link
      onboarding_link
      status
      inviteKey
      investments {
        _id
        amount
        investor {
          _id
          name
        }
      }
      invitedInvestors {
        _id
        name
        email
      }
    } 
  }
`

const UPDATE_DEAL = gql`
  mutation UpdateDeal($deal: DealInput!) {
    updateDeal(deal: $deal) {
      _id
      company_name
      company_description
      date_closed
      deal_lead
      pledge_link
      onboarding_link
      closed
      inviteKey
      invitedInvestors {
        _id
        name
      }
    }
  }
`

const validInputs = ["_id","company_name","company_description","date_closed","deal_lead","pledge_link","onboarding_link","embed_code","status","closed","amount"]

export default function DealEdit () {
  const params = useParams()
  const [searchQ, setSearchQ] = useState("")
  const [deal, setDeal] = useSimpleReducer({})
  const [showAddInvestment, setShowAddInvestment] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const { data, refetch } = useQuery(GET_DEAL, { variables: { id: params.id }})
  const [updateDeal] = useMutation(UPDATE_DEAL)
  const [search, searchRes] = useLazyQuery(API.users.search)

  useEffect(() => {
    if (data) setDeal(data.deal)
  }, [data])

  useEffect(() => {
    setHasChanges(data && !isEqual(deal, get(data, 'deal')))
  }, [deal])

  useEffect(() => {
    search({ variables: { q: searchQ } })
  }, [searchQ])
  
  return (
    <div className="DealEdit form-wrapper">
      <Row>
        <Col sm={{size: 8, offset: 1}}>
          <div className="form-title">Edit Deal</div>
        </Col>
      </Row>
      <form className="form" noValidate autoComplete="off">
        <Row>
          <Col sm={{size: 4, offset: 1}}>
            <TextField style={{width: "100%"}} 
              value={deal.company_name || ""} 
              onChange={e => setDeal({ company_name: e.target.value })}
              label="Company Name" 
              variant="filled" />
          </Col>
          <Col sm={{size: 4}}>
            <TextField style={{width: "100%"}} 
              value={deal.deal_lead || ""}
              onChange={e => setDeal({ deal_lead: e.target.value })}
              label="Deal Lead" 
              variant="filled" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 6, offset: 1}}>
            <TextField style={{width: "100%"}} 
              value={deal.company_description || ""}
              onChange={e => setDeal({ company_description: e.target.value })} 
              label="Company Description" 
              variant="filled" />
          </Col>
          <Col sm={{size: 2}}>
            <TextField style={{width: "100%"}} 
              value={deal.date_closed || ""}
              onChange={e => setDeal({ date_closed: e.target.value })}
              label="Closing Date" 
              variant="filled" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 4, offset: 1}}>
            <TextField style={{width: "100%"}} 
              value={deal.pledge_link || ""} 
              onChange={e => setDeal({ pledge_link: e.target.value })}
              label="Pledge Link" 
              variant="filled" />
          </Col>
          <Col sm={{size: 4}}>
            <TextField style={{width: "100%"}}
              value={deal.onboarding_link || ""}
              onChange={e => setDeal({ onboarding_link: e.target.value })}
              label="Onboarding Link" 
              variant="filled" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 4, offset: 1}}>
            <FormControl variant="filled" style={{width: "100%"}}>
              <InputLabel>Status</InputLabel>
              <Select value={deal.status || ""}
                onChange={e => setDeal({ status: e.target.value })}
                inputProps={{name: 'Type'}}>
                <MenuItem value="onboarding">Onboarding</MenuItem>
                <MenuItem value="closing">Closing</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
          </Col>
          <Col sm="4">
            <TextField disabled 
              style={{width: "100%"}}
              label="Invited Link" 
              value={`dashboard.allocations.co/signup?key=${get(deal, "inviteKey")}`}
              InputProps={{
                endAdornment: <InputAdornment position="end"><FontAwesomeIcon icon="copy" onClick={() => navigator.clipboard.writeText(`dashboard.allocations.co/signup?key=${get(deal, "inviteKey")}`)} /></InputAdornment>,
              }}
              variant="filled" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 8, offset: 1}}>
            <Button disabled={!hasChanges} 
              variant="contained"
              onClick={() => updateDeal({ variables: { deal: _.pick(deal, validInputs) } })} 
              color="primary">
              UPDATE DEAL
            </Button> 
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 4, offset: 1}}>
            <div className="form-sub-title">Invited Investors</div>
          </Col>
          <Col sm={4}>
            <div className="form-sub-title">
              Investments {showAddInvestment 
                ? <FontAwesomeIcon icon="times" onClick={() => setShowAddInvestment(false)} /> 
                : <Button variant="contained" color="secondary" onClick={() => setShowAddInvestment(true)}>Add +</Button>} 
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 4, offset: 1}} className="search-investors">
            <TextField style={{width: "100%", marginBottom: "10px"}} value={searchQ} onChange={e => setSearchQ(e.target.value)} label="Search Investors" variant="filled" />
            <Paper className="table-wrapper">
              <Table>
                <TableBody>
                  {(searchQ !== "" ? get(searchRes, 'data.searchUsers', []) : []).map(investor => (
                    <TableRow key={investor._id} sm={{size: 4, offset: 1}} className="invited-investor">
                      <TableCell>{investor.name}</TableCell>
                      <TableCell>{investor.email}</TableCell>
                      <TableCell><AddInvestor investor={investor} deal={data.deal} setSearchQ={setSearchQ} refetch={refetch} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
            <Paper className="table-wrapper">
              <Table>
                <TableBody>
                  <InvitedInvestors data={data} refetch={refetch} />
                </TableBody>
              </Table>
            </Paper>
          </Col>
          <Col sm={{size: 4}} className="investments">
            <AddInvestment deal={deal} show={showAddInvestment} refetch={refetch} /> 
            <Paper>
              <Table>
                <TableBody>
                  {_.get(deal, 'investments', []).map(inv => (
                    <TableRow key={inv._id} sm={{size: 4, offset: 1}} className="invited-inv">
                      <TableCell>{get(inv, 'investor.name')}</TableCell>
                      <TableCell>${nWithCommas(inv.amount)}</TableCell>
                      <TableCell><DeleteInvestment investment={inv} refetch={refetch} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Col>
        </Row>
      </form>
    </div>
  )
}

function DeleteInvestment ({ investment, refetch }) {
  const [delInvestment, { data, error }] = useMutation(API.investments.destroy)

  useEffect(() => {
    if (data && data.deleteInvestment) refetch()
  }, [data])

  const submit = () => {
    if (window.confirm("Delete Investment?")) delInvestment({ variables: { id: investment._id }})
  }

  return <FontAwesomeIcon icon="times" onClick={submit} />
}

function validate (investment) {
  return _.reject(['deal_id', 'user_id', 'amount'], prop => investment[prop])
}

function AddInvestment ({ deal, show, refetch }) {
  const [investment, setInvestment] = useSimpleReducer({ amount: "" })
  const [createInvestment, { data, error }] = useMutation(API.investments.create)
  const [user, setUser] = useState(null)
  const [errors, setErrors] = useState([])

  useEffect(() => {
    if (deal && !investment.deal_id) setInvestment({ deal_id: deal._id }) 
  }, [deal, investment])

  useEffect(() => {
    if (user) setInvestment({ user_id: user._id })
  }, [user])

  useEffect(() => {
    if (data) {
      setInvestment({ deal_id: deal._id, amount: "", user_id: user._id })
      refetch()
    }
  }, [data])

  const submit = () => {
    const validation = validate(investment)
    setErrors(validation)
    if (validation.length === 0) createInvestment({ variables: { investment } })
  }

  if (!show) return null

  return (
    <div className="AddInvestment">
      <UserSearch user={user} setUser={setUser} errors={errors} />
      <div>
        <TextField required error={errors.includes("amount")} style={{width: "100%"}} 
          value={investment.amount}
          onChange={e => setInvestment({ amount: Math.floor(e.target.value) })}
          label="Amount"
          variant="filled" />
      </div>
      <Button variant="contained"
        onClick={submit} 
        color="primary">
        ADD INVESTMENT
      </Button>
    </div>
  )
}

function InvitedInvestors ({ data, refetch }) {
  if (!data) {
    return (
      <TableRow className="loading-table">
        <TableCell><FontAwesomeIcon icon="circle-notch" spin /></TableCell>
      </TableRow>
    )
  }

  if (get(data, 'deal.invitedInvestors.length', 0) === 0) {
    return (
      <TableRow className="invited-investors-none">
        <TableCell>None</TableCell>
      </TableRow>
    )
  }

  return (
    get(data, 'deal.invitedInvestors', []).map(investor => (
      <TableRow key={investor._id} sm={{size: 4, offset: 1}}>
        <TableCell>{investor.name}</TableCell>
        <TableCell>{investor.email}</TableCell>
        <TableCell><RmInvestor investor={investor} deal={get(data, 'deal', {})} refetch={refetch} /></TableCell>
      </TableRow>
    ))
  )
}

const INVITE_INVESTOR = gql`
  mutation InviteInvestor($user_id: String!, $deal_id: String!) {
    inviteInvestor(user_id: $user_id, deal_id: $deal_id) {
      _id
    }
  }
`

const UNINVITE_INVESTOR = gql`
  mutation UninviteInvestor($user_id: String!, $deal_id: String!) {
    uninviteInvestor(user_id: $user_id, deal_id: $deal_id) {
      _id
    }
  }
`

function AddInvestor ({ investor, deal, setSearchQ, refetch }) {
  const [status, setStatus] = useState(null)
  const [addInvestor, { data, loading }] = useMutation(INVITE_INVESTOR, { variables: { user_id: investor._id, deal_id: deal._id }})

  useEffect(() => {
    if (loading) setStatus("pending")
    if (data) {
      setStatus("done")
      setSearchQ("")
      refetch()
    }
  }, [data, loading])

  if (status === "pending") {
    return <FontAwesomeIcon icon="circle-notch" spin />
  } else if (status === "done") {
    return <FontAwesomeIcon icon="check" />
  } else {
    return <FontAwesomeIcon icon="plus-circle" onClick={() => addInvestor()} />
  }
}

function RmInvestor ({ investor, deal, refetch }) {
  const [status, setStatus] = useState(null)
  const [rmInvestor, { data, loading }] = useMutation(UNINVITE_INVESTOR, { variables: { user_id: investor._id, deal_id: deal._id }})

  useEffect(() => {
    if (loading) setStatus("pending")
    if (data) {
      setStatus("done")
      refetch()
    }
  }, [data, loading])

  if (status === "pending") {
    return <FontAwesomeIcon icon="circle-notch" spin />
  } else if (status === "done") {
    return <FontAwesomeIcon icon="check" />
  } else {
    return <FontAwesomeIcon icon="times" onClick={() => rmInvestor()} />
  }
}