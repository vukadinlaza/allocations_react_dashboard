import React, { useState, useEffect } from 'react'
import { get, isEqual } from "lodash"
import { useParams } from "react-router-dom"
import { TextField } from '@material-ui/core'
import { Row, Col } from 'reactstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { gql } from 'apollo-boost'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'

import { Table, TableBody, TableCell, TableRow, TableHead, Paper, Button } from '@material-ui/core'
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
      closed
      invitedInvestors {
        _id
        first_name
        last_name
        email
      }
    } 
  }
`

const UPDATE_DEAL = gql`
  mutation UpdateDeal($_id: String!, $company_name: String, $company_description: String, $deal_lead: String, $date_closed: String, $pledge_link: String, $onboarding_link: String) {
    updateDeal(_id: $_id, company_name: $company_name, company_description: $company_description, deal_lead: $deal_lead, date_closed: $date_closed, pledge_link: $pledge_link, onboarding_link: $onboarding_link) {
      _id
      company_name
      company_description
      date_closed
      deal_lead
      pledge_link
      onboarding_link
      closed
      invitedInvestors {
        _id
        first_name
        last_name
        email
      }
    }
  }
`

const SEARCH_USERS = gql`
  query SearchUsers($q: String!) {
    searchUsers(q: $q) {
      _id
      first_name
      last_name
      email
    }
  }
`

export default function DealEdit () {
  const params = useParams()
  const [searchQ, setSearchQ] = useState("")
  const [deal, setDeal] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)
  const { data, loading, refetch } = useQuery(GET_DEAL, { variables: { id: params.id }})
  const [updateDeal, updateDealRes] = useMutation(UPDATE_DEAL)
  const [search, searchRes] = useLazyQuery(SEARCH_USERS)

  useEffect(() => {
    if (data && !deal) {
      setDeal(data.deal)
    }
  }, [data, deal])

  // updates deal when data returned from update mutation
  useEffect(() => {
    if (updateDealRes && updateDealRes.data) setDeal(updateDealRes.data.deal)
  }, [updateDealRes])

  useEffect(() => {
    setHasChanges(data && !isEqual(deal, get(data, 'deal')))
  }, [deal])

  const updateDealProp = ({ prop, newVal }) => {
    setDeal(prev => ({ ...prev, [prop]: newVal }))
  }

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
              value={get(deal, 'company_name', "")} 
              onChange={e => updateDealProp({ prop: "company_name", newVal: e.target.value })}
              label="Company Name" 
              variant="filled" />
          </Col>
          <Col sm={{size: 4}}>
            <TextField style={{width: "100%"}} 
              value={get(deal, 'deal_lead', "")}
              onChange={e => updateDealProp({ prop: "deal_lead", newVal: e.target.value })}
              label="Deal Lead" 
              variant="filled" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 6, offset: 1}}>
            <TextField style={{width: "100%"}} 
              value={get(deal, 'company_description', "")} 
              onChange={e => updateDealProp({ prop: "company_description", newVal: e.target.value })}
              label="Company Description" 
              variant="filled" />
          </Col>
          <Col sm={{size: 2}}>
            <TextField style={{width: "100%"}} 
              value={get(deal, 'date_closed', "")}
              onChange={e => updateDealProp({ prop: "date_closed", newVal: e.target.value })} 
              label="Closing Date" 
              variant="filled" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 4, offset: 1}}>
            <TextField style={{width: "100%"}} 
              value={get(deal, 'pledge_link', "")} 
              onChange={e => updateDealProp({ prop: "pledge_link", newVal: e.target.value })}
              label="Pledge Link" 
              variant="filled" />
          </Col>
          <Col sm={{size: 4}}>
            <TextField style={{width: "100%"}}
              value={get(deal, 'onboarding_link', "")}
              onChange={e => updateDealProp({ prop: "onboarding_link", newVal: e.target.value })} 
              label="Onboarding Link" 
              variant="filled" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 8, offset: 1}}>
            <Button disabled={!hasChanges} 
              variant="contained"
              onClick={() => updateDeal({ variables: deal })} 
              color="primary">
              UPDATE DEAL
            </Button> 
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 8, offset: 1}}>
            <div className="form-sub-title">Invited Investors</div>
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 4, offset: 1}} className="invited-investors">
            <Paper className="table-wrapper">
              <Table>
                <TableBody>
                  <InvitedInvestors data={data} refetch={refetch} />
                </TableBody>
              </Table>
            </Paper>
          </Col>
          <Col sm={{size: 4}} className="search-investors">
            <TextField style={{width: "100%"}} value={searchQ} onChange={e => setSearchQ(e.target.value)} label="Search Investors" variant="filled" />
            <Paper className="table-wrapper">
              <Table>
                <TableBody>
                  {(searchQ !== "" ? get(searchRes, 'data.searchUsers', []) : []).map(investor => (
                    <TableRow key={investor._id} sm={{size: 4, offset: 1}} className="invited-investor">
                      <TableCell>{investor.first_name} {investor.last_name}</TableCell>
                      <TableCell>{investor.email}</TableCell>
                      <TableCell><AddInvestor investor={investor} deal={data.deal} setSearchQ={setSearchQ} refetch={refetch} /></TableCell>
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
        <TableCell>{investor.first_name} {investor.last_name}</TableCell>
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