import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import * as API from "../../api"
import { useMutation, useQuery, useLazyQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { useParams, Link } from 'react-router-dom'
import { nWithCommas, formatDate } from '../../utils/numbers'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Paper, Table, TableBody, TableCell, TextField, TableRow, Button, InputAdornment } from '@material-ui/core'
import { Col, Row } from 'reactstrap'
import Loader from '../utils/Loader'
import "./style.scss"

const GET_MEMBERS = gql`
  query GetMembers($slug: String!) {
    organizationMembers(slug: $slug) {
      _id
      name
      email
      investor_type
      first_name
      last_name
    }
    organization(slug: $slug) {
      _id
      name
      adminInvites {
        to
        status
        sent_at
      }
    }
  }
`

const SEND_ADMIN_INVITE = gql`
  mutation SendAdminInvite($slug: String!, $user_id: String!) {
    sendAdminInvite(slug: $slug, user_id: $user_id) {
      status
    }
  }
`

const REVOKE_MEMBERSHIP = gql`
  mutation RevokeMembership($slug: String!, $user_id: String!) {
    revokeOrganizationMembership(slug: $slug, user_id: $user_id) {
      _id
    }
  }
`

const ADD_MEMBERSHIP = gql`
  mutation AddMembership($slug: String!, $user_id: String!) {
    addOrganizationMembership(slug: $slug, user_id: $user_id) {
      _id
    }
  }
`

export default function OrganizationMembers () {
  const { organization } = useParams()
  const { data, error, loading, refetch } = useQuery(GET_MEMBERS, { variables: { slug: organization }})
  const [revokeMembership] = useMutation(REVOKE_MEMBERSHIP, {
    variables: { slug: organization },
    onCompleted: refetch
  })

  const [sendAdminInvite] = useMutation(SEND_ADMIN_INVITE, {
    variables: { slug: organization },
    onCompleted: refetch
  })

  if (!data) return <Loader />

  return (
    <div className="OrganizationMembers">
      <Row>
        <Col sm={{size: 8, offset: 1}}>
          <h4>{data.organization.name} Admin Members</h4>
          <Paper style={{margin: "10px 0px"}}>
            <UserSearch refetch={refetch} />
          </Paper>
          <Paper style={{marginTop: "15px"}}>
            <Table>
              <TableBody>
                {data.organizationMembers.map(member => (
                  <Member key={member._id} org={data.organization} member={member} sendAdminInvite={sendAdminInvite} revokeMembership={revokeMembership} />
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Col>
      </Row>
    </div>
  )
}

function Member ({ org, member, sendAdminInvite, revokeMembership }) {
  const invite = org.adminInvites.find(i => i.to === member.email)

  const inviteArea = invite 
    ? <Button size="small" className="sent-invite" endIcon={<FontAwesomeIcon icon="paper-plane" />}>Sent </Button>
    : <Button color="secondary" size="small" className="send-invite"
        variant="contained" 
        onClick={() => sendAdminInvite({ variables: { user_id: member._id }})} 
        endIcon={<FontAwesomeIcon icon="envelope" />}>
        Send
      </Button>

  return (
    <TableRow>
      <TableCell>{member.name} {(member.first_name && member.investor_type === "entity") ? `[${member.first_name} ${member.last_name}]` : "" }</TableCell>
      <TableCell>{member.email}</TableCell>
      <TableCell>{inviteArea}</TableCell>
      <TableCell>
        <Button color="secondary"
          variant="contained"
          onClick={() => revokeMembership({ variables: { user_id: member._id } })}>
          Revoke
        </Button>
      </TableCell>
    </TableRow>
  )
}

function UserSearch ({ refetch }) {
  const { organization } = useParams()
  const [q, setQ] = useState("")
  const [records, setRecords] = useState([])
  const [search, searchRes] = useLazyQuery(API.users.search, { variables: { org: "allocations" }})
  const [addMembership] = useMutation(ADD_MEMBERSHIP, { 
    variables: { slug: organization },
    onCompleted: () => refetch() && setQ("") && setRecords([])
  })

  useEffect(() => {
    search({ variables: { q } })
  }, [q])

  useEffect(() => {
    if (searchRes.data && searchRes.data.searchUsers) {
      setRecords(q === "" ? [] : searchRes.data.searchUsers)
    } 
  }, [searchRes.data])

  return (
    <div className="assoc-search">
      <TextField style={{width: "100%"}}
        required
        value={q}
        label="Add Admin"
        variant="filled"
        onChange={e => setQ(e.target.value)} />
      <Paper className="assoc-search-results">
        <Table>
          <TableBody>
            {records.map(record => (
              <TableRow key={record._id} 
                className="assoc-option" 
                onClick={() => addMembership({ variables: { user_id: record._id } })}>
                <TableCell>{record.name} {(record.first_name && record.investor_type === "entity") ? `[${record.first_name} ${record.last_name}]` : "" }</TableCell>
                <TableCell>{record.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  )
}