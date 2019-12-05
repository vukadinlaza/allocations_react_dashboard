import React, { useState, useEffect } from 'react'
import { get, isEqual } from "lodash"
import { useParams, Redirect } from "react-router-dom"
import { TextField } from '@material-ui/core'
import { Row, Col } from 'reactstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { gql } from 'apollo-boost'
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks'

import { Table, TableBody, TableCell, TableRow, TableHead, Paper, Button } from '@material-ui/core'
import "./style.scss"

const GET_INVESTMENT = gql`
  query GetInvestment($_id: String!) {
    investment(_id: $_id) {
      _id
      amount
      documents
      deal {
        company_name
        company_description
      }
      investor {
        first_name
        last_name
      }
    }
  }
`

const ADD_INVESTMENT_DOC = gql`
  mutation AddInvestmentDoc($doc: Upload!, $investment_id: String!) {
    addInvestmentDoc(doc: $doc, investment_id: $investment_id)
  }
`

const RM_INVESTMENT_DOC = gql`
  mutation RmInvestmentDoc($file: String!, $investment_id: String!) {
    rmInvestmentDoc(file: $file, investment_id: $investment_id)
  }
`

const UPDATE_INVESTMENT = gql`
  mutation UpdateInvestment($investment: InvestmentInput) {
    updateInvestment(investment: $investment) {
      _id
    }
  }
`

export default function InvestmentEdit () {
  const params = useParams()
  const [investment, setInvestment] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)
  const { data, loading, refetch, error } = useQuery(GET_INVESTMENT, { variables: { _id: params.id }})
  const [createInvestment, createInvestmentRes] = useMutation(UPDATE_INVESTMENT)

  useEffect(() => {
    setHasChanges(!isEqual(investment, {}))
  }, [investment])

  useEffect(() => {
    if (data && !investment) setInvestment(data.investment)
  }, [data, investment])

  const updateInvestmentProp = ({ prop, newVal }) => {
    setInvestment(prev => ({ ...prev, [prop]: newVal }))
  }

  if (createInvestmentRes.data) {
    return <Redirect to={`/deals/${createInvestmentRes.data.createInvestment._id}/edit`} />
  }
  
  return (
    <div className="InvestmentEdit form-wrapper">
      <Row>
        <Col sm={{size: 8, offset: 1}}>
          <div className="form-title">Update Investment</div>
        </Col>
      </Row>
      <form className="form" noValidate autoComplete="off">
        <Row>
          <Col sm={{size: 4, offset: 1}}>
            <TextField style={{width: "100%"}} 
              value={`${get(investment, 'investor.first_name', "")} ${get(investment, 'investor.last_name', "")}`}
              label="Investor"
              disabled
              variant="filled" />
          </Col>
          <Col sm={{size: 4}}>
            <TextField style={{width: "100%"}} 
              value={get(investment, 'amount', "")}
              onChange={e => updateInvestmentProp({ prop: "amount", newVal: e.target.value })}
              label="Amount" 
              variant="filled" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 8, offset: 1}}>
            <TextField style={{width: "100%"}} 
              value={`${get(investment, 'deal.company_name', "")} ${get(investment, 'deal.company_description', "")}`}
              label="Deal"
              disabled
              variant="filled" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 8, offset: 1}}>
            <Button disabled={!hasChanges} 
              variant="contained"
              onClick={() => createInvestment({ variables: investment })} 
              color="primary">
              UPDATE
            </Button> 
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 8, offset: 1}}>
            <div className="form-sub-title">Documents</div>
            <Docs investment={investment} setInvestment={setInvestment} />
          </Col>
        </Row>
        <Row>
        </Row>
      </form>
    </div>
  )
}

function Docs ({ investment, setInvestment }) {
  const [uploadedDoc, setUploadedDoc] = useState(null)
  const [addInvestmentDoc, {data, loading, error}] = useMutation(ADD_INVESTMENT_DOC)

  useEffect(() => {
    if (uploadedDoc) {
      addInvestmentDoc({ variables: { doc: uploadedDoc, investment_id: investment._id }})
    }
  }, [uploadedDoc])

  useEffect(() => {
    if (data) {
      setInvestment(prev => {
        return {
          ...prev,
          documents: [...prev.documents, data.addInvestmentDoc]
        }
      })
    }
  }, [data])

  const docs = get(investment, 'documents', [])

  return (
    <div className="docs">
      <div className="doc-wrapper">
        <div className="add-doc">
          <label>
            <FontAwesomeIcon icon="plus" />
            <input type="file" 
              style={{display: "none"}} 
              onChange={({ target }) => {
                if (target.validity.valid) setUploadedDoc(target.files[0])
              }} />
          </label>
        </div>
        <div className="filename">&nbsp;</div>
      </div>
      {docs.map(doc => <Doc key={doc} doc={doc} investment={investment} />)}
    </div>
  )
}

function Doc ({ doc, investment }) {
  const [done, setDone] = useState(false)
  const file = doc.split('/')[2].split('?')[0]
  const [rmInvestmentDoc, { data }] = useMutation(RM_INVESTMENT_DOC, { variables: { file, investment_id: investment._id }})

  useEffect(() => {
    if (data) setDone(true)
  }, [data])

  const rmDoc = () => {
    if (window.confirm(`Delete ${file}?`)) rmInvestmentDoc()
  }

  if (done) return null

  return (
    <div className="doc-wrapper">
      <div className="doc">
        <FontAwesomeIcon icon="times-circle" 
          onClick={rmDoc} />
        <FontAwesomeIcon icon={["far", "file-pdf"]} />
      </div>
      <div className="filename">
        <span><a href={`https://${doc}`} target="_blank">{file}</a></span>
      </div>
    </div>
  )
}




