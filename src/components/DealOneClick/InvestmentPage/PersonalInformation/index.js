import React, { useState } from 'react';
import { get } from 'lodash';
import { TextField, FormControl, InputLabel, Select, MenuItem, Checkbox } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import countries from 'country-region-data';
import { UsaStates } from 'usa-states';

import './styles.scss';
import { AccreditedInvestorStatus } from '../../../forms/InvestorEdit';

const usStates = new UsaStates();
const countryNames = countries.map((c) => c.countryName);
const stateNames = usStates.states.map((s) => s.name);

function PersonalInformation({ investor, setInvestor, errors, org }) {

  const [mailingDifferent, toggleMailingDifferent] = useState(false);
  const [entityDesignation, setEntityDesignation] = useState('sole_member');
  const [individualDesignation, setIndividualDesignation] = useState('');

  const handleChange = (prop) => (e, newValue) => {
    if (e) {
      e.persist();
    }
    if (prop === 'entity_designation') {
      setEntityDesignation(e.target.value)

      if (individualDesignation !== '') {
        setInvestor((prev) => ({ ...prev, [individualDesignation]: false, [e.target.value]: true }));
      }

      if (entityDesignation !== '') {
        return setInvestor((prev) => ({ ...prev, [entityDesignation]: false, [e.target.value]: true }));
      }
      return setInvestor((prev) => ({ ...prev, [e.target.value]: true }));
    }

    if (prop === 'individual_designation') {
      setIndividualDesignation(e.target.value)

      if (entityDesignation !== '') {
        setInvestor((prev) => ({ ...prev, [entityDesignation]: false, [e.target.value]: true }));
      }
      if (individualDesignation !== '') {
        return setInvestor((prev) => ({ ...prev, [individualDesignation]: false, [e.target.value]: true }));
      }
      return setInvestor((prev) => ({ ...prev, [e.target.value]: true }));
    }

    if (prop === 'investor_type') {
      return setInvestor((prev) => ({ ...prev, [prop]: e.target.value, accredited_investor_status: '' }));
    }
    if (prop === 'country') {
      if (newValue) {
        const countryValue = newValue === 'U.S.' || newValue === 'USA' ? 'United States' : newValue;

        return setInvestor((prev) => ({ ...prev, [prop]: countryValue }));
      }
    }
    if (prop === 'country_search') {
      return setInvestor((prev) => ({ ...prev, [prop]: newValue }));
    }
    if (prop === 'state') {
      return setInvestor((prev) => ({ ...prev, [prop]: newValue }));
    }
    if (prop === 'state_search') {
      return setInvestor((prev) => ({ ...prev, [prop]: newValue }));
    }
    return setInvestor((prev) => ({ ...prev, [prop]: e.target.value }));
  };

  const usIndex = countryNames.indexOf('United States');
  countryNames.splice(usIndex, 1);
  countryNames.unshift('United States');

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
          options={[...countryNames, 'USA', 'U.S.']}
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


      {investor.investor_type && investor.investor_type !== 'individual' && org !== 'irishangels' && (
        <>
          <TextField
            className="personal-information-input"
            variant="outlined"
            placeholder="Signer's Full Name"
            error={errors.includes('fullName')}
            value={get(investor, 'fullName') || ''}
            onChange={handleChange('fullName')}
          />
          <TextField
            className="personal-information-input"
            variant="outlined"
            placeholder="Title"
            error={errors.includes('title')}
            value={get(investor, 'title') || ''}
            onChange={handleChange('title')}
          />
        </>
      )}

      {/* Custom ENTITY fields for Irish Angels deals */}

      {investor.investor_type && investor.investor_type === 'entity' && org === 'irishangels' && (
        <>
          <TextField
            className="personal-information-input"
            variant="outlined"
            placeholder="Enter your name"
            error={errors.includes('fullName')}
            value={get(investor, 'fullName') || ''}
            onChange={handleChange('fullName')}
          />
          <TextField
            className="personal-information-input"
            variant="outlined"
            placeholder="EIN (or SSN for Revokable Trusts)"
            error={errors.includes('ein')}
            inputProps={{ maxLength: 9 }}
            value={get(investor, 'ein') || ''}
            onChange={handleChange('ein')}
          />

          <FormControl
            className="personal-information-input"
            required
            error={errors.includes('entity_designation')}
            variant="outlined"
          >
            <InputLabel>Select the appropriate designation</InputLabel>
            <Select
              value={entityDesignation || ''}
              onChange={handleChange('entity_designation')}
              inputProps={{ name: 'entity_designation' }}
            >
              <MenuItem value="" />
              <MenuItem value="sole_member">Sole-Member Limited Liability Company (LLC)</MenuItem>
              <MenuItem value="multi_member">Multi-Member Limited Liability Company (LLC)</MenuItem>
              <MenuItem value="c_corporation">C Corporation</MenuItem>
              <MenuItem value="s_corporation">S Corporation</MenuItem>
              <MenuItem value="general_partnership">General Partnership</MenuItem>
              <MenuItem value="limited_partnership">Limited Partnership</MenuItem>
              <MenuItem value="irrevocable_trust">Irrevocable Trust</MenuItem>
              <MenuItem value="revocable_trust">Revocable Trust</MenuItem>
              <MenuItem value="ira_account">IRA Account</MenuItem>
              <MenuItem value="pension">Pension or Profit Sharing Plan</MenuItem>
            </Select>
          </FormControl>

          <TextField
            className="personal-information-input"
            variant="outlined"
            placeholder="Title"
            error={errors.includes('title')}
            value={get(investor, 'title') || ''}
            onChange={handleChange('title')}
          />

          <TextField
            className="personal-information-input"
            variant="outlined"
            placeholder="Initials"
            error={errors.includes('initials')}
            value={get(investor, 'initials') || ''}
            onChange={handleChange('initials')}
          />
        </>
      )}

      {/* Custom INDIVIDIAL investor fields for Irish Angels deals */}

      {investor.investor_type && investor.investor_type === 'individual' && org === 'irishangels' && (
        <>


          <TextField
            className="personal-information-input"
            variant="outlined"
            placeholder="Social Security Number"
            error={errors.includes('ssn')}
            value={get(investor, 'ssn') || ''}
            onChange={handleChange('ssn')}
          />

          <FormControl
            className="personal-information-input"
            required
            error={errors.includes('investor_type')}
            variant="outlined"
          >
            <InputLabel>Select the appropriate designation</InputLabel>
            <Select
              value={individualDesignation || ''}
              onChange={handleChange('individual_designation')}
              inputProps={{ name: 'individual_designation' }}
            >
              <MenuItem value="" />
              <MenuItem value="individual">Individual</MenuItem>
              <MenuItem value="joint_tenants">Joint Tenants with Rights of Survivorship</MenuItem>
              <MenuItem value="tenants_by_entirety">Tenants by the Entirety</MenuItem>
              <MenuItem value="tenants_in_commons">Tenants in Common</MenuItem>
            </Select>
          </FormControl>

        </>
      )}

      { org === 'irishangels' && (
        <FormControl
          required
          error={errors.includes('investor_type')}
          variant="outlined"
          className="address-container"
        >
          <label className="address-input-label">
            Home Address:
            <TextField
              className="address-input"
              variant="outlined"
              placeholder="Address, City, State, Zip Code"
              error={errors.includes('home_address')}
              value={get(investor, 'home_address') || ''}
              onChange={handleChange('home_address')}
            />
          </label>
          {mailingDifferent && (

            <label className="address-input-label">
              Mailing Address:
              <TextField
                className="address-input"
                variant="outlined"
                placeholder="Address, City, State, Zip Code"
                error={errors.includes('mailing_address')}
                value={get(investor, 'mailing_address') || ''}
                onChange={handleChange('mailing_address')}
              />
            </label>

          )}
          <label className="same-mailing-checkbox">
            Different Mailing Address
          <Checkbox
              onChange={() => toggleMailingDifferent(t => (!t))}
              value="checkedA"
              inputProps={{ 'aria-label': 'Checkbox A' }}
            />
          </label>
        </FormControl>
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
