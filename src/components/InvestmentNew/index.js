import React, { useState, useEffect } from 'react'
import { get } from 'lodash'
import { useHistory } from "react-router-dom"
import { TextField } from '@material-ui/core'
import { Row, Col } from 'reactstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from 'react-toastify';
import { gql } from 'apollo-boost'
import * as API from "../../api"
import { useLazyQuery, useMutation } from '@apollo/react-hooks'

import { Table, TableBody, TableCell, TableRow, Paper, Button, Checkbox, Typography, FormControlLabel } from '@material-ui/core'
import InvestorNew from '../InvestorNew'
import "./style.scss"

/***
 *
 * create new investment form
 *
 **/

const CREATE_INVESTMENT = gql`
  mutation CreateInvestment($investment: InvestmentInput!) {
    createInvestment(investment: $investment) {
      _id
    }
  }
`

function validate({ investment, user, deal }) {
  const errors = []
  if (!investment.amount) errors.push("amount")
  if (!user) errors.push("user")
  if (!deal) errors.push("deal")
  return errors
}

export default function InvestmentNew() {
  const history = useHistory()
  const [investment, setInvestment] = useState({ amount: "" })
  const [createInvestment, { data }] = useMutation(CREATE_INVESTMENT)
  const [errors, setErrors] = useState([])
  const [newUser, setNewUser] = useState(false)
  const [user, setUser] = useState(null)
  const [deal, setDeal] = useState(null)



  useEffect(() => {
    if (data) history.push(`/admin/investments/${data.createInvestment._id}/edit`)
  }, [data, history])

  const updateInvestmentProp = ({ prop, newVal }) => {
    setInvestment(prev => ({ ...prev, [prop]: newVal }))
  }

  const submit = () => {
    const validation = validate({ investment, user, deal })
    setErrors(validation)
    if (validation.length === 0) {
      createInvestment({
        variables: {
          investment: { amount: Math.floor(investment.amount), user_id: user._id, deal_id: deal._id }
        },
        onCompleted: toast.success('Sucess')
      })
    }
  }

  return (
    <>
      {newUser && <InvestorNew push={false} setNewUser={setNewUser} />}
      {!newUser && <FormControlLabel
        label="Create New user"
        control={<Checkbox
          color="primary"
          checked={newUser}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          onChange={(e) => setNewUser(e.target.checked)}
        />}
      />}
      <div className="InvestmentEdit form-wrapper">
        <Row>
          <Col sm={{ size: 8, offset: 1 }}>
            <div className="form-title">Create Investment</div>
          </Col>
        </Row>
        <form className="form" noValidate autoComplete="off">
          <Row>
            <Col sm={{ size: 8, offset: 1 }}>
              <TextField required error={errors.includes("amount")} style={{ width: "100%" }}
                value={investment.amount}
                onChange={e => updateInvestmentProp({ prop: "amount", newVal: e.target.value })}
                label="Amount"
                variant="filled" />
            </Col>
          </Row>
          <Row>
            <Col sm={{ size: 4, offset: 1 }}>
              <UserSearch user={user} setUser={setUser} errors={errors} deal_id={get(deal, '_id', '')} />
            </Col>
            <Col sm={{ size: 4 }}>
              <DealSearch deal={deal} setDeal={setDeal} errors={errors} />
            </Col>
          </Row>
          <Row>
            <Col sm={{ size: 8, offset: 1 }}>
              <Button variant="contained"
                onClick={submit}
                color="primary">
                CREATE
            </Button>
            </Col>
          </Row>
          <Row>
          </Row>
        </form>
      </div>
    </>
  )
}

function UserSearch({ user, setUser, errors, deal_id }) {
  const [q, setQ] = useState("")
  const [records, setRecords] = useState([])
  const [search, searchRes] = useLazyQuery(API.users.search)

  useEffect(() => {
    search({ variables: { q, org: deal_id } })
  }, [deal_id, q])

  useEffect(() => {
    if (searchRes.data && searchRes.data.searchUsers) {
      setRecords(q === "" ? [] : searchRes.data.searchUsers)
    }
  }, [q, searchRes.data])

  if (user) {
    return (
      <Paper className="assoc-value">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>{user.first_name} {user.last_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell><FontAwesomeIcon icon="times" onClick={() => { setQ(""); setUser(null) }} /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    )
  }

  return (
    <div className="assoc-search">
      <TextField style={{ width: "100%" }}
        required
        value={q}
        error={errors.includes("user")}
        label="Investor"
        variant="filled"
        onChange={e => setQ(e.target.value)} />
      <Paper className="assoc-search-results">
        <Table>
          <TableBody>
            {records.map(record => (
              <TableRow key={record._id}
                className="assoc-option"
                onClick={() => setUser(record)}>
                <TableCell>{record.first_name} {record.last_name}</TableCell>
                <TableCell>{record.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  )
}

function DealSearch({ deal, setDeal, errors }) {
  const [q, setQ] = useState("")
  const [records, setRecords] = useState([])
  const [search, searchRes] = useLazyQuery(API.deals.search)

  useEffect(() => {
    search({ variables: { q } })
  }, [q])

  useEffect(() => {
    if (searchRes.data && searchRes.data.searchDeals) {
      setRecords(q === "" ? [] : searchRes.data.searchDeals)
    }
  }, [q, searchRes.data])

  if (deal) {
    return (
      <Paper className="assoc-value">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>{deal.company_name}</TableCell>
              <TableCell>{deal.company_description}</TableCell>
              <TableCell><FontAwesomeIcon icon="times" onClick={() => { setQ(""); setDeal(null) }} /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    )
  }

  return (
    <div className="assoc-search">
      <TextField required
        style={{ width: "100%" }}
        value={q}
        label="Deal"
        variant="filled"
        error={errors.includes("user")}
        onChange={e => setQ(e.target.value)} />
      <Paper className="assoc-search-results">
        <Table>
          <TableBody>
            {records.map(record => (
              <TableRow key={record._id}
                className="assoc-option"
                onClick={() => setDeal(record)}>
                <TableCell>{record.company_name}</TableCell>
                <TableCell>{record.company_description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  )
}