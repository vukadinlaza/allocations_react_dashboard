import React, { useState, useEffect } from 'react'
import { get, isEqual } from "lodash"
import { useParams, Redirect } from "react-router-dom"
import { TextField } from '@material-ui/core'
import { Row, Col } from 'reactstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { gql } from 'apollo-boost'
import * as API from "../../api"
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'

import { Table, TableBody, TableCell, TableRow, TableHead, Paper, Button } from '@material-ui/core'
// import "./style.scss"

export default function InvestmentNew () {
  const params = useParams()
  const [investment, setInvestment] = useState({ amount: ""})
  const [hasChanges, setHasChanges] = useState(false)

  const [user, setUser] = useState(null)
  const [deal, setDeal] = useState(null)

  useEffect(() => {
    setHasChanges(!isEqual(investment, {}))
  }, [investment])

  const updateInvestmentProp = ({ prop, newVal }) => {
    setInvestment(prev => ({ ...prev, [prop]: newVal }))
  }

  if (false) {
    return <Redirect to={`/admin/investments/:id/edit`} />
  }
  
  return (
    <div className="InvestmentEdit form-wrapper">
      <Row>
        <Col sm={{size: 8, offset: 1}}>
          <div className="form-title">Create Investment</div>
        </Col>
      </Row>
      <form className="form" noValidate autoComplete="off">
        <Row>
          <Col sm={{size: 8, offset: 1}}>
            <TextField style={{width: "100%"}} 
              value={investment.amount}
              onChange={e => updateInvestmentProp({ prop: "amount", newVal: e.target.value })}
              label="Amount" 
              variant="filled" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 4, offset: 1}}>
            <UserSearch />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 8, offset: 1}}>
            <Button disabled={!hasChanges} 
              variant="contained"
              onClick={() => {}} 
              color="primary">
              CREATE
            </Button> 
          </Col>
        </Row>
        <Row>
        </Row>
      </form>
    </div>
  )
}

function UserSearch ({ user, setUser }) {
  const [q, setQ] = useState("")
  const [records, setRecords] = useState([])
  const [search, searchRes] = useLazyQuery(API.users.search)

  useEffect(() => {
    search({ variables: { q } })
  }, [q])

  useEffect(() => {
    if (searchRes.data && searchRes.data.searchUsers) {
      setRecords(q === "" ? [] : searchRes.data.searchUsers)
    } 
  }, [searchRes.data])

  if (user) {
    return (
      <Paper className="assoc-value">
        <Table>
        </Table>
      </Paper>
    )
  }

  return (
    <div className="assoc-search">
      <TextField style={{width: "100%"}}
        value={q}
        onChange={e => setQ(e.target.value)} />
      <Paper className="assoc-search-results">
        <Table>
          <TableBody>
            {records.map(record => (
              <TableRow key={record._id} onClick={() => setUser(record)}>
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