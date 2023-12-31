/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  FormControl,
  TextField,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormLabel,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CloseIcon from '@material-ui/icons/Close';
import React, { useState } from 'react';
import './styles.scss';
import countries from 'country-region-data';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useLocation } from 'react-router';
import Loader from '../../../utils/Loader';

const validate = (formData, isTaxTreaty) => {
  const required = [
    'name_of_individual_who_is_the_beneficial_owner',
    'country_of_citizenship',
    'country',
    'permanent_residence_address_street_apt_or_suite_no_or_rural_route_do_not_use_a_p_o_box_or_in_care_of_address',
    'city_or_town_state_or_province_include_postal_code_where_appropriate',
    'print_name_of_signer',
    'date_mm_dd_yyyy',
    'date_of_birth_mm_dd_yyyy_see_instructions',
    'signature',
  ];

  if (isTaxTreaty) {
    required.push('country_of_residence');
  }

  return required.reduce((acc, attr) => (formData[attr] ? acc : [...acc, attr]), []);
};

function W8BEN({ toggleOpen, createDoc, called, loading }) {
  const [errors, setErrors] = useState([]);
  const [differentMailing, setDifferentMailing] = useState(false);
  const [isTaxTreaty, setIsTaxTreaty] = useState(false);
  const { state } = useLocation();

  const [formData, setFormData] = useState({
    name_of_individual_who_is_the_beneficial_owner: state?.investorFormData?.legalName || '',
    country_of_citizenship: '',
    permanent_residence_address_street_apt_or_suite_no_or_rural_route_do_not_use_a_p_o_box_or_in_care_of_address:
      '',
    country: '',
    city_or_town_state_or_province_include_postal_code_where_appropriate: '',
    mailing_address_if_different_from_above: '',
    mailing_city_or_town_state_or_province_include_postal_code_where_appropriate: '',
    mailing_country: '',
    ssn_or_itin: '',
    foreign_tax_identifying_number_see_instructions: '',
    date_of_birth_mm_dd_yyyy_see_instructions: '',
    print_name_of_signer: '',
    signature: '',
    capacity_in_which_acting_if_form_is_not_signed_by_beneficial_owner: '',
    date_mm_dd_yyyy: moment().format('YYYY-MM-DD'),
    country_of_residence: '',
    article_and_paragraph_of_applicable_treaty: '',
    withholding_rate_claimed: '',
    type_of_income_subject_to_reduced_withholding: '',
    additional_conditions: '',
  });

  const countryNames = countries.map((c) => c.countryName);
  const [countrySearch, setCountrySearch] = useState('');
  const [countryCitizenSearch, setCountryCitizenSearch] = useState('');
  const [countryResidenceSearch, setCountryResidenceSearch] = useState('');
  const [mailingCountrySearch, setMailingCountrySearch] = useState('');

  const handleSubmit = () => {
    const validation = validate(formData, isTaxTreaty);

    setErrors(validation);

    if (validation.length > 0) {
      return toast.warning('Incomplete form');
    }

    // if (Number(formData.withholding_rate_claimed) !== 0 && Number(formData.withholding_rate_claimed)) {
    //   formData.withholding_rate_claimed = `${formData.withholding_rate_claimed}%`;
    // }

    createDoc(formData);
  };

  const handleChange = ({ target }) => {
    if (
      target.name === 'ssn' ||
      target.name === 'foreign_tax_identifying_number_see_instructions'
    ) {
      const onlyNumbers = target.value.replace(/\D+/g, '');
      return setFormData((prevData) => ({ ...prevData, [target.name]: onlyNumbers }));
    }

    if (target.name === 'print_name_of_signer') {
      return setFormData((prevData) => ({
        ...prevData,
        [target.name]: target.value,
        signature: target.value,
      }));
    }
    return setFormData((prevData) => ({ ...prevData, [target.name]: target.value }));
  };

  const handleCountryChange = (prop) => (e, newValue) => {
    if (e) {
      e.persist();
    }
    if (prop === 'country') {
      if (newValue) {
        const countryValue = newValue === 'U.S.' || newValue === 'USA' ? 'United States' : newValue;
        return setFormData((prevData) => ({ ...prevData, country: countryValue }));
      }
    }
    if (prop === 'country_of_citizenship') {
      if (newValue) {
        const countryValue = newValue === 'U.S.' || newValue === 'USA' ? 'United States' : newValue;
        return setFormData((prevData) => ({ ...prevData, country_of_citizenship: countryValue }));
      }
    }
    if (prop === 'country_of_residence') {
      if (newValue) {
        const countryValue = newValue === 'U.S.' || newValue === 'USA' ? 'United States' : newValue;
        return setFormData((prevData) => ({ ...prevData, country_of_residence: countryValue }));
      }
    }
    if (prop === 'mailing_country') {
      if (newValue) {
        const countryValue = newValue === 'U.S.' || newValue === 'USA' ? 'United States' : newValue;
        return setFormData((prevData) => ({ ...prevData, mailing_country: countryValue }));
      }
    }
    if (prop === 'country_of_citizenship_search') {
      return setCountryCitizenSearch(newValue);
    }
    if (prop === 'country_of_residence_search') {
      return setCountryResidenceSearch(newValue);
    }
    if (prop === 'mailing_country_search') {
      return setMailingCountrySearch(newValue);
    }
    if (prop === 'country_search') {
      return setCountrySearch(newValue);
    }
  };

  return (
    <section className="W8BEN">
      <div className="form-header">
        <h2>Complete W-8 BEN</h2>
        <h3>Please complete this W-8 in order to complete your tax requirements.</h3>
      </div>
      <form className="form">
        <FormControl className="form-field name">
          <FormLabel className="form-label">
            Name of individual who is the beneficial owner
            <TextField
              variant="outlined"
              onChange={handleChange}
              error={errors.includes('name_of_individual_who_is_the_beneficial_owner')}
              name="name_of_individual_who_is_the_beneficial_owner"
              value={formData.name_of_individual_who_is_the_beneficial_owner}
            />
          </FormLabel>
        </FormControl>

        <FormControl className="form-field country-input" required variant="outlined">
          <FormLabel className="form-label">
            Country of citizenship
            <Autocomplete
              className="country-select"
              value={formData.country_of_citizenship}
              onChange={(event, newInputValue) =>
                handleCountryChange('country_of_citizenship')(event, newInputValue)
              }
              inputValue={countryCitizenSearch || ''}
              onInputChange={(event, newInputValue) => {
                handleCountryChange('country_of_citizenship_search')(event, newInputValue);
              }}
              id="country-select"
              options={[...countryNames, 'USA', 'U.S.']}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  error={errors.includes('country_of_citizenship')}
                />
              )}
            />
          </FormLabel>
        </FormControl>

        <FormGroup className="form-field residence">
          <FormControl className="address">
            <FormLabel className="form-label">
              Permanent residence address (street, apt. or suite no., or rural route)
              <span>Please do not use a P.O. box.</span>
              <TextField
                variant="outlined"
                onChange={handleChange}
                error={errors.includes(
                  'permanent_residence_address_street_apt_or_suite_no_or_rural_route_do_not_use_a_p_o_box_or_in_care_of_address',
                )}
                name="permanent_residence_address_street_apt_or_suite_no_or_rural_route_do_not_use_a_p_o_box_or_in_care_of_address"
                value={
                  formData.permanent_residence_address_street_apt_or_suite_no_or_rural_route_do_not_use_a_p_o_box_or_in_care_of_address
                }
              />
            </FormLabel>
          </FormControl>

          <div className="residence-container">
            <FormControl className="city">
              <FormLabel className="form-label">
                City or town, state or province.
                <TextField
                  variant="outlined"
                  onChange={handleChange}
                  error={errors.includes(
                    'city_or_town_state_or_province_include_postal_code_where_appropriate',
                  )}
                  name="city_or_town_state_or_province_include_postal_code_where_appropriate"
                  value={
                    formData.city_or_town_state_or_province_include_postal_code_where_appropriate
                  }
                />
                <small>
                  <i>Include postal code where appropriate.</i>
                </small>
              </FormLabel>
            </FormControl>

            <FormControl className="country" required variant="outlined">
              <FormLabel className="form-label">
                Country
                <Autocomplete
                  className="country-select"
                  value={formData.country}
                  onChange={(event, newInputValue) =>
                    handleCountryChange('country')(event, newInputValue)
                  }
                  inputValue={countrySearch}
                  onInputChange={(event, newInputValue) => {
                    handleCountryChange('country_search')(event, newInputValue);
                  }}
                  id="country-select"
                  options={[...countryNames, 'USA', 'U.S.']}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select a country"
                      error={errors.includes('country')}
                      variant="outlined"
                    />
                  )}
                />
              </FormLabel>
            </FormControl>
          </div>

          <FormControlLabel
            label="Mailing address is different than permanent address."
            control={
              <Checkbox
                checked={differentMailing}
                onChange={() => setDifferentMailing((t) => !t)}
                name="sameMailing"
              />
            }
          />
        </FormGroup>
        {differentMailing && (
          <FormGroup className="form-field mailing">
            <FormControl className="mailingAddress">
              <FormLabel className="form-label">
                Mailing address (if different from above)
                <TextField
                  variant="outlined"
                  onChange={handleChange}
                  error={errors.includes('mailing_address_if_different_from_above')}
                  name="mailing_address_if_different_from_above"
                  value={formData.mailing_address_if_different_from_above}
                />
              </FormLabel>
            </FormControl>

            <div className="residence-container">
              <FormControl className="city">
                <FormLabel className="form-label">
                  City or town, state or province.
                  <TextField
                    variant="outlined"
                    onChange={handleChange}
                    error={errors.includes(
                      'mailing_city_or_town_state_or_province_include_postal_code_where_appropriate',
                    )}
                    name="mailing_city_or_town_state_or_province_include_postal_code_where_appropriate"
                    value={
                      formData.mailing_city_or_town_state_or_province_include_postal_code_where_appropriate
                    }
                  />
                  <small>
                    <i>Include postal code where appropriate.</i>
                  </small>
                </FormLabel>
              </FormControl>

              <FormControl className="country" required variant="outlined">
                <FormLabel className="form-label">
                  Country
                  <Autocomplete
                    className="country-select"
                    value={formData.mailing_country}
                    onChange={(event, newInputValue) =>
                      handleCountryChange('mailing_country')(event, newInputValue)
                    }
                    inputValue={mailingCountrySearch}
                    onInputChange={(event, newInputValue) => {
                      handleCountryChange('mailing_country_search')(event, newInputValue);
                    }}
                    id="country-select"
                    options={[...countryNames, 'USA', 'U.S.']}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select a country" variant="outlined" />
                    )}
                  />
                </FormLabel>
              </FormControl>
            </div>
          </FormGroup>
        )}

        <FormControl className="form-field date-signed">
          <FormLabel className="form-label">
            Date of birth
            <TextField
              value={formData.date_of_birth_mm_dd_yyyy_see_instructions}
              name="date_of_birth_mm_dd_yyyy_see_instructions"
              onChange={handleChange}
              type="date"
              error={errors.includes('date_of_birth_mm_dd_yyyy_see_instructions')}
              variant="outlined"
            />
          </FormLabel>
        </FormControl>

        <div className="tax-id-container">
          <div className="tin-container">
            <FormControl className="tin">
              <label className="form-label">
                SSN or ITIN
                <span> (If applicable)</span>
                <div className="tin-inputs">
                  <TextField
                    variant="outlined"
                    className="ssn-tin"
                    onChange={handleChange}
                    inputProps={{ maxLength: '9' }}
                    name="ssn_or_itin"
                    error={errors.includes('ssn_or_itin')}
                  />
                </div>
              </label>
            </FormControl>

            <FormControl className="foreign-tax-id">
              <label className="form-label">
                Foreign tax ID number
                <span> (recommended)</span>
                <TextField
                  variant="outlined"
                  className="foreign-tax-id-input"
                  onChange={handleChange}
                  name="foreign_tax_identifying_number_see_instructions"
                  error={errors.includes('foreign_tax_identifying_number_see_instructions')}
                />
              </label>
            </FormControl>
          </div>

          <FormControlLabel
            label="Tax Treaty"
            control={
              <Checkbox
                checked={isTaxTreaty}
                onChange={() => setIsTaxTreaty((prev) => !prev)}
                name="taxTreaty"
              />
            }
          />
        </div>

        {isTaxTreaty ? (
          <div className="tax-treaty-container">
            <div className="tin-container">
              <FormControl className="tin" required variant="outlined">
                <label className="form-label">
                  Country of Residence
                  <Autocomplete
                    className="country-select"
                    value={formData.country_of_residence}
                    onChange={(event, newInputValue) =>
                      handleCountryChange('country_of_residence')(event, newInputValue)
                    }
                    inputValue={countryResidenceSearch || ''}
                    onInputChange={(event, newInputValue) => {
                      handleCountryChange('country_of_residence_search')(event, newInputValue);
                    }}
                    id="country-select"
                    options={[...countryNames, 'USA', 'U.S.']}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        error={errors.includes('country_of_residence')}
                      />
                    )}
                  />
                </label>
              </FormControl>

              <FormControl className="foreign-tax-id">
                <label className="form-label">
                  Article and Paragraph of Applicable Treaty
                  <div className="tin-inputs">
                    <TextField
                      variant="outlined"
                      className="foreign-tax-id-input"
                      onChange={handleChange}
                      name="article_and_paragraph_of_applicable_treaty"
                      error={errors.includes('article_and_paragraph_of_applicable_treaty')}
                    />
                  </div>
                </label>
              </FormControl>
            </div>

            <div className="tin-container">
              <FormControl className="tin">
                <label className="form-label">
                  Withholding Rate Claimed (%)
                  <div className="tin-inputs">
                    <TextField
                      variant="outlined"
                      className="ssn-tin"
                      onChange={handleChange}
                      name="withholding_rate_claimed"
                      error={errors.includes('withholding_rate_claimed')}
                    />
                  </div>
                </label>
              </FormControl>

              <FormControl className="foreign-tax-id">
                <label className="form-label">
                  Type of Income Subject to Reduced Withholding
                  <div className="tin-inputs">
                    <TextField
                      variant="outlined"
                      className="foreign-tax-id-input"
                      onChange={handleChange}
                      name="type_of_income_subject_to_reduced_withholding"
                      error={errors.includes('article_and_paragraph_of_applicable_treaty')}
                    />
                  </div>
                </label>
              </FormControl>
            </div>

            <div className="">
              <FormControl className="tax-treaty-form-field">
                <label className="form-label">
                  Additional Conditions
                  <TextField
                    variant="outlined"
                    onChange={handleChange}
                    name="additional_conditions"
                    error={errors.includes('additional_conditions')}
                  />
                </label>
              </FormControl>
            </div>
          </div>
        ) : null}

        <FormControl className="form-field name">
          <FormLabel className="form-label">
            Capacity in which acting (if form is not signed by beneficial owner)
            <TextField
              value={formData.capacity_in_which_acting_if_form_is_not_signed_by_beneficial_owner}
              name="capacity_in_which_acting_if_form_is_not_signed_by_beneficial_owner"
              onChange={handleChange}
              error={errors.includes(
                'capacity_in_which_acting_if_form_is_not_signed_by_beneficial_owner',
              )}
              variant="outlined"
            />
          </FormLabel>
        </FormControl>

        <FormControl className="form-field name">
          <FormLabel className="form-label">
            Print name of signer
            <TextField
              value={formData.print_name_of_signer}
              name="print_name_of_signer"
              onChange={handleChange}
              error={errors.includes('print_name_of_signer')}
              variant="outlined"
            />
          </FormLabel>
        </FormControl>

        <FormControl className="form-field date-signed">
          <FormLabel className="form-label">
            Date signed
            <TextField
              value={formData.date_mm_dd_yyyy}
              name="date_mm_dd_yyyy"
              onChange={handleChange}
              type="date"
              error={errors.includes('date_mm_dd_yyyy')}
              variant="outlined"
            />
          </FormLabel>
        </FormControl>

        <FormControl className="form-field signature">
          <FormLabel className="form-label">
            E-Signature
            <TextField
              value={formData.signature}
              name="signature"
              onChange={handleChange}
              error={errors.includes('signature')}
              variant="outlined"
            />
          </FormLabel>
        </FormControl>

        {called && loading ? (
          <Loader />
        ) : (
          <Button onClick={handleSubmit} className="form-button accept">
            I accept
          </Button>
        )}

        <Button className="form-button decline">I decline</Button>
      </form>
      <Button onClick={() => toggleOpen((open) => !open)} className="close-button">
        <CloseIcon />
      </Button>
    </section>
  );
}

export default W8BEN;
