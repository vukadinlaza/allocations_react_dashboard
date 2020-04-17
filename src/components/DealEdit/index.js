import React, { useState, useEffect } from 'react'
import { useSimpleReducer } from '../../utils/hooks'
import _, { get, isEqual } from "lodash"
import { useParams, Link } from "react-router-dom"
import { Row, Col } from 'reactstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nWithCommas, formatDate } from '../../utils/numbers'
import * as API from "../../api"
import UserSearch from "../forms/UserSearch"
import InviteInvestors from './InviteInvestors'

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
        slug
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
        amount_raised
        memo
        last_valuation
        no_exchange
        appLink
        publicLink
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
        emailInvites {
          status
          sent_at
          to
          opened
          opened_at
        }
        dealParams {
          totalRoundSize
          allocation
          totalCarry
          minimumInvestment
          totalManagementFee
          estimatedSetupCosts
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
      target
      amount_raised
      invitedInvestors {
        _id
        name
      }
      dealParams {
        totalRoundSize
        allocation
        totalCarry
        minimumInvestment
        totalManagementFee
        estimatedSetupCosts
      }
    }
  }
`

const validInputs = [
  "_id",
  "company_name",
  "company_description",
  "date_closed",
  "deal_lead",
  "pledge_link",
  "onboarding_link",
  "embed_code",
  "status",
  "closed",
  "allInvited",
  "amount",
  "memo",
  "target",
  "amount_raised",
  "no_exchange",
  "last_valuation",
  "dealParams"
]

const dealParamsValidInputs = [
  "allocation",
  "totalCarry",
  "minimumInvestment",
  "totalManagementFee",
  "estimatedSetupCosts",
  "totalRoundSize"
]

export default function DealEdit () {
  const { id, organization } = useParams()
  const [errorMessage, setErrorMessage] = useState(null)
  const [deal, setDeal] = useSimpleReducer({
    dealParams: {}
  })
  const [showAddInvestment, setShowAddInvestment] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const { data, refetch, error } = useQuery(GET_DEAL, { variables: { id, slug: organization }})
  const [updateDeal] = useMutation(UPDATE_DEAL)

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

  if (errorMessage) return <div className="Error">{errorMessage}</div>

  return (
    <div className="DealEdit form-wrapper">
      <Row>
        <Col sm={{size: 8, offset: 1}}>
          <div className="form-title">
            Edit Deal&nbsp;&nbsp;
            <Link to={deal.appLink || "#"}><Button variant="contained" color="primary">view</Button></Link>
          </div>
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
          <Col sm={{size: 4, offset: 1}}>
            <TextField style={{width: "100%"}} 
              value={deal.target || ""}
              onChange={e => setDeal({ target: e.target.value })} 
              label="Target Raise"
              InputProps={{
                startAdornment: <InputAdornment position="start"><FontAwesomeIcon icon="dollar-sign" /></InputAdornment>,
              }} 
              variant="filled" />
          </Col>
          <Col sm={{size: 4}}>
            <TextField style={{width: "100%"}} 
              value={deal.amount_raised || ""}
              onChange={e => setDeal({ amount_raised: e.target.value })} 
              label="Amount Raised"
              InputProps={{
                startAdornment: <InputAdornment position="start"><FontAwesomeIcon icon="dollar-sign" /></InputAdornment>,
              }} 
              variant="filled" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 8, offset: 1}}>
            <h5>Deal Parameters</h5>
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 4, offset: 1}}>
            <TextField style={{width: "100%"}} 
              value={deal.dealParams.totalRoundSize || ""}
              onChange={e => setDeal({ dealParams: { ...deal.dealParams, totalRoundSize: e.target.value }})} 
              label="Total Round Size"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }} 
              variant="filled" />
          </Col>
          <Col sm={{size: 4}}>
            <TextField style={{width: "100%"}} 
              value={deal.dealParams.allocation || ""}
              onChange={e => setDeal({ dealParams: { ...deal.dealParams, allocation: e.target.value }})} 
              label="Allocation"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }} 
              variant="filled" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 4, offset: 1}}>
            <TextField style={{width: "100%"}} 
              value={deal.dealParams.totalCarry || ""}
              onChange={e => setDeal({ dealParams: { ...deal.dealParams, totalCarry: e.target.value }})} 
              label="Total Carry"
              InputProps={{
                startAdornment: <InputAdornment position="start">%</InputAdornment>,
              }} 
              variant="filled" />
          </Col>
          <Col sm={{size: 4}}>
            <TextField style={{width: "100%"}} 
              value={deal.dealParams.minimumInvestment || ""}
              onChange={e => setDeal({ dealParams: { ...deal.dealParams, minimumInvestment: e.target.value }})} 
              label="Minimum Investment"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }} 
              variant="filled" />
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
            <h5>Exchange Data</h5>
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 4, offset: 1}}>
            <FormControl variant="filled" style={{width: "100%"}}>
              <InputLabel>Exchange Options</InputLabel>
              <Select value={deal.no_exchange || false}
                onChange={e => setDeal({ no_exchange: e.target.value === "true" })}
                inputProps={{name: 'Type'}}>
                <MenuItem value="false">Exchange Allowed</MenuItem>
                <MenuItem value="true">Do Not Allow Exchange</MenuItem>
              </Select>
            </FormControl>
          </Col>
          <Col sm={{size: 4}}>
            <TextField style={{width: "100%"}}
              value={deal.last_valuation || ""}
              onChange={e => setDeal({ last_valuation: e.target.value })}
              label="Last Valuation"
              InputProps={{
                startAdornment: <InputAdornment position="start"><FontAwesomeIcon icon="dollar-sign" /></InputAdornment>,
              }}
              variant="filled" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 8, offset: 1}}>
            <Button disabled={!hasChanges} 
              variant="contained"
              onClick={() => {
                updateDeal({ variables: { deal: {..._.pick(deal, validInputs), dealParams: _.pick(deal.dealParams, dealParamsValidInputs) }, org: organization } })
              }} 
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
              label="Public Link" 
              value={window.origin + (deal.publicLink || "")}
              InputProps={{
                endAdornment: <InputAdornment position="end"><FontAwesomeIcon icon="copy" onClick={() => navigator.clipboard.writeText(window.origin + (deal.publicLink || ""))} /></InputAdornment>,
              }}
              variant="filled" />
          </Col>
          <Col sm={{size: 8, offset: 1}}>
            <TextField 
              style={{width: "100%"}}
              label="Existing user link" 
              value={window.origin + (deal.appLink || "")}
              InputProps={{
                endAdornment: <InputAdornment position="end"><FontAwesomeIcon icon="copy" onClick={() => navigator.clipboard.writeText(window.origin + (deal.appLink || ""))} /></InputAdornment>,
              }}
              variant="filled" />
          </Col>
        </Row>
        <Row>
          <InviteInvestors deal={deal} refetch={refetch} />
          <Col lg={{size: 5, offset: 0}} md={{size: 8, offset: 1}} className="investments">
            <div className="form-sub-title">
              Investments {showAddInvestment 
                ? <FontAwesomeIcon icon="times" onClick={() => setShowAddInvestment(false)} /> 
                : <Button variant="contained" color="secondary" onClick={() => setShowAddInvestment(true)}>Add +</Button>} 
            </div>
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