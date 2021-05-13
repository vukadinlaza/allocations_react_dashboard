import React, { useState } from 'react';
import { get } from 'lodash';
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import countries from 'country-region-data';
import { UsaStates } from 'usa-states';

import './styles.scss';
import { AccreditedInvestorStatus } from '../../../forms/InvestorEdit';

const usStates = new UsaStates();
const countryNames = countries.map((c) => c.countryName);
const stateNames = usStates.states.map((s) => s.name);

function PersonalInformation({ investor, setInvestor, errors }) {
  const handleChange = (prop) => (e, newValue) => {
    if (e) {
      e.persist();
    }
    if (prop === 'investor_type') {
      return setInvestor((prev) => ({ ...prev, [prop]: e.target.value, accredited_investor_status: '' }));
    }
    if (prop === 'country') {
      if (newValue) {
        let countryValue = newValue === 'U.S.' || newValue === 'USA' ? 'United States' : newValue;

        return setInvestor((prev) => ({ ...prev, [prop]: countryValue }))
      }
    }
    if (prop === 'country_search') {
      return setInvestor((prev) => ({ ...prev, [prop]: newValue }))
    }
    if (prop === 'state') {
      return setInvestor((prev) => ({ ...prev, [prop]: newValue }))
    }
    if (prop === 'state_search') {
      return setInvestor((prev) => ({ ...prev, [prop]: newValue }))
    }
    return setInvestor((prev) => ({ ...prev, [prop]: e.target.value }));
  };


  const usIndex = countryNames.indexOf('United States');
  countryNames.splice(usIndex, 1);
  countryNames.unshift('United States')

  return (
    <section className="PersonalInformationPanel">
      <p className="section-label">Personal Information</p>

      {/* Investor Type */}
      <FormControl
        className="personal-information-input"
        required
        error={errors.includes('investor_type')}
        variant="outlined"
      >
        <InputLabel>Investor Type</InputLabel>
        <Select
          value={investor.investor_type || ''}
          onChange={handleChange('investor_type')}
          inputProps={{ name: 'Type' }}
        >
          <MenuItem value="" />
          <MenuItem value="individual">Individual</MenuItem>
          <MenuItem value="entity">Entity</MenuItem>
        </Select>
      </FormControl>

      {/* Legal Name */}
      <TextField
        className="personal-information-input"
        variant="outlined"
        required
        placeholder="Legal name of entity or individual"
        error={errors.includes('legalName')}
        value={get(investor, 'legalName') || ''}
        onChange={handleChange('legalName')}
      />

      {/* Country */}
      <FormControl className="country-input" required variant="outlined">
        <Autocomplete
          className="country-select"
          value={investor.country || ''}
          onChange={(event, newInputValue) => handleChange('country')(event, newInputValue)}
          inputValue={investor.country_search || ''}
          onInputChange={(event, newInputValue) => {
            handleChange('country_search')(event, newInputValue);
          }}
          id="country-select"
          options={[...countryNames, 'USA', 'U.S.',]}
          getOptionLabel={(option) => option}
          renderInput={(params) => (
            <TextField {...params} error={errors.includes('country')} label="Country" variant="outlined" />
          )}
        />
      </FormControl>
      {investor.country === 'United States' && (
        <FormControl
          className="state-input"
          required
          variant="outlined"
          disabled={!investor.country || get(investor, 'country') !== 'United States'}
        >
          <Autocomplete
            className="state-select"
            value={investor.state || ''}
            onChange={(event, newInputValue) => handleChange('state')(event, newInputValue)}
            inputValue={investor.state_search || ''}
            onInputChange={(event, newInputValue) => {
              handleChange('state_search')(event, newInputValue);
            }}
            id="state-select"
            options={stateNames}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField {...params} error={errors.includes('state')} label="State" variant="outlined" />
            )}
          />
        </FormControl>
      )}
      {/* Accreditation status */}
      <AccreditedInvestorStatus investor={investor} handleChange={handleChange} errors={errors} />
      {investor.investor_type && investor.investor_type !== 'individual' && (
        <TextField
          className="personal-information-input"
          variant="outlined"
          placeholder="Signer's Full Name"
          error={errors.includes('fullName')}
          value={get(investor, 'fullName') || ''}
          onChange={handleChange('fullName')}
        />
      )}
      {/* <TextField className="personal-information-input" variant="outlined" placeholder="Full Address" />
      <TextField className="personal-information-input" variant="outlined" placeholder="Phone number" /> */}
      <p className="information-notice">
        Required by United States banking laws. This information is transmitted securely and will never be used for any
        purpose beyond executing your investment.
      </p>
    </section>
  );
}

export default PersonalInformation;
