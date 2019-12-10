import React, { useEffect, useState } from 'react'
import Loader from '../utils/Loader'
import { get } from "lodash"
import { useParams } from 'react-router-dom';
import { gql } from 'apollo-boost'
import { useLazyQuery } from '@apollo/react-hooks';
import { useAuth0 } from "../../react-auth0-spa";

import { Col, Row } from "reactstrap"
import { Paper, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import "./style.scss"

import countries from "country-region-data"

const GET_INVESTOR = gql`
  query GetInvestor($email: String, $_id: String) {
    investor(email: $email, _id: $_id) {
      _id
      first_name
      last_name
      email
      investments {
        _id
        amount
        deal {
          _id
          company_name
          company_description
          date_closed
        }
        documents
      }
    }
  }
`

export default function Profile () {
  const [editMode, setEditMode] = useState(true)
  const [investor, setInvestor] = useState(null)
  const [getInvestor, { data, error }] = useLazyQuery(GET_INVESTOR)
  const { user } = useAuth0()

  useEffect(() => {
    if (user && user.email) getInvestor({ variables: { email: user.email }})
  }, [user])

  useEffect(() => {
    if (data) setInvestor(data.investor)
  }, [data])

  const handleChange = prop => e => setInvestor(prev => ({ ...prev, [prop]: e.target.value }))

  if (!investor) return <Loader />

  return (
    <div className="Profile">
      <Row>
        <Col sm={{size: 9, offset: 1}}>Profile</Col>
      </Row>
      {/*<form className="form" noValidate autoComplete="off">
        <Row>
          <Col sm={{size: 3, offset: 1}}>
            <TextField style={{width: "100%"}} 
              value={get(user, 'first_name') || ""} 
              onChange={e => handleChange("first_name")}
              label="First Name" 
              variant="filled" />
          </Col>
          <Col sm={{size: 3}}>
            <TextField style={{width: "100%"}} 
              value={get(user, 'last_name') || ""}
              onChange={e => handleChange("last_name")}
              label="Last Name" 
              variant="filled" />
          </Col>
          <Col sm={{size: 3}}>
            <TextField style={{width: "100%"}} 
              value={get(user, 'email') || ""}
              onChange={e => handleChange("email")}
              label="Last Name" 
              variant="filled" />
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 3, offset: 1}}>
            <FormControl variant="filled" style={{width: "100%"}}>
              <InputLabel htmlFor="filled-age-native-simple">Investor Type</InputLabel>
              <Select value={investor.investor_type}
                onChange={handleChange("investor_type")}
                inputProps={{name: 'Type'}}>
                <MenuItem value="individual">Individual</MenuItem>
                <MenuItem value="entity">Entity</MenuItem>
              </Select>
            </FormControl>
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 3}}>
            <FormControl variant="filled" style={{width: "100%"}}>
              <InputLabel htmlFor="filled-age-native-simple">Country of Residence or Place of Business</InputLabel>
              <Select value={investor.country}
                onChange={handleChange("country")}
                inputProps={{name: 'Country'}}>
                {countries.map(({ countryName }) => (
                  <MenuItem value={countryName}>{countryName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Col>
        </Row>
          <Col sm={{size: 3}}>
            <FormControl variant="filled" style={{width: "100%"}}>
              <InputLabel htmlFor="filled-age-native-simple">Accredited Investor Status Type</InputLabel>
              <Select value={investor.investor_type}
                onChange={handleChange("investor_type")}
                inputProps={{name: 'Type'}}>
                <MenuItem value="individual">Individual</MenuItem>
                <MenuItem value="entity">Entity</MenuItem>
              </Select>
            </FormControl>
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 3, offset: 1}}>
            Accredidation
            <Button variant="contained" component="label">
              Upload File
              <input type="file" style={{ display: "none" }} />
            </Button>
          </Col>
        </Row>
        <Row>
          <Col sm={{size: 3, offset: 1}}>
            Passport
            <Button variant="contained" component="label">
              Upload File
              <input type="file" style={{ display: "none" }} />
            </Button>
          </Col>
        </Row>
      </form>*/}
    </div>
  )
}