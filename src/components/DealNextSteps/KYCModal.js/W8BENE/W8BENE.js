import { FormControl, TextField, Button, Checkbox, FormGroup, FormControlLabel, Select, MenuItem } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import React, { useState } from 'react'
import countries from 'country-region-data';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Loader from '../../../utils/Loader';
import './styles.scss'
import { useLocation } from 'react-router';

const validate = (formData) => {
  const required = [
    'name_of_individual_who_is_the_beneficial_owner',
    'country_of_citizenship',
    'country',
    'permanent_residence_address_street_apt_or_suite_no_or_rural_route_do_not_use_a_p_o_box_or_in_care_of_address',
    'city_or_town_state_or_province_include_postal_code_where_appropriate',
    'print_name_of_signer',
    'date_mm_dd_yyyy',
    'date_of_birth_mm_dd_yyyy_see_instructions',
    'signature'
  ];
  return required.reduce((acc, attr) => (formData[attr] ? acc : [...acc, attr]), []);
};

function W8BENE({ toggleOpen, called, loading, createDoc }) {

  const countryNames = countries.map(c => c.countryName)
  const [country, setCountry] = useState('')
  const [countrySearch, setCountrySearch] = useState('')
  const { state } = useLocation();

  const [formState, setFormState] = useState({
    name_of_organization_that_is_the_beneficial_owner: '',
    country_of_incorporation_or_organization: '', 
    name_of_disregarded_entity_receiving_the_payment_if_applicable_see_instructions: '',

  });

  const [sameMailing, setSameMailing] = useState(false);

  const handleSubmit = () => {
    // need to handle submit for W8-BEN-E??
    
    // createDoc(payload);
  };

  const handleChange = ({ target }) => {
    return setFormState(prev => ({ ...prev, [target.name]: target.value }))
  }

  const handleCountryChange = (prop) => (e, newValue) => {
    if (e) {
      e.persist();
    }
    if (prop === 'country') {
      if (newValue) {
        let countryValue = newValue === 'U.S.' || newValue === 'USA' ? 'United States' : newValue;

        return setCountry(countryValue)
      }
    }
    if (prop === 'country_search') {
      newValue.length === 0 && setCountry('')
      return setCountrySearch(newValue)
    }
  };


  const treatyClaimOptions = ['disregarded_entity', 'partnership', 'simple_trust', 'grantor_trust']
  console.log('W8 BENE form state: ', formState)

  return (
    <section className="W8BENE">
      <div className="form-header">
        <h2>Complete W-8 BEN-E</h2>
        <h3>Please complete this W-8 in order to complete your tax requirements.</h3>
      </div>
      <form className="form">

        <FormControl className="form-field name">
          <label className="form-label">
            Name of organization that is the beneficial owner
            <TextField variant="outlined" />
          </label>
        </FormControl>

        <FormControl
          className="form-field country-input"
          required
          variant="outlined"
        >
          <label className="form-label">
            Country of incorporation or organization
          <Autocomplete
              className="country-select"
              value={country}
              onChange={(event, newInputValue) => handleCountryChange('country')(event, newInputValue)}
              inputValue={countrySearch}
              onInputChange={(event, newInputValue) => {
                handleCountryChange('country_search')(event, newInputValue);
              }}
              id="country-select"
              options={[...countryNames, 'USA', 'U.S.',]}
              getOptionLabel={(option) => option}
              renderInput={(params) => <TextField {...params}
                placeholder="Select a country"
                variant="outlined" />}
            />
          </label>
        </FormControl>

        <FormControl className="form-field address">
          <label className="form-label">
            Name of disregarded entity receiving the payment
            <TextField variant="outlined" />
          </label>
        </FormControl>




        <FormControl className="form-field chapter3Status">
          <label className="form-label">
            Chapter 3 Status (Entity type)
            <Select
              name="chapter3Status"
              variant="outlined"
              className="chapter-3-select"
              onChange={handleChange}
            >
              <MenuItem value="corporation">Corporation</MenuItem>
              <MenuItem value="disregarded_entity">Disregarded entity</MenuItem>
              <MenuItem value="partnership">Partnership</MenuItem>
              <MenuItem value="simple_trust">Simple trust</MenuItem>
              <MenuItem value="grantor_trust">Grantor trust</MenuItem>
              <MenuItem value="complex_trust">Complex trust</MenuItem>
              <MenuItem value="estate">Estate</MenuItem>
              <MenuItem value="government">Government</MenuItem>
              <MenuItem value="central_bank_of_issue">Central Bank of Issue</MenuItem>
              <MenuItem value="tax_exempt_organization">Tax-exempt organization</MenuItem>
              <MenuItem value="private_foundation">Private foundation</MenuItem>
              <MenuItem value="international_organization">International organization</MenuItem>
            </Select>
          </label>
        </FormControl>

        {
                              
            <FormControlLabel
            label="Mailing address is different than permanent address."
            control={<Checkbox checked={sameMailing} onChange={() => setSameMailing(t => !t)} name="sameMailing" />}
          />
        }

        <FormControl className="form-field chapter4Status">
          <label className="form-label">
            Chapter 4 Status (FATCA status)
            <Select name="chapter3Status" variant="outlined" className="chapter-3-select">
              <MenuItem value="active_nffe">Active NFFE</MenuItem>
              <MenuItem value="passive_nffe">Passive NFFE</MenuItem>
              <MenuItem value="passive_nffe">Other</MenuItem>
              {/* <MenuItem value="corporation">International organization</MenuItem>
              <MenuItem value="disregarded_entity">Exempy retirement plans</MenuItem>
              <MenuItem value="partnership">Entity wholly owned by exempt beneficial owners</MenuItem>
              <MenuItem value="simple_trust">Territory financial institution</MenuItem>
              <MenuItem value="grantor_trust">Excepted nonfinancial group entity</MenuItem>
              <MenuItem value="complex_trust">Excepted nonfinancial start-up company</MenuItem>
              <MenuItem value="estate">Excepted nonfinancial entity in liquidation or bankruptcy</MenuItem>
              <MenuItem value="government">501(c) organization</MenuItem>
              <MenuItem value="central_bank_of_issue">Nonprofit organization</MenuItem>
              <MenuItem value="tax_exempt_organization">Publicly traded NFFE or NFFE affiliate of a publicly traded corporation</MenuItem>
              <MenuItem value="private_foundation">Excepted territory NFFE</MenuItem>
              <MenuItem value="international_organization">Direct reporting NFFE</MenuItem>
              <MenuItem value="international_organization">Sponsored direct reporting NFFE</MenuItem>
              <MenuItem value="international_organization">Account that is not a financial account</MenuItem> */}
            </Select>
          </label>
        </FormControl>

        <FormGroup className="form-field residence">


          <FormControl className="address">
            <label className="form-label">
              Permanent residence address
            <TextField variant="outlined" className="address-input" />
            </label>
          </FormControl>

          <div className="residence-container">

            <FormControl className="city">
              <label className="form-label">
                City or town, state or province.
                
                <TextField variant="outlined" className="address-input" />
                <small><i>Include postal code where appropriate.</i></small>
              </label>
            </FormControl>


            <FormControl
              className="country"
              required
              variant="outlined"
            >
              <label className="form-label">
                Country
                  <Autocomplete
                    className="country-select"
                    value={country}
                    onChange={(event, newInputValue) => handleCountryChange('country')(event, newInputValue)}
                    inputValue={countrySearch}
                    onInputChange={(event, newInputValue) => {
                      handleCountryChange('country_search')(event, newInputValue);
                    }}
                    id="country-select"
                    options={[...countryNames, 'USA', 'U.S.',]}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => <TextField {...params}
                      placeholder="Select a country"
                      variant="outlined" />}
                  />
              </label>
            </FormControl>

          </div>

                      
          <FormControlLabel
            label="Mailing address is different than permanent address."
            control={<Checkbox checked={sameMailing} onChange={() => setSameMailing(t => !t)} name="sameMailing" />}
          />
        </FormGroup>

        {
          sameMailing && (
            <FormGroup className="form-field mailingAddress">

              <FormControl className="address">
                <label className="form-label">
                  Mailing address
                <TextField variant="outlined" className="address-input" />
                </label>
              </FormControl>

              <FormControl className="city">
                <label className="form-label">
                  City or town, state or province. Include postal code where appropriate.
                <TextField variant="outlined" className="address-input" />
                </label>
              </FormControl>

              <FormControl
                className="country"
                required
                variant="outlined"
              >
                <label className="form-label">
                  Country
              <Autocomplete
                    className="country-select"
                    value={country}
                    onChange={(event, newInputValue) => handleChange('country')(event, newInputValue)}
                    inputValue={countrySearch}
                    onInputChange={(event, newInputValue) => {
                      handleChange('country_search')(event, newInputValue);
                    }}
                    id="country-select"
                    options={[...countryNames, 'USA', 'U.S.',]}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => <TextField {...params}
                      placeholder="Select a country"
                      variant="outlined" />}
                  />
                </label>
              </FormControl>
            </FormGroup>
          )
        }


        <div className="social container">
          <FormControl className="form-field ssn">
            <label className="form-label">
              SSN
              <div className="ssn container">
                <TextField variant="outlined" className="ssn-one" />
                <TextField variant="outlined" className="ssn-two" />
                <TextField variant="outlined" className="ssn-three" />
              </div>
            </label>
          </FormControl>
          <FormControl className="form-field date-signed">
            <label className="form-label">
              Date signed
              <TextField type="date" variant="outlined" />
            </label>
          </FormControl>
        </div>


        <FormControl className="form-field signature">
          <label className="form-label">
            E-Signature
            <TextField variant="outlined" className="signature-input" />
          </label>
        </FormControl>
        
        {called && loading ? <Loader /> :
          <Button onClick={handleSubmit} className="form-button accept">
            I accept
          </Button>
        }
        <Button className="form-button decline">
          I decline
        </Button>

      </form>
      <Button onClick={() => toggleOpen(open => !open)} className="close-button">
        <CloseIcon />
      </Button>
    </section>
  )
}

export default W8BENE
