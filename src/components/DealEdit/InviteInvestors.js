import React, {useState, useEffect} from 'react'
import _ from 'lodash'
import {gql} from 'apollo-boost'
import {Col, Row} from 'reactstrap'
import {useParams} from 'react-router-dom'
import {useQuery, useLazyQuery, useMutation} from '@apollo/react-hooks'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Table, TableBody, TableCell, TableRow, Paper, Button} from '@material-ui/core'
import {FormControl, Select, MenuItem, InputLabel, TextField, InputAdornment} from "@material-ui/core"

import * as API from "../../api"
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const INVITE_INVESTOR = gql`
  mutation InviteInvestor($org: String!, $user_id: String!, $deal_id: String!) {
    inviteInvestor(org: $org, user_id: $user_id, deal_id: $deal_id) {
      _id
    }
  }
`

const UNINVITE_INVESTOR = gql`
  mutation UninviteInvestor($org: String!, $user_id: String!, $deal_id: String!) {
    uninviteInvestor(org: $org, user_id: $user_id, deal_id: $deal_id) {
      _id
    }
  }
`

export default function InviteInvestors({deal, refetch}) {
  const {organization} = useParams()
  const [searchQ, setSearchQ] = useState("")
  const [search, searchRes] = useLazyQuery(API.users.search)

  useEffect(() => {
    search({variables: {q: searchQ, org: organization}})
  }, [searchQ])

  return (
    <>
      <Typography variant="h5" style={{marginBottom: 16}}>
        Invited Investors
      </Typography>

      {/* <TextField variant="outlined"
                 style={{width: "100%", marginBottom: "16px"}}
                 value={searchQ}
                 onChange={e => setSearchQ(e.target.value)}
                 label="Search Investors"/> */}

      <SendEmailInvites deal={deal} refetch={refetch}/>

      {/* TODO: Null State missing */}

      <Paper className="table-wrapper" style={{marginBottom: "10px"}}>
        <Table>
          <TableBody>
            {(searchQ !== "" ? _.get(searchRes, 'data.searchUsers', []) : []).map(investor => (
              <AddInvestor key={investor._id} investor={investor} deal={deal} setSearchQ={setSearchQ}
                           refetch={refetch}/>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Paper className="table-wrapper">
        <Table size="small" className="invited-investors">
          <TableBody>
            <InvitedInvestors deal={deal} refetch={refetch}/>
          </TableBody>
        </Table>
      </Paper>
    </>
  )
}

const SEND_INVITE = gql`
  mutation SendInvite($email: String!, $org: String!, $deal_id: String!) {
    inviteNewUser(org: $org, deal_id: $deal_id, email: $email) {
      status
    }
  }
`

function SendEmailInvites({deal, refetch}) {
  const {organization} = useParams()
  const [email, setEmail] = useState("")
  const [sendInvite, {data, error}] = useMutation(SEND_INVITE, {onCompleted: refetch})

  const submit = () => {
    if (/^.+@.+\..+$/.test(email)) {
      sendInvite({variables: {email, org: organization, deal_id: deal._id}})
    }
  }

  if (error) return <div>{error.message}</div>

  const invitedInvestors = (_.get(deal, 'invitedInvestors') || []).map(i => i.email)

  return (
    <div>
      <TextField value={email}
                 variant="outlined"
                 onChange={e => setEmail(e.target.value)}
                 label="Email Address"
                 helperText="Invite Investor outside of Allocations by Email"
      />

      <Button variant="contained"
              color="secondary"
              size="small"
              onClick={submit}
              style={{verticalAlign: "middle"}}>
        Send
      </Button>

      <Paper className="email-invites-table" style={{padding: "10px 5px", margin: "10px 0px"}}>
        <Table>
          <TableBody>
            {(deal.emailInvites || []).filter(invite => {
              return !invitedInvestors.includes(invite.to)
            }).map(invite => (
              <PrivateInvite key={invite.sent_at} invite={invite}/>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  )
}

function PrivateInvite({invite}) {
  return (
    <TableRow key={invite.sent_at}>
      <TableCell>{invite.to}</TableCell>
      <TableCell>{invite.opened ? "Opened" : "Sent"} &nbsp;<FontAwesomeIcon
        icon={invite.opened ? "envelope-open-text" : "paper-plane"}/></TableCell>
    </TableRow>
  )
}

function InvitedInvestors({deal, refetch}) {
  if (_.isEmpty(deal)) {
    return (
      <TableRow className="loading-table">
        <TableCell><FontAwesomeIcon icon="circle-notch" spin/></TableCell>
      </TableRow>
    )
  }

  if (deal.allInvited) {
    return (
      <TableRow className="loading-table">
        <TableCell><FontAwesomeIcon icon="users"/> All Users Invited</TableCell>
      </TableRow>
    )
  }

  if (_.get(deal, 'invitedInvestors.length', 0) === 0) {
    return (
      <TableRow className="invited-investors-none">
        <TableCell>None</TableCell>
      </TableRow>
    )
  }

  return (
    (deal.invitedInvestors || []).map(investor => (
      <InvitedInvestor key={investor._id} investor={investor} deal={deal} refetch={refetch}/>
    ))
  )
}

function InvitedInvestor({investor, deal, refetch}) {
  const {organization} = useParams()
  const [sendInvite, {data, error}] = useMutation(
    SEND_INVITE,
    {
      variables: {org: organization, deal_id: deal._id, email: investor.email},
      onCompleted: refetch
    }
  )

  const invites = (deal.emailInvites || []).filter(i => i.to === investor.email)
  const emailSection = invites.length
    ? <React.Fragment>
      <Button size="small" className="sent-invite"
              endIcon={<FontAwesomeIcon icon="paper-plane"/>}>Sent {invites.length}</Button>
      <Button size="small" className="send-again" color="primary" variant="contained"
              onClick={sendInvite}>Resend</Button>
    </React.Fragment>
    : <Button color="secondary" size="small" className="send-invite"
              variant="contained"
              onClick={sendInvite}
              endIcon={<FontAwesomeIcon icon="envelope"/>}>
      Send
    </Button>


  return (
    <TableRow sm={{size: 4, offset: 1}}>
      <TableCell>{investor.name}</TableCell>
      <TableCell>{investor.email}</TableCell>
      <TableCell>{emailSection}</TableCell>
      <TableCell><RmInvestor investor={investor} deal={deal} refetch={refetch}/></TableCell>
    </TableRow>
  )
}

function AddInvestor({investor, deal, setSearchQ, refetch}) {
  const {organization: org} = useParams()
  const [status, setStatus] = useState(null)
  const [addInvestor, {data, loading}] = useMutation(INVITE_INVESTOR, {
    variables: {
      org,
      user_id: investor._id,
      deal_id: deal._id
    }
  })

  useEffect(() => {
    if (loading) setStatus("pending")
    if (data) {
      setStatus("done")
      setSearchQ("")
      refetch()
    }
  }, [data, loading])

  let icon;
  if (status === "pending") {
    icon = {icon: "circle-notch", spin: true}
  } else if (status === "done") {
    icon = {icon: "check"}
  } else {
    icon = {icon: "plus-circle"}
  }

  return (
    <TableRow sm={{size: 4, offset: 1}} onClick={() => addInvestor()} className="invited-investor">
      <TableCell>{investor.name}</TableCell>
      <TableCell>{investor.email}</TableCell>
      <TableCell>
        <FontAwesomeIcon {...icon} />
      </TableCell>
    </TableRow>
  )
}

function RmInvestor({investor, deal, refetch}) {
  const {organization: org} = useParams()
  const [status, setStatus] = useState(null)
  const [rmInvestor, {data, loading}] = useMutation(UNINVITE_INVESTOR, {
    variables: {
      org,
      user_id: investor._id,
      deal_id: deal._id
    }
  })

  useEffect(() => {
    if (loading) setStatus("pending")
    if (data) {
      setStatus("done")
      refetch()
    }
  }, [data, loading])

  if (status === "pending") {
    return <FontAwesomeIcon icon="circle-notch" spin/>
  } else if (status === "done") {
    return <FontAwesomeIcon icon="check"/>
  } else {
    return <FontAwesomeIcon icon="times" onClick={() => rmInvestor()}/>
  }
}
