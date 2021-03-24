import React, { useState } from 'react';
import { get } from 'lodash';
import { TextField, FormControl, InputLabel, Select, MenuItem, Grid } from '@material-ui/core';
import countries from 'country-region-data';
import { UsaStates } from 'usa-states';

import './styles.scss';
import { AccreditedInvestorStatus } from '../../../forms/InvestorEdit';

const usStates = new UsaStates();

function PersonalInformation({ investor, setInvestor, errors }) {
  const handleChange = (prop) => (e) => {
    e.persist();
    if (prop === 'investor_type') {
      return setInvestor((prev) => ({ ...prev, [prop]: e.target.value, accredited_investor_status: '' }));
    }
    return setInvestor((prev) => ({ ...prev, [prop]: e.target.value }));
  };

  return (
    <section className="PersonalInformationPanel">
      <p className="section-label">Personal Information</p>
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
      {/* Country */}
      <Grid container style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Grid item xs={12} sm={12} md={5} lg={5}>
          <FormControl
            className="personal-information-input"
            required
            error={errors.includes('country')}
            variant="outlined"
          >
            <InputLabel>Country of Residence or Place of Business</InputLabel>
            <Select value={investor.country || ''} onChange={handleChange('country')} inputProps={{ name: 'Country' }}>
              <MenuItem value="" />
              {[{ countryName: 'United States' }, ...countries].map(({ countryName }) => (
                <MenuItem key={countryName} value={countryName}>
                  {countryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {investor.country === 'United States' && (
          <Grid item xs={12} sm={12} md={5} lg={5}>
            <FormControl
              className="personal-information-input"
              required
              error={errors.includes('state')}
              variant="outlined"
              disabled={!investor.country || get(investor, 'country') !== 'United States'}
            >
              <InputLabel>State</InputLabel>
              <Select value={investor.state || ''} onChange={handleChange('state')} inputProps={{ name: 'state' }}>
                <MenuItem value="" />
                {usStates.states.map(({ name }) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
      {/* Accreditation status */}
      {investor.investor_type === 'entity' && (
        <Grid item xs={12} sm={12} md={6}>
          <AccreditedInvestorStatus investor={investor} handleChange={handleChange} errors={errors} />
        </Grid>
      )}
      <TextField
        className="personal-information-input"
        variant="outlined"
        placeholder="Signer's Full Name"
        error={errors.includes('fullName')}
        value={get(investor, 'fullName') || ''}
        onChange={handleChange('fullName')}
      />
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
