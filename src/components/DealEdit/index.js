import React, { useState, useEffect } from 'react'
import { useSimpleReducer } from '../../utils/hooks'
import _, { get, isEqual } from "lodash"
import { useParams } from "react-router-dom"
import { Row, Col } from 'reactstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nWithCommas } from '../../utils/numbers'
import * as API from "../../api"
import UserSearch from "../forms/UserSearch"

// wysiwyg editor
import { Editor } from '@tinymce/tinymce-react';

import { gql } from 'apollo-boost'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'

import { Table, TableBody, TableCell, TableRow, Paper, Button } from '@material-ui/core'
import { FormControl, Select, MenuItem, InputLabel, TextField, InputAdornment } from "@material-ui/core"
import "./style.scss"

const GET_DEAL = gql`
  query Deal($id: String!, $slug: String!) {
    organization(slug: $slug) {
      _id
      deal(_id: $id) {
        _id
        company_name
        company_description
        date_closed
        deal_lead
        pledge_link
        onboarding_link
        allInvited
        status
        inviteKey
        target
        memo
        documents {
          path
          link
        }
        investments {
          _id
          status
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
  }
`

const UPDATE_DEAL = gql`
  mutation UpdateDeal($org: String!, $deal: DealInput!) {
    updateDeal(org: $org, deal: $deal) {
      _id
      company_name
      company_description
      date_closed
      deal_lead
      pledge_link
      onboarding_link
      status
      allInvited
      inviteKey
      memo
      invitedInvestors {
        _id
        name
      }
    }
  }
`

const validInputs = ["_id","company_name","company_description","date_closed","deal_lead","pledge_link","onboarding_link","embed_code","status","closed","allInvited","amount", "memo"]

