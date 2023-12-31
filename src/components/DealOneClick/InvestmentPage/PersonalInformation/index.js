import React, { useState } from 'react';
import { get } from 'lodash';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Typography,
  FormLabel,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import countries from 'country-region-data';
import { UsaStates } from 'usa-states';
import {
  AccreditedInvestorStatus,
  ThreeCSevenAccrediedInvestorStatus,
} from '../../../forms/InvestorEdit';
import { PanelContainer, PanelLabel } from '../../../Panel';
import useStyles from './styles';

const usStates = new UsaStates();
const countryNames = countries.map((c) => c.countryName);
const stateNames = usStates.states.map((s) => s.name);

function PersonalInformation({
  investor,
  setInvestor,
  is3c7,
  errors,
  org,
  isFromModal = false,
  docSpringTemplateId,
}) {
  const [mailingDifferent, toggleMailingDifferent] = useState(false);
  const [entityDesignation, setEntityDesignation] = useState('');
  const [individualDesignation, setIndividualDesignation] = useState('');
  const classes = useStyles();
  const handleChange = (prop) => (e, newValue) => {
    if (e) {
      e.persist();
    }
    if (prop === 'entity_designation') {
      setEntityDesignation(e.target.value);

      if (individualDesignation !== '') {
        setInvestor((prev) => ({
          ...prev,
          [individualDesignation]: false,
          [e.target.value]: true,
        }));
      }

      if (entityDesignation !== '') {
        return setInvestor((prev) => ({
          ...prev,
          [entityDesignation]: false,
          [e.target.value]: true,
        }));
      }
      return setInvestor((prev) => ({ ...prev, [e.target.value]: true }));
    }

    if (prop === 'individual_designation') {
      setIndividualDesignation(e.target.value);

      if (entityDesignation !== '') {
        setInvestor((prev) => ({ ...prev, [entityDesignation]: false, [e.target.value]: true }));
      }
      if (individualDesignation !== '') {
        return setInvestor((prev) => ({
          ...prev,
          [individualDesignation]: false,
          [e.target.value]: true,
        }));
      }
      return setInvestor((prev) => ({ ...prev, [e.target.value]: true }));
    }

    if (prop === 'investor_type') {
      return setInvestor((prev) => ({
        ...prev,
        [prop]: e.target.value,
        accredited_investor_status: '',
        is3c7_options_status: '',
      }));
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
    <PanelContainer isFromModal={isFromModal}>
      <PanelLabel label="Personal Information" isFromModal={isFromModal} />

      {/* Investor Type */}
      <FormControl
        className={classes.root}
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
        className={classes.root}
        variant="outlined"
        required
        placeholder="Legal name of entity or individual"
        error={errors.includes('legalName')}
        value={get(investor, 'legalName') || ''}
        onChange={handleChange('legalName')}
      />

      {/* Country */}
      <FormControl className={classes.root} required variant="outlined">
        <Autocomplete
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
            <TextField
              {...params}
              error={errors.includes('country')}
              label="Country"
              variant="outlined"
            />
          )}
        />
      </FormControl>
      {investor.country === 'United States' && (
        <FormControl
          className={classes.root}
          required
          variant="outlined"
          disabled={!investor.country || get(investor, 'country') !== 'United States'}
        >
          <Autocomplete
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
              <TextField
                {...params}
                error={errors.includes('state')}
                label="State"
                variant="outlined"
              />
            )}
          />
        </FormControl>
      )}

      {[
        'tpl_y3GEaLkZMDqhHT6SqE',
        'tpl_zbmQNPrkqXnJmFMD7C',
        'tpl_sCjzLb53RKfSd7ZErJ',
        'tpl_ZAZ2ppLSMkjbRGzzT5',
      ].includes(docSpringTemplateId) && (
        <TextField
          className={classes.root}
          variant="outlined"
          placeholder="Street Address"
          error={errors.includes('address')}
          value={get(investor, 'address') || ''}
          onChange={handleChange('address')}
        />
      )}

      {/* Accreditation status */}
      {org !== 'irishangels' ? (
        is3c7 ? (
          <ThreeCSevenAccrediedInvestorStatus
            investor={investor}
            handleChange={handleChange}
            errors={errors}
          />
        ) : (
          <AccreditedInvestorStatus
            investor={investor}
            handleChange={handleChange}
            errors={errors}
          />
        )
      ) : (
        ''
      )}

      {investor.investor_type && investor.investor_type !== 'individual' && org !== 'irishangels' && (
        <>
          <TextField
            className={classes.root}
            variant="outlined"
            placeholder="Signer's Full Name"
            error={errors.includes('fullName')}
            value={get(investor, 'fullName') || ''}
            onChange={handleChange('fullName')}
          />
          <TextField
            className={classes.root}
            variant="outlined"
            placeholder="Title"
            error={errors.includes('title')}
            value={get(investor, 'title') || ''}
            onChange={handleChange('title')}
          />
        </>
      )}

      {/* Custom ENTITY fields for Irish Angels deals */}

      {org === 'irishangels' && (
        <>
          <Typography variant="subtitle2" className={classes.accreditationNotice}>
            Please initial below to certify that you are still an Accredited Investor, per SEC
            criteria, as detailed in Exhibit D of the IrishAngels Membership Agreement previously
            executed by you.
          </Typography>
          <TextField
            className={classes.root}
            variant="outlined"
            placeholder="Initials"
            error={errors.includes('initials')}
            value={get(investor, 'initials') || ''}
            onChange={handleChange('initials')}
            label="Initials"
          />
        </>
      )}
      {investor.investor_type && investor.investor_type === 'entity' && org === 'irishangels' && (
        <>
          <TextField
            className={classes.root}
            variant="outlined"
            placeholder="Enter your name"
            error={errors.includes('fullName')}
            value={get(investor, 'fullName') || ''}
            onChange={handleChange('fullName')}
          />
          <TextField
            className={classes.root}
            variant="outlined"
            placeholder="EIN (or SSN for Revokable Trusts)"
            error={errors.includes('ein')}
            inputProps={{ maxLength: 9 }}
            value={get(investor, 'ein') || ''}
            onChange={handleChange('ein')}
          />

          <FormControl
            className={classes.root}
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
            className={classes.root}
            variant="outlined"
            placeholder="Title"
            error={errors.includes('title')}
            value={get(investor, 'title') || ''}
            onChange={handleChange('title')}
          />
        </>
      )}

      {/* Custom INDIVIDUAL investor fields for Irish Angels deals */}

      {investor.investor_type && investor.investor_type === 'individual' && org === 'irishangels' && (
        <>
          <TextField
            className={`${classes.root} numbers`}
            variant="outlined"
            placeholder="Social Security Number"
            error={errors.includes('ssn')}
            value={get(investor, 'ssn') || ''}
            onChange={handleChange('ssn')}
            type="number"
            onInput={(e) => {
              e.target.value = e.target.value.slice(0, 9);
            }}
            label="Social Security Number"
          />

          <FormControl
            className={classes.root}
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

      {org === 'irishangels' && (
        <FormControl
          required
          error={errors.includes('investor_type')}
          variant="outlined"
          className={classes.addressContainer}
        >
          <FormLabel className={classes.label} htmlFor="home-address">
            Home Address:
            <TextField
              variant="outlined"
              placeholder="Address, City, State, Zip Code"
              error={errors.includes('home_address')}
              value={get(investor, 'home_address') || ''}
              onChange={handleChange('home_address')}
              id="home-address"
            />
          </FormLabel>
          {mailingDifferent && (
            <FormLabel className={classes.label} htmlFor="mailing-address">
              Mailing Address:
              <TextField
                variant="outlined"
                placeholder="Address, City, State, Zip Code"
                error={errors.includes('mailing_address')}
                value={get(investor, 'mailing_address') || ''}
                onChange={handleChange('mailing_address')}
                id="mailing-address"
              />
            </FormLabel>
          )}
          <FormLabel style={{ margin: 0, fontSize: '16px' }} htmlFor="mailing-address-checkbox">
            <Checkbox
              onChange={() => toggleMailingDifferent((t) => !t)}
              value="checkedA"
              inputProps={{ 'aria-label': 'mailing-address-checkbox' }}
              id="mailing-address-checkbox"
              style={{ paddingLeft: 0 }}
            />
            Different Mailing Address
          </FormLabel>
        </FormControl>
      )}

      <p className={classes.informationNotice}>
        Required by United States banking laws. This information is transmitted securely and will
        never be used for any purpose beyond executing your investment.
      </p>
    </PanelContainer>
  );
}

export default PersonalInformation;
