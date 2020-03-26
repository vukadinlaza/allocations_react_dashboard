import React, { useEffect, useState } from 'react'
import Loader from '../../utils/Loader'
import { get } from "lodash"
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Col, Row } from "reactstrap"
import { Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import "./style.scss"

import countries from "country-region-data"

const UPDATE_USER = gql`
  mutation UpdateUser($investor: UserInput!) {
    updateUser(input: $investor) {
      _id
      first_name
      last_name
      country
      entity_name
      investor_type
      signer_full_name
      accredited_investor_status
      email
      passport {
        link
        path
      }
    }
  }
`

const reqs = ['country', 'investor_type', 'signer_full_name', 'accredited_investor_status', 'email']

export function validate(investor) {
  const required = investor.investor_type === "entity"
    ? ['entity_name', ...reqs]
    : ['first_name', 'last_name', ...reqs]
  return required.reduce((acc, attr) => investor[attr] ? acc : [...acc, attr], [])
}

export default function InvestorEditForm ({ investor, setInvestor, actionText, setFormStatus, noValidate = false }) {
  const [errors, setErrors] = useState([])
  const [updateInvestor, updateInvestorRes] = useMutation(UPDATE_USER)

  const handleChange = (prop) => e => {
    e.persist()
    if (prop === "investor_type") {
      return setInvestor(prev => ({ ...prev, [prop]: e.target.value, accredited_investor_status: "" }))
    } else {
      return setInvestor(prev => ({ ...prev, [prop]: e.target.value }))
    }
  }

  const submit = () => {
    // don't validate if noValidate flag passed 
    if (noValidate) return updateInvestor({ variables: { investor } })
      
    const validation = validate(investor)
    setErrors(validation)
    if (validation.length === 0) {
      updateInvestor({ variables: { investor } })
    }
  }

  useEffect(() => {
    if (updateInvestorRes.data) setFormStatus("complete")
    if (updateInvestorRes.loading) setFormStatus("loading")
  }, [updateInvestorRes])

  if (!investor) return <Loader />

  return (
    <form className="form InvestorEditForm" noValidate autoComplete="off">
      <Row>
        <Col sm={{size: 6, offset: 1}}>
          <FormControl required error={errors.includes("investor_type")} variant="filled" style={{width: "100%"}}>
            <InputLabel>Investor Type</InputLabel>
            <Select value={investor.investor_type || ""}
              onChange={handleChange("investor_type")}
              inputProps={{name: 'Type'}}>
              <MenuItem value=""></MenuItem>
              <MenuItem value="individual">Individual</MenuItem>
              <MenuItem value="entity">Entity</MenuItem>
            </Select>
          </FormControl>
        </Col>
      </Row>
      <AccreditedInvestorStatus investor={investor} handleChange={handleChange} errors={errors} />
      <Row>
        <Col sm={{size: 6, offset: 1}}>
          <FormControl required error={errors.includes("country")} variant="filled" style={{width: "100%"}}>
            <InputLabel>Country of Residence or Place of Business</InputLabel>
            <Select value={investor.country || ""}
              onChange={handleChange("country")}
              inputProps={{name: 'Country'}}>
              <MenuItem value=""></MenuItem>
              {countries.map(({ countryName }) => (
                <MenuItem key={countryName} value={countryName}>{countryName}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Col>
      </Row>
      <Row>
        <InvestorName investor={investor} errors={errors} handleChange={handleChange} />
      </Row>
      <Row>
        <Col sm={{size: 6, offset: 1}}>
          <TextField required disabled
            error={errors.includes("email")}
            style={{width: "100%"}} 
            value={get(investor, 'email') || ""}
            onChange={handleChange("email")}
            label="Email" 
            variant="filled" />
        </Col>
      </Row>
      <Row>
        <Col sm={{size: 6, offset: 1}}>
          <TextField required
            error={errors.includes("signer_full_name")}
            style={{width: "100%"}} 
            value={get(investor, 'signer_full_name') || ""}
            onChange={handleChange("signer_full_name")}
            label="Full Name of Signer" 
            variant="filled" />
        </Col>
      </Row>
      <KYC investor={investor} setInvestor={setInvestor} />
      <Row>
        <Col sm={{size: 6, offset: 1}} className="submit-row">
          <Button variant="contained"
            onClick={submit} 
            color="primary">
            {actionText}
          </Button> 
        </Col>
      </Row>
    </form>
  )
}

function KYC ({ investor, setInvestor }) {
  return (
    <Row>
      <Col sm={{size: 6, offset: 1}}>
        <h5>KYC</h5>
        <p>In Order to Participate in Allocations Deals we Need to Collect to Verify your Identity</p>
        <hr />
      </Col>
      <Col sm={5}></Col>
      <Col sm={{size: 6, offset: 1}} style={{marginBottom: "15px"}}>
        <AccredidationUploader investor={investor} setInvestor={setInvestor} />
      </Col>
      <Col sm={{size: 6, offset: 1}}>
        <PassportUploader investor={investor} setInvestor={setInvestor} />
      </Col>
    </Row>
  )
}

function PassportUploader ({ investor, setInvestor }) {
  if (investor.passport) {
    return (
      <div className="file-uploader">
        <span className="file-label">Passport / Driver's License</span>
        {investor.passport.link 
          ? <a href={"https://" + investor.passport.link} target="_blank"><FontAwesomeIcon icon="paperclip" /></a> 
          : <FontAwesomeIcon icon="paperclip" /> }
      </div>
    )
  }

  return (
    <div className="file-uploader">
      <span className="file-label">Please Attach your ID for KYC (Passport / Driver's License)</span>
      <Button variant="contained" component="label">
        Upload
        <input type="file" 
          style={{ display: "none" }} 
          onChange={({ target }) => {
            if (target.validity.valid) setInvestor(prev => ({ ...prev, passport: target.files[0] }))
          }} />
      </Button>
    </div>
  )
}

function AccredidationUploader ({ investor, setInvestor }) {
  if (investor.accredidation_doc) {
    return (
      <div className="file-uploader">
        <span className="file-label">Accredited Investor Certificate</span>
        {investor.accredidation_doc.link 
          ? <a href={"https://" + investor.accredidation_doc.link} target="_blank"><FontAwesomeIcon icon="paperclip" /></a> 
          : <FontAwesomeIcon icon="paperclip" /> }
      </div>
    )
  }

  return (
    <div className="file-uploader">
      <span className="file-label">Please Attach Accredited Investor Certificate (<a href="https://www.investopedia.com/terms/a/accreditedinvestor.asp" target="_blank">More Info</a>)</span>
      <Button variant="contained" component="label">
        Upload
        <input type="file" 
          style={{ display: "none" }} 
          onChange={({ target }) => {
            if (target.validity.valid) setInvestor(prev => ({ ...prev, accredidation_doc: target.files[0] }))
          }} />
      </Button>
    </div>
  )
}

function InvestorName ({ investor, errors, handleChange }) {
  if (investor.investor_type === "entity") {
    return (
      <Col sm={{size: 6, offset: 1}}>
        <TextField required
          error={errors.includes("entity_name")}
          style={{width: "100%"}} 
          value={get(investor, 'entity_name') || ""} 
          onChange={handleChange("entity_name")}
          label="Subscriber Entity Name" 
          variant="filled" />
      </Col>
    )
  } else {
    return (
      <React.Fragment>
        <Col sm={{size: 3, offset: 1}}>
          <TextField required
            error={errors.includes("first_name")}
            style={{width: "100%"}} 
            value={get(investor, 'first_name') || ""} 
            onChange={handleChange("first_name")}
            label="Subscriber First Name" 
            variant="filled" />
        </Col>
        <Col sm={{size: 3}}>
          <TextField required
            error={errors.includes("last_name")}
            style={{width: "100%"}} 
            value={get(investor, 'last_name') || ""}
            onChange={handleChange("last_name")}
            label="Subscriber Last Name" 
            variant="filled" />
        </Col>
      </React.Fragment>
    )
  }
}

const statusOptions = {
  individual: [
    "I have over $5m in net assets, excluding my primary residence",
    "I have over $2m-$5m in net assets, excluding my primary residence",
    "I have over $1m-$2m in net assets, excluding my primary residence",
    "I have had $200K in income (or $300K jointly with my spouse) for the past 2 years and expect the same this year",
    "N.A."
  ],
  entity: [
    "My entity has over $25m in assets",
    "My entity has $5m-$25m in assets",
    "All owners of my entity are qualified purchasers",
    "All owners of my entity are accredited",
    "N.A."
  ]
}

function AccreditedInvestorStatus ({ investor, handleChange, errors }) {
  const { investor_type } = investor
  if (!investor_type) return null

  return (
    <Row>
      <Col sm={{size: 6, offset: 1}}>
        <FormControl required error={errors.includes("accredited_investor_status")} variant="filled" style={{width: "100%"}}>
          <InputLabel htmlFor="filled-age-native-simple">Accredited Investor Type</InputLabel>
          <Select value={investor.accredited_investor_status || ""}
            onChange={handleChange("accredited_investor_status")}
            inputProps={{name: 'Accredited Investor Status'}}>
            <MenuItem value=""></MenuItem>
            {statusOptions[investor_type].map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}          
          </Select>
        </FormControl>
      </Col>
    </Row>
  )
}