export default function DealEdit () {
  const { id, organization } = useParams()
  const [errorMessage, setErrorMessage] = useState(null)
  const [searchQ, setSearchQ] = useState("")
  const [deal, setDeal] = useSimpleReducer({})
  const [showAddInvestment, setShowAddInvestment] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const { data, refetch, error } = useQuery(GET_DEAL, { variables: { id, slug: organization }})
  const [updateDeal] = useMutation(UPDATE_DEAL)
  const [search, searchRes] = useLazyQuery(API.users.search)

  useEffect(() => {
    if (data) {
      if (data.organization.deal) {
        setDeal(data.organization.deal)
      } else {
        setErrorMessage("Not Authorized to View this Deal")
      }
    }
  }, [data])

  useEffect(() => {
    setHasChanges(data && !isEqual(deal, get(data, 'organization.deal')))
  }, [deal])

  useEffect(() => {
    search({ variables: { q: searchQ, org: organization } })
  }, [searchQ])

  if (errorMessage) return <div className="Error">{errorMessage}</div>
  
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
          <Col sm={{size: 4, offset: 0}}>
            <FormControl variant="filled" style={{width: "100%"}}>
              <InputLabel>All Invited</InputLabel>
              <Select value={deal.allInvited || "false"}
                onChange={e => setDeal({ allInvited: e.target.value === "true" })}
                inputProps={{name: 'Type'}}>
                <MenuItem value="false">False</MenuItem>
                <MenuItem value="true">True</MenuItem>
              </Select>
            </FormControl>
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 8, offset: 1}}>
            <InputLabel>Deal Description</InputLabel>
            <Editor
              value={deal.memo}
              apiKey="jlbrhzgo0m2myqdmbhaav8a0971vomza2smty20fpq6fs47j"
              init={{
               height: 350,
               menubar: false,
               plugins: [
                 'advlist autolink lists link image charmap print preview anchor',
                 'searchreplace visualblocks code fullscreen',
                 'insertdatetime media table paste code help wordcount'
               ],
               toolbar:
                 'undo redo | formatselect | bold italic backcolor | \
                 alignleft aligncenter alignright alignjustify | \
                 bullist numlist outdent indent | removeformat | help'
               }}
               onEditorChange={memo => setDeal({ memo })}
             />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 8, offset: 1}}>
            <Button disabled={!hasChanges} 
              variant="contained"
              onClick={() => updateDeal({ variables: { deal: _.pick(deal, validInputs), org: organization } })} 
              color="primary">
              UPDATE DEAL
            </Button> 
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 8, offset: 1}}>
            <DataRoom refetch={refetch} deal={deal} />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 8, offset: 1}} style={{marginBottom: "10px"}}>
            <TextField
              style={{width: "100%"}}
              label="For Users without an Account!" 
              value={`dashboard.allocations.co/public/deals/${encodeURI(deal.company_name)}?invite_code=${deal.inviteKey}`}
              InputProps={{
                endAdornment: <InputAdornment position="end"><FontAwesomeIcon icon="copy" onClick={() => navigator.clipboard.writeText(`dashboard.allocations.co/public/deals/${encodeURI(deal.company_name)}?invite_code=${deal.inviteKey}`)} /></InputAdornment>,
              }}
              variant="filled" />
          </Col>
          <Col sm={{size: 8, offset: 1}}>
            <TextField 
              style={{width: "100%"}}
              label="For Existing Users who have been invited!" 
              value={`dashboard.allocations.co/deals/${encodeURI(deal.company_name)}`}
              InputProps={{
                endAdornment: <InputAdornment position="end"><FontAwesomeIcon icon="copy" onClick={() => navigator.clipboard.writeText(`dashboard.allocations.co/deals/${encodeURI(deal.company_name)}`)} /></InputAdornment>,
              }}
              variant="filled" />
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
                      <TableCell>
                        <AddInvestor investor={investor} deal={deal} setSearchQ={setSearchQ} refetch={refetch} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
            <Paper className="table-wrapper">
              <Table>
                <TableBody>
                  <InvitedInvestors deal={deal} refetch={refetch} />
                </TableBody>
              </Table>
            </Paper>
          </Col>
          <Col sm={{size: 5}} className="investments">
            <AddInvestment deal={deal} show={showAddInvestment} refetch={refetch} /> 
            <Paper>
              <Table>
                <TableBody>
                  {_.get(deal, 'investments', []).map(inv => (
                    <Investment key={inv._id} investment={inv} refetch={refetch} />
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

const ADD_DOC = gql`
  mutation AddDealDoc($deal_id: String!, $title: String!, $doc: Upload!) {
    addDealDoc(deal_id: $deal_id, title: $title, doc: $doc) {
      _id
    }
  }
`

function DataRoom ({ deal, refetch }) {
  const [doc, setDoc] = useSimpleReducer({ title: "" })
  const [addDoc, { data, error }] = useMutation(ADD_DOC)

  useEffect(() => {
    if (data) {
      refetch()
      setDoc({ title: "", doc: null })
    }
  }, [data])

  const submit = () => {
    if (doc.doc && doc.title) {
      addDoc({ variables: { deal_id: deal._id, ...doc } })
    }
  }

  return (
    <div className="edit-deal-data-room">
      <div className="form-sub-title">Data Room</div>
      <div className="add-doc">
        {doc.doc && <span><FontAwesomeIcon icon="link" /> {doc.doc.name}</span>}
        {!doc.doc && <Button variant="contained" component="label">
          Attach
          <input type="file" 
            style={{ display: "none" }}
            accept="application/pdf" 
            onChange={({ target }) => {
              if (target.validity.valid) setDoc({ doc: target.files[0] })
            }} />
        </Button>}
        <TextField required
          variant="filled"
          label="Title"
          style={{width: "250px"}}
          value={doc.title}
          onChange={e => setDoc({ title: e.target.value })} />
        <Button variant="contained" 
          onClick={submit}
          color="primary">
          Upload to Data Room
        </Button>
      </div>
      <div className="deal-data-room-docs">
        {(deal.documents || []).map(doc => (
          <Doc key={doc.path} doc={doc} deal={deal} refetch={refetch} />
        ))}
      </div>
    </div>  
  )
}

const RM_DOC = gql`
  mutation RmDoc($deal_id: String!, $title: String!) {
    rmDealDoc(deal_id: $deal_id, title: $title) {
      _id
    }
  }
`

function Doc ({ doc, deal, refetch }) {

  const [rmDoc, { data, error }] = useMutation(RM_DOC)

  useEffect(() => {
    if (data) refetch()
  }, [data])

  const submit = () => {
    if (window.confirm(`Delete ${doc.path} document?`)) {
      rmDoc({ variables: { deal_id: deal._id, title: doc.path } })
    }
  }

  return (
    <span>
      <a href={`https://${doc.link}`} target="_blank">
        <FontAwesomeIcon icon="link" /> &nbsp;{doc.path} &nbsp;&nbsp;
      </a>
      <FontAwesomeIcon icon="times" onClick={submit} />
    </span>
  )
}

const UPDATE_INVESTMENT = gql`
  mutation UpdateInvestment($investment: InvestmentInput!) {
    updateInvestment(investment: $investment) {
      _id
      status
      amount
      investor {
        _id
        name
      }
    }
  }
`

function Investment ({ investment: i, refetch }) {
  const [editing, setEditing] = useState(false)
  const [changes, setChanges] = useSimpleReducer({})
  const [updateInvestment] = useMutation(UPDATE_INVESTMENT)

  const update = () => {
    updateInvestment({ 
      variables: { investment: { _id: i._id, ...changes } }
    })
  }

  if (editing) {
    return (
      <TableRow>
        <TableCell colSpan={4}>
        <Paper className="investment-edit">
          <div className="investor-name">
            {get(i, 'investor.name')}
            <FontAwesomeIcon icon="times" onClick={() => setEditing(false)} />
          </div>

          <TextField value={changes.amount ||i.amount || ""} onChange={e => setChanges({ amount: Number(e.target.value) })}
            label="Amount" variant="filled" style={{width: "100%", marginBottom: "10px"}} />

          <FormControl variant="filled" style={{width: "100%", marginBottom: "10px"}}>
            <InputLabel>Status</InputLabel>
            <Select value={changes.status || i.status || ""} 
              onChange={e => setChanges({ status: e.target.value })}
              inputProps={{name: 'Type'}}>
              <MenuItem value="invited">Invited</MenuItem>
              <MenuItem value="pledged">Pledged</MenuItem>
              <MenuItem value="onboarded">Onboarded</MenuItem>
              <MenuItem value="complete">Complete</MenuItem>
            </Select>
          </FormControl>
          <div>
            <Button 
              variant="contained"
              onClick={update} 
              color="primary">
              UPDATE
            </Button>
          </div>
        </Paper>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableRow className="invited-inv">
      <TableCell>{get(i, 'investor.name')}</TableCell>
      <TableCell>{i.amount ? "$" + nWithCommas(i.amount) : "TBD"}</TableCell>
      <TableCell>
        <span className={`investment-status investment-status-${i.status}`}>{i.status}</span>
      </TableCell>
      <TableCell>
        [<span className="edit-button" onClick={() => setEditing(true)}>edit</span>]
        &nbsp;<DeleteInvestment investment={i} refetch={refetch} />
      </TableCell>
    </TableRow>
  )
}

function DeleteInvestment ({ investment, refetch }) {
  const [delInvestment, { data }] = useMutation(API.investments.destroy)

  useEffect(() => {
    if (data && data.deleteInvestment) refetch()
  }, [data])

  const submit = () => {
    if (window.confirm("Delete Investment?")) delInvestment({ variables: { id: investment._id }})
  }

  return <FontAwesomeIcon icon="times" onClick={submit} />
}

function validate (investment) {
  return _.reject(['deal_id', 'user_id', 'amount', 'status'], prop => investment[prop])
}

function AddInvestment ({ deal, show, refetch }) {
  const [investment, setInvestment] = useSimpleReducer({ amount: "", status: "complete" })
  const [createInvestment, { data }] = useMutation(API.investments.create)
  const [user, setUser] = useState(null)
  const [errors, setErrors] = useState([])

  useEffect(() => {
    if (deal && !investment.deal_id) {
      setInvestment({ deal_id: deal._id }) 
    }
  }, [deal])

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
      <div>
        <FormControl variant="filled" style={{width: "100%", marginBottom: "10px"}}>
          <InputLabel>Status</InputLabel>
          <Select value={investment.status || ""} 
            onChange={e => setInvestment({ status: e.target.value })}
            inputProps={{name: 'Type'}}>
            <MenuItem value="invited">Invited</MenuItem>
            <MenuItem value="pledged">Pledged</MenuItem>
            <MenuItem value="onboarded">Onboarded</MenuItem>
            <MenuItem value="complete">Complete</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Button variant="contained"
        onClick={submit} 
        color="primary">
        ADD INVESTMENT
      </Button>
    </div>
  )
}

function InvitedInvestors ({ deal, refetch }) {
  if (_.isEmpty(deal)) {
    return (
      <TableRow className="loading-table">
        <TableCell><FontAwesomeIcon icon="circle-notch" spin /></TableCell>
      </TableRow>
    )
  }

  if (deal.allInvited) {
    return (
      <TableRow className="loading-table">
        <TableCell><FontAwesomeIcon icon="users" /> All Users Invited</TableCell>
      </TableRow>
    )
  }

  if (get(deal, 'invitedInvestors.length', 0) === 0) {
    return (
      <TableRow className="invited-investors-none">
        <TableCell>None</TableCell>
      </TableRow>
    )
  }

  return (
    (deal.invitedInvestors || []).map(investor => (
      <TableRow key={investor._id} sm={{size: 4, offset: 1}}>
        <TableCell>{investor.name}</TableCell>
        <TableCell>{investor.email}</TableCell>
        <TableCell><RmInvestor investor={investor} deal={deal} refetch={refetch} /></TableCell>
      </TableRow>
    ))
  )
}

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

function AddInvestor ({ investor, deal, setSearchQ, refetch }) {
  const { organization: org } = useParams()
  const [status, setStatus] = useState(null)
  const [addInvestor, { data, loading }] = useMutation(INVITE_INVESTOR, { variables: { org, user_id: investor._id, deal_id: deal._id }})

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
  const { organization: org } = useParams()
  const [status, setStatus] = useState(null)
  const [rmInvestor, { data, loading }] = useMutation(UNINVITE_INVESTOR, { variables: { org, user_id: investor._id, deal_id: deal._id }})

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