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

const CREATE_DEAL = gql`
  mutation CreateDeal($company_name: String, $company_description: String, $deal_lead: String, $date_closed: String) {
    createDeal(company_name: $company_name, company_description: $company_description, deal_lead: $deal_lead, date_closed: $date_closed) {
      _id
      company_name
      company_description
      date_closed
      deal_lead
      closed
    }
  }
`

export default function DealNew () {
  const params = useParams()
  const [deal, setDeal] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [createDeal, createDealRes] = useMutation(CREATE_DEAL)

  useEffect(() => {
    setHasChanges(!isEqual(deal, {}))
  }, [deal])

  const updateDealProp = ({ prop, newVal }) => {
    setDeal(prev => ({ ...prev, [prop]: newVal }))
  }
  
  return (
    <div className="DealEdit form-wrapper">
      <Row>
        <Col sm={{size: 8, offset: 1}}>
          <div className="form-title">Create Deal</div>
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
          <Col sm={{size: 8, offset: 1}}>
            <Button disabled={!hasChanges} 
              variant="contained"
              onClick={() => createDeal({ variables: deal })} 
              color="primary">
              CREATE
            </Button> 
          </Col>
        </Row>
      </form>
    </div>
  )
}