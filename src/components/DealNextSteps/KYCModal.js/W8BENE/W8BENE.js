import {
  FormControl,
  TextField,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, { useState } from 'react';
import countries from 'country-region-data';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './styles.scss';

function W8BENE({ toggleOpen }) {
  const countryNames = countries.map((c) => c.countryName);
  const [country, setCountry] = useState('');
  const [countrySearch, setCountrySearch] = useState('');

  const [formState, setFormState] = useState({
    chapter3Status: '',
  });

  const [sameMailing, setSameMailing] = useState(false);

  const handleChange = (prop) => (e, newValue) => {
    if (e) {
      e.persist();
    }
    if (prop === 'country') {
      if (newValue) {
        const countryValue = newValue === 'U.S.' || newValue === 'USA' ? 'United States' : newValue;

        return setCountry(countryValue);
      }
    }
    if (prop === 'country_search') {
      newValue.length === 0 && setCountry('');
      return setCountrySearch(newValue);
    }
  };

  console.log('W8 BENE form state: ', formState);

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

        <FormControl className="form-field country-input" required variant="outlined">
          <label className="form-label">
            Country of incorporation or organization
            <Autocomplete
              className="country-select"
              value={country}
              onChange={(event, newInputValue) => handleChange('country')(event, newInputValue)}
              inputValue={countrySearch}
              onInputChange={(event, newInputValue) => {
                handleChange('country_search')(event, newInputValue);
              }}
              id="country-select"
              options={[...countryNames, 'USA', 'U.S.']}
              getOptionLabel={(option) => option}
              renderInput={(params) => <TextField {...params} placeholder="Select a country" variant="outlined" />}
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
            <Select name="chapter3Status" variant="outlined" className="chapter-3-select">
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

        <FormControl className="form-field chapter4Status">
          <label className="form-label">
            Chapter 4 Status (FATCA status)
            <Select name="chapter3Status" variant="outlined" className="chapter-3-select">
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
                <small>
                  <i>Include postal code where appropriate.</i>
                </small>
              </label>
            </FormControl>

            <FormControl className="country" required variant="outlined">
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
                  options={[...countryNames, 'USA', 'U.S.']}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => <TextField {...params} placeholder="Select a country" variant="outlined" />}
                />
              </label>
            </FormControl>
          </div>

          <FormControlLabel
            label="Mailing address is different than permanent address."
            control={<Checkbox checked={sameMailing} onChange={() => setSameMailing((t) => !t)} name="sameMailing" />}
          />
        </FormGroup>

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

          <FormControl className="country" required variant="outlined">
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
                options={[...countryNames, 'USA', 'U.S.']}
                getOptionLabel={(option) => option}
                renderInput={(params) => <TextField {...params} placeholder="Select a country" variant="outlined" />}
              />
            </label>
          </FormControl>
        </FormGroup>

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

        <Button className="form-button accept">I accept</Button>
        <Button className="form-button decline">I decline</Button>
      </form>
      <Button onClick={() => toggleOpen((open) => !open)} className="close-button">
        <CloseIcon />
      </Button>
    </section>
  );
}

export default W8BENE;
