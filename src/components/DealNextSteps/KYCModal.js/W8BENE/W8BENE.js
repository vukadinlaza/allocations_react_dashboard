import { FormControl, TextField, Button, Checkbox, FormGroup, FormControlLabel, Select, MenuItem } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import React, { useState } from 'react'
import countries from 'country-region-data';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Loader from '../../../utils/Loader';
import './styles.scss'
import { useLocation } from 'react-router';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { toast } from 'react-toastify';
import moment from 'moment';

function W8BENE({ toggleOpen, called, loading, createDoc }) {
  const { state } = useLocation();

  const treatyClaimOptions = ['4_disregarded_entity', '4_partnership', '4_simple_trust', '4_grantor_trust']
  const countryNames = countries.map(c => c.countryName)
  const [differentMailingAddress, setDifferentMailingAddress] = useState(false);
  const [showTreatyClaim, setTreatyClaim] = useState(false);
  const [organizationCountrySearch, setOrganizationCountrySearch] = useState('')
  const [residenceCountrySearch, setResidenceCountrySearch] = useState('')
  const [mailingCountrySearch, setMailingCountrySearch] = useState('')

  const [chapter3Status, setChapter3Status] = useState('')
  const [chapter4Status, setChapter4Status] = useState('')
  const [section14Select, setSection14Select] = useState('')


  const [errors, setErrors] = useState([])
  const [formData, setFormData] = useState({
    organization_name: '',
    organization_country: '',
    disregarded_entity_name: '',
    '4_corporation': false,
    '4_disregarded_entity': false,
    '4_partnership': false,
    '4_simple_trust': false,
    '4_grantor_trust': false,
    '4_complex_trust': false,
    '4_estate': false,
    '4_government': false,
    '4_central_bank_of_issue': false,
    '4_tax_exempt_organization': false,
    '4_international_organization': false,
    '4_tax_exempt_organization': false,
    '4_treaty_claim_no': false,
    '4_treaty_claim_yes': false,
    '5_international_organization': false,
    '5_exempt_retirement_plan': false,
    '5_entity_wholly_owned': false,
    '5_nonfinancial_group_entity': false,
    '5_nonfinancial_start_up': false,
    '5_nonfinancial_entity': false,
    '5_501c': false,
    '5_nonprofit_organization': false,
    '5_publicly_traded_nffe': false,
    '5_excepted_territory_nffe': false,
    '5_active_nffe': false,
    '5_passive_nffe': false,
    '5_direct_reporting_nffe': false,
    '5_sponsored_direct_reporting_nffe': false,
    '5_not_financial_account': false,
    residence_address: '',
    residence_city_or_town: '',
    residence_country: '',
    mailing_address: '',
    mailing_city_or_town: '',
    mailing_country: '',
    us_tin: '',
    foreign_tin: '',
    '14a': false,
    '14a_resident_of': '',
    '14b': false,
    '14b_government': false,
    '14b_tax_exempt_pension': false,
    '14b_other_tax_exempt': false,
    '14b_publicly': false,
    '14b_subsidiary': false,
    '14b_base_erosion': false,
    '14b_derivative_benefits': false,
    '14b_active_trade': false,
    '14b_favorable': false,
    '14b_other': false,
    '14b_other_input': '',
    '14c': false,
    '15_article_paragraph': '',
    '15_rate': '',
    '15_income_type': '',
    '15_conditions': '',
    27: false,
    '28a': false,
    '28b': false,
    '29a': false,
    '29b': false,
    '29c': false,
    '29d': false,
    '29e': false,
    '29f': false,
    30: false,
    31: false,
    32: false,
    33: false,
    '33_date': '',
    34: false,
    '34_liquidation': '',
    35: false,
    '35_date': '',
    36: false,
    '37a': false,
    '37a_market': '',
    '37b': false,
    '37b_entity': '',
    '37b_market': '',
    38: false,
    39: false,
    '40a': false,
    '40b': false,
    '40c': false,
    42: '',
    43: false,
    '39': false,
    passive_nffe_owners: [
      { name: '', address: '', tin: '' }
    ],
    print_name: '',
    date_mm_dd_yyyy: moment().format('YYYY-MM-DD'),
    signature: ''
  });

  const validate = (formData) => {
    const required = [
      // 'organization_name',
      // 'organization_country',
      // 'disregarded_entity_name',
      // 'chapter3Status',
      //TODO: conditionally validate chapter 3 options
      // 'chapter4Status',
      //TODO: conditionally validate chapter 4 options
      // 'residence_address',
      // 'residence_country',
      // 'residence_city_or_town',
      // 'us_tin',
      // 'foreign_tin',
      // 'date_mm_dd_yyyy',
      // 'print_name'

      // 'permanent_residence_address_street_apt_or_suite_no_or_rural_route_do_not_use_a_p_o_box_or_in_care_of_address',
      // 'city_or_town_state_or_province_include_postal_code_where_appropriate',
      // 'print_name_of_signer',
      // 'date_of_birth_mm_dd_yyyy_see_instructions',
      // 'signature'
    ];

    if (differentMailingAddress) {
      required.push('mailing_address', 'mailing_city_or_town', 'mailing_country')
    }

    return required.reduce((acc, attr) => (formData[attr] ? acc : [...acc, attr]), []);
  };

  const handleSubmit = () => {
    // need to handle submit for W8-BEN-E??

    const validation = validate(formData)
    setErrors(validation)

    if (validation.length > 0) {
      return toast.warning('Incomplete Form');
    }


    createDoc(formData);
  };


  const handleChange = ({ target }) => {
    return setFormData(prev => ({ ...prev, [target.name]: target.value }))
  }

  const handleOwnerAdd = () => {
    const length = formData.passive_nffe_owners.length;


    if (length < 8) {
      setFormData(prevState => ({
        ...prevState,
        passive_nffe_owners: [
          ...prevState.passive_nffe_owners,
          { name: '', address: '', tin: '' }
        ]
      }))
    }
  }


  const handleOwnerDelete = (index) => {
    setFormData(prevState => ({
      ...prevState,
      passive_nffe_owners: [
        ...prevState.passive_nffe_owners,
        { name: '', address: '', tin: '' }
      ]
    }))

  }

  const handleOwnerChange = ({ target }, index) => {
    setFormData(prevState => ({
      ...prevState,
      passive_nffe_owners: {
        ...prevState.passive_nffe_owners,
        [index + 1]: {
          ...prevState.passive_nffe_owners[index + 1],
          [target.name]: target.value
        }
      }
    }))
  }

  const passiveNFFEOwners = Object.values(formData.passive_nffe_owners).map((owner, i) => {
    return (
      <FormControl className="owner" key={i}>
        <TextField
          className="owner-input"
          variant="outlined"
          name="name"
          onChange={e => handleOwnerChange(e, i)}
          value={owner.name}
          placeholder="Name" />

        <TextField
          name="address"
          className="owner-input"
          onChange={e => handleOwnerChange(e, i)}
          variant="outlined"
          value={owner.address}
          placeholder="Address" />

        <TextField
          name="tin"
          value={owner.tin}
          className="owner-input"
          onChange={e => handleOwnerChange(e, i)}
          variant="outlined"
          placeholder="TIN" />

        <Button
          variant="outlined"
          className="delete-owner"
          onClick={() => handleOwnerDelete(i + 1)}
        >
          <HighlightOffIcon />
        </Button>
      </FormControl>
    )
  })


  const handleCountryChange = (prop) => (e, newValue) => {
    if (e) {
      e.persist();
    }

    if (prop === 'organization_country') {
      if (newValue) {
        let countryValue = newValue === 'U.S.' || newValue === 'USA' ? 'United States' : newValue;
        return setFormData(prevData => ({ ...prevData, organization_country: countryValue }))
      }
    }
    if (prop === 'residence_country') {
      if (newValue) {
        let countryValue = newValue === 'U.S.' || newValue === 'USA' ? 'United States' : newValue;
        return setFormData(prevData => ({ ...prevData, residence_country: countryValue }))
      }
    }

    if (prop === 'mailing_country') {
      if (newValue) {
        return setFormData(prevData => ({ ...prevData, mailing_country: newValue }))
      }
    }

    if (prop === 'organization_country_search') {
      return setOrganizationCountrySearch(newValue)
    }

    if (prop === 'residence_country_search') {
      return setResidenceCountrySearch(newValue)
    }

    if (prop === 'mailing_country_search') {
      return setMailingCountrySearch(newValue)
    }
  };

  const handleCheckBox = ({ target }) => {
    setFormData(prev => ({ ...prev, [target.name]: !prev[target.name] }))
  }

  const handleDropdownChange = (field, value) => {

    const fieldMap = {
      '14_b_select': section14Select,
      'chapter4Status': chapter4Status,
      'chapter3Status': chapter3Status
    }

    const fieldUpdateMap = {
      '14_b_select': setSection14Select,
      'chapter4Status': setChapter4Status,
      'chapter3Status': setChapter3Status
    }

    const prev = fieldMap[field] ? fieldMap[field] : null;

    if (prev) {
      setFormData(prevData => ({
        ...prevData,
        [prev]: !prevData[prev],
        [value]: true
      }))

    } else {
      setFormData(prevData => ({
        ...prevData,
        [value]: true
      }))
    }

    fieldUpdateMap[field](value)

  }



  return (
    <section className="W8BENE">

      <div className="form-header">
        <h2>Complete W-8 BEN-E</h2>
        <h3>Please complete this W-8 in order to complete your tax requirements.</h3>
      </div>

      <form className="form">

        {/* Name input */}
        <FormControl className="form-field name">
          <label className="form-label">
            Name of organization that is the beneficial owner
            <TextField
              variant="outlined"
              name="organization_name"
              value={formData['organization_name']}
              error={errors.includes('organization_name')}
              onChange={handleChange}
            />
          </label>
        </FormControl>


        {/* Country input */}
        <FormControl
          className="form-field country-input"
          required
          variant="outlined"
        >
          <label className="form-label">
            Country of incorporation or organization
          <Autocomplete
              className="country-select"
              value={formData['organization_country']}
              onChange={(event, newInputValue) => handleCountryChange('organization_country')(event, newInputValue)}
              inputValue={organizationCountrySearch}
              onInputChange={(event, newInputValue) => {
                handleCountryChange('organization_country_search')(event, newInputValue);
              }}
              id="country-select"
              options={countryNames}
              getOptionLabel={(option) => option}
              renderInput={(params) => <TextField {...params}
                placeholder="Select a country"
                variant="outlined"
                error={errors.includes('organization_country')}
              />}
            />
          </label>
        </FormControl>



        <FormControl className="form-field address">
          <label className="form-label">
            Name of disregarded entity receiving the payment
            <TextField
              name="disregarded_entity_name"
              error={errors.includes('disregarded_entity_name')}
              onChange={handleChange}
              variant="outlined"
              value={formData['disregarded_entity_name']}
            />
          </label>
        </FormControl>

        <FormControl className="form-field chapter3Status">
          <label className="form-label">
            Chapter 3 Status (Entity type)
            <Select
              name="chapter3Status"
              variant="outlined"
              className="chapter-3-select"
              onChange={({ target }) => handleDropdownChange('chapter3Status', target.value)}
              error={errors.includes('chapter3Status')}
              value={chapter3Status}
            >
              <MenuItem value="4_corporation">Corporation</MenuItem>
              <MenuItem value="4_disregarded_entity">Disregarded entity</MenuItem>
              <MenuItem value="4_partnership">Partnership</MenuItem>
              <MenuItem value="4_simple_trust">Simple trust</MenuItem>
              <MenuItem value="4_grantor_trust">Grantor trust</MenuItem>
              <MenuItem value="4_complex_trust">Complex trust</MenuItem>
              <MenuItem value="4_estate">Estate</MenuItem>
              <MenuItem value="4_government">Government</MenuItem>
              <MenuItem value="4_central_bank_of_issue">Central Bank of Issue</MenuItem>
              <MenuItem value="4_tax_exempt_organization">Tax-exempt organization</MenuItem>
              <MenuItem value="4_private_foundation">Private foundation</MenuItem>
              <MenuItem value="4_international_organization">International organization</MenuItem>
            </Select>
          </label>
        </FormControl>



        {
          treatyClaimOptions.includes(chapter3Status) && (

            <FormControl className="checkbox">
              <label className="form-label">
                <Checkbox checked={formData['4_treaty_claim_yes']} onChange={() => {
                  if (formData['4_treaty_claim_yes']) {
                    setFormData(prev => ({
                      ...prev,
                      ['4_treaty_claim_no']: true,
                      ['4_treaty_claim_yes']: false
                    }))
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      ['4_treaty_claim_no']: false,
                      ['4_treaty_claim_yes']: true
                    }))
                  }
                }} name="showPart3" />
                If you entered disregarded entity, partnership, simple trust, or grantor trust above, is the entity a hybrid making a treaty claim?
              </label>
            </FormControl>
          )
        }


        {
          treatyClaimOptions.includes(chapter3Status) && formData['4_treaty_claim_yes'] && (
            <FormGroup className="form-group">
              <hr />

              <label className="form-group-label">
                I certify that (select all that apply):
              </label>


              <FormControl className="checkbox">

                <label className="form-label">
                  <Checkbox
                    checked={formData['14a']}
                    onChange={handleCheckBox}
                    name="14a"
                  />

                  <b>14a.&nbsp;</b>The beneficial owner is a resident of &nbsp;
                  <TextField
                    className="resident-of"
                    variant="outlined"
                    name="14a_resident_of"
                    onChange={handleChange}
                  />
                  &nbsp; within the meaning of the income tax treaty between the United States and that country.
                </label>

              </FormControl>


              <FormControl className="checkbox">
                <label className="form-label">
                  <Checkbox
                    checked={formData['14b']}
                    onChange={handleCheckBox}
                    name="14b" />

                  <b>14b.&nbsp;</b>
                  The beneficial owner derives the item (or items) of income for which the treaty benefits are claimed, and, if applicable, meets the requirements of the treaty provision dealing with limitation on benefits. The following are types of limitation on benefits provisions that may be included in an applicable tax treaty (check only one; see instructions):
                </label>

              </FormControl>


              {
                formData['14b'] && (

                  <FormControl className="form-field">

                    <Select
                      variant="outlined"
                      name="14_b_select"
                      value={section14Select}
                      onChange={({ target }) => handleDropdownChange('14_b_select', target.value)}
                    >

                      <MenuItem value="14b_government">Government</MenuItem>
                      <MenuItem value="14b_tax_exempt_pension">
                        Tax exempt pension trust or pension fund
                      </MenuItem>
                      <MenuItem value="14b_other_tax_exempt">
                        Other tax exempt organization
                      </MenuItem>
                      <MenuItem value="14b_publicly">
                        Publicly traded corporation
                      </MenuItem>
                      <MenuItem value="14b_subsidiary">
                        Subsidiary of a publicly traded corporation
                      </MenuItem>
                      <MenuItem value="14b_base_erosion">
                        Company that meets the ownership and base erosion test
                      </MenuItem>
                      <MenuItem value="14b_derivative_benefits">
                        Company that meets the derivative benefits test
                      </MenuItem>
                      <MenuItem value="14b_active_trade">
                        Company with an item of income that meets active trade or business test
                      </MenuItem>
                      <MenuItem value="14b_favorable">
                        Favorable discretionary determination by the U.S. competent authority received
                      </MenuItem>
                      <MenuItem value="14b_other">
                        Other (specify Article and paragraph):
                      </MenuItem>

                    </Select>

                  </FormControl>
                )
              }

              {
                formData['14b'] &&
                formData['14b_other'] && (

                  <FormControl className="form-field">
                    <label className="form-label">
                      <TextField
                        onChange={handleChange}
                        variant="outlined"
                        name="14b_other_input"
                        placeholder="Other (please specify Article and paragraph):"
                      />
                    </label>
                  </FormControl>

                )
              }

              <FormControl className="checkbox">

                <label className="form-label">
                  <Checkbox
                    checked={formData['14c']}
                    onChange={handleCheckBox}
                    name="14c" />

                  <b>14c.&nbsp;</b>The beneficial owner is claiming treaty benefits for U.S source dividends received from a foreign corporation or interest from a U.S. trade or business of a foreign corporation and meets qualified resident status (see instructions).
                </label>

              </FormControl>


              <FormControl className="form-input">

                <label className="form-group-label">
                  Special rates and conditions (if applicable, see instructions)
                </label>

                <label className="form-label" >
                  The beneficial owner is claiming the provisions of Article and paragraph
                  <TextField
                    className="label-input"
                    variant="outlined"
                  />
                </label>

                <label className="form-label">
                  of the treaty identified on line 14a above to claim a
                  <TextField
                    className="label-input"
                    variant="outlined"
                  />
                </label>

                <label className="form-label">
                  % rate of withholding on (specify type on income):
                  <TextField
                    className="label-input"
                    variant="outlined"
                  />
                </label>

                <label className="form-label">
                  Explain the additional conditions in the Article the beneficial owner meets to be eligible for the rate of withholding:
                  <TextField
                    className="label-input"
                    variant="outlined"
                  />
                </label>

              </FormControl>

              <hr />

            </FormGroup>
          )
        }


        <FormControl className="form-field chapter4Status">
          <label className="form-label">
            Chapter 4 Status (FATCA status)
            <Select
              name="chapter4Status"
              error={errors.includes('chapter4Status')}
              value={chapter4Status}
              onChange={({ target }) => handleDropdownChange('chapter4Status', target.value)}
              variant="outlined"
              className="chapter-3-select">
              <MenuItem value="4_active_nffe">Active NFFE</MenuItem>
              <MenuItem value="4_passive_nffe">Passive NFFE</MenuItem>
              <MenuItem value="4_501(c)">501(c) organization</MenuItem>
              <MenuItem value="4_international_organization">International organization</MenuItem>
              <MenuItem value="4_exempt_retirement_plans">Exempt retirement plans</MenuItem>
              <MenuItem value="4_entity_wholly_owned">Entity wholly owned by exempt beneficial owners</MenuItem>
              <MenuItem value="4_excepted_nonfinancial_group_entity">Excepted nonfinancial group entity</MenuItem>
              <MenuItem value="4_excepted_nonfinancial_start_up">Excepted nonfinancial start-up company</MenuItem>
              <MenuItem value="4_excepted_nonfinancial_entity_liquidation">Excepted nonfinancial entity in liquidation or bankruptcy</MenuItem>
              <MenuItem value="4_nonprofit_organization">Nonprofit organization</MenuItem>
              <MenuItem value="4_publicly_traded_nffe">Publicly traded NFFE or NFFE affiliate of a publicly traded corporation</MenuItem>
              <MenuItem value="4_excepted_territory_nffe">Excepted territory NFFE</MenuItem>
              <MenuItem value="4_direct_reporting_nffe">Direct reporting NFFE</MenuItem>
              <MenuItem value="4_sponsored_direct_reporting_nffe">Sponsored direct reporting NFFE</MenuItem>
              <MenuItem value="4_non_financial_account">Account that is not a financial account</MenuItem>
              <MenuItem value="4_other">Other</MenuItem>
            </Select>
          </label>
        </FormControl>


        {
          formData['5_nonfinancial_entity'] && (

            <FormGroup className="form-group">

              <FormControl className="checkbox-list">
                <label className="form-label">
                  <b>33&nbsp;</b>
                  <Checkbox
                    checked={formData['33']}
                    onChange={handleCheckBox}
                    name="33" />
                  I certify that the entity identified in Part I:
                </label>

                <ul>

                  <li className="terms">
                    Filed a plan of liquidation, filed a plan of reorganization, or filed for bankruptcy on
                    <TextField />;
                  </li>

                  <li className="terms">
                    During the past 5 years has not been engaged in business as a financial institution or acted as a passive NFFE;
                  </li>

                  <li className="terms">
                    Is either liquidating or emerging from a reorganization or bankruptcy with the intent to continue or recommence operations as a nonfinancial
                    entity; <strong>and</strong>
                  </li>

                  <li className="terms">
                    Has, or will provide, documentary evidence such as a bankruptcy filing or other public documentation that supports its claim if it remains in bankruptcy or liquidation for more than 3 years.
                  </li>

                </ul>

              </FormControl>
            </FormGroup>
          )
        }

        {
          formData['chapter4Status'] === 'excepted_nonfinancial_start_up' && (

            <FormGroup className="form-group">

              <FormControl className="checkbox-list">
                <label className="form-label">
                  <b>33&nbsp;</b>
                  <Checkbox
                    checked={formData['33']}
                    onChange={handleCheckBox}
                    name="33" />
                  I certify that the entity identified in Part I:
                </label>

                <ul>

                  <li className="terms">
                    Was formed on (or, in the case of a new line of business, the date of board resolution approving the new line of business). Date must be less than 24 months prior to date of payment.
                    <TextField type="date" className="date-input" />

                  </li>

                  <li className="terms">
                    Is not yet operating a business and has no prior operating history or is investing capital in assets with the intent to operate a new line of business other than that of a financial institution or passive NFFE;
                  </li>

                  <li className="terms">
                    Is investing capital into assets with the intent to operate a business other than that of a financial institution;  <strong>and</strong>
                  </li>

                  <li className="terms">
                    Does not function (or hold itself out) as an investment fund, such as a private equity fund, venture capital fund, leveraged buyout fund, or any investment vehicle whose purpose is to acquire or fund companies and then hold interests in those companies as capital assets for investment purposes.
                  </li>

                </ul>

              </FormControl>
            </FormGroup>
          )
        }

        {
          formData['chapter4Status'] === 'excepted_nonfinancial_group_entity' && (

            <FormGroup className="form-group">

              <FormControl className="checkbox-list">
                <label className="form-label">
                  <b>32&nbsp;</b>
                  <Checkbox
                    checked={formData['p3_c3']}
                    onChange={handleCheckBox}
                    name="p3_c3" />
                  I certify that the entity identified in Part I:
                </label>

                <ul>

                  <li className="terms">
                    Is a holding company, treasury center, or captive finance company and substantially all of the entity's activities are functions described in Regulations section 1.1471-5(e)(5)(i)(C) through (E);
                  </li>

                  <li className="terms">
                    Is not a depository or custodial institution (other than for members of the entity's expanded affiliated group); <strong>and</strong>
                  </li>

                  <li className="terms">
                    Does not function (or hold itself out) as an investment fund, such as a private equity fund, venture capital fund, leveraged buyout fund, or any investment vehicle with an investment strategy to acquire or fund companies and then hold interests in those companies as capital assets for investment purposes.
                  </li>

                </ul>

              </FormControl>
            </FormGroup>
          )
        }

        {
          formData['chapter4Status'] === 'sponsored_direct_reporting_nffe' && (

            <FormGroup className="form-group">

              <FormControl className="form-input">
                <label className="form-label">
                  <strong className="strong">
                    42&nbsp;
                  </strong>
                  Name of sponsoring entity:
                  <TextField
                    className="label-input"
                  />
                </label>
              </FormControl>

              <FormControl className="checkbox-list">
                <label className="form-label">
                  <b>43&nbsp;</b>
                  <Checkbox
                    checked={formData['p3_c3']}
                    onChange={handleCheckBox}
                    name="p3_c3" />
                  I certify that the entity identified in Part I is a direct reporting NFFE that is sponsored by the entity identified on line 42.
                </label>
              </FormControl>

            </FormGroup>
          )
        }

        {
          formData['chapter4Status'] === 'entity_wholly_owned' && (

            <FormGroup className="form-group">

              <FormControl className="checkbox-list">
                <label className="form-label">
                  <b>30&nbsp;</b>
                  <Checkbox
                    checked={formData['p3_c3']}
                    onChange={handleCheckBox}
                    name="p3_c3" />
                    I certify that the entity identified in Part I:
                </label>

                <ul>

                  <li className="terms">
                    Is an FFI solely because it is an investment entity;
                  </li>

                  <li className="terms">
                    Each direct holder of an equity interest in the investment entity is an exempt beneficial owner described in Regulations section 1.1471-6 or in an applicable Model 1 or Model 2 IGA;
                  </li>

                  <li className="terms">
                    Each direct holder of a debt interest in the investment entity is either a depository institution (with respect to a loan made to such entity) or an exempt beneficial owner described in Regulations section 1.1471-6 or an applicable Model 1 or Model 2 IGA.
                  </li>

                  <li className="terms">
                    Has provided an owner reporting statement that contains the name, address, TIN (if any), chapter 4 status, and a description of the type of documentation provided to the withholding agent for every person that owns a debt interest constituting a financial account or direct equity interest in the entity; <strong>and</strong>
                  </li>

                  <li className="terms">
                    Has provided documentation establishing that every owner of the entity is an entity described in Regulations section 1.1471-6(b), (c), (d), (e), (f) and/or (g) without regard to whether such owners are beneficial owners.
                  </li>
                </ul>

              </FormControl>
            </FormGroup>
          )
        }

        {
          formData['chapter4Status'] === 'international_organization' && (

            <FormGroup className="form-group">

              <label className="form-group-label">
                Check box 28a or 28b, whichever applies.
              </label>

              <FormControl className="checkbox-list">
                <label className="form-label">
                  <b>28a&nbsp;</b>
                  <Checkbox
                    checked={formData['p3_c3']}
                    onChange={handleCheckBox}
                    name="p3_c3" />
                  I certify that the entity identified in Part I is an international organization described <br /> in section 7701(a)(18).
                </label>
              </FormControl>

              <FormControl className="checkbox-list">

                <label className="form-label">
                  <b>28b&nbsp;</b>
                  <Checkbox
                    checked={formData['p3_c3']}
                    onChange={handleCheckBox}
                    name="p3_c3" />
                  I certify that the entity identified in Part I:
                </label>

                <ul>
                  <li className="terms">
                    Is comprised primarily of foreign governments;
                  </li>
                  <li className="terms">
                    Is recognized as an intergovernmental or supranational organization under a foreign law similar to the International Organizations Immunities Act or that has in effect a headquarters agreement with a foreign government;
                  </li>
                  <li className="terms">
                    The benefit of the entity's income does not inure to any private person; <strong>and</strong>
                  </li>
                  <li className="terms">
                    Is the beneficial owner of the payment and is not engaged in commercial financial activities of a type engaged in by an insurance company,
                    custodial institution, or depository institution with respect to the payments, accounts, or obligations for which this form is submitted (except as permitted in Regulations section 1.1471-6(h)(2)).
                  </li>
                </ul>

              </FormControl>
            </FormGroup>
          )
        }

        {
          formData['chapter4Status'] === 'exempt_retirement_plans' && (

            <FormGroup className="form-group">

              <label className="form-group-label">
                Check box 29a, b, c, d, e, or f, whichever applies.
              </label>

              <FormControl className="checkbox-list">
                <label className="form-label">
                  <b>29a&nbsp;</b>
                  <Checkbox
                    checked={formData['p3_c3']}
                    onChange={handleCheckBox}
                    name="p3_c3" />
                  I certify that the entity identified in Part I:
                </label>

                <ul>
                  <li className="terms">
                    Is comprised primarily of foreign governments;
                  </li>
                  <li className="terms">
                    Is established in a country with which the United States has an income tax treaty in force (see Part III if claiming treaty benefits);
                  </li>
                  <li className="terms">
                    Is operated principally to administer or provide pension or retirement benefits; <strong>and</strong>
                  </li>
                  <li className="terms">
                    Is entitled to treaty benefits on income that the fund derives from U.S. sources (or would be entitled to benefits if it derived any such income) as a resident of the other country which satisfies any applicable limitation on benefits requirement.
                  </li>
                </ul>

              </FormControl>

              <FormControl className="checkbox-list">

                <label className="form-label">
                  <b>28b&nbsp;</b>
                  <Checkbox
                    checked={formData['p3_c3']}
                    onChange={handleCheckBox}
                    name="p3_c3" />
                  I certify that the entity identified in Part I:
                </label>

                <ul>
                  <li className="terms">
                    Is organized for the provision of retirement, disability, or death benefits (or any combination thereof) to beneficiaries that are former
                    employees of one or more employers in consideration for services rendered;
                  </li>

                  <li className="terms">
                    No single beneficiary has a right to more than 5% of the FFI's assets;
                  </li>

                  <li className="terms">
                    Is subject to government regulation and provides annual information reporting about its beneficiaries to the relevant tax authorities in the country in which the fund is established or operated; <strong>and</strong>

                    <p>
                      <strong>(i) &nbsp;</strong>
                      Is generally exempt from tax on investment income under the laws of the country in which it is established or operates due to its status as a retirement or pension plan;
                    </p>

                    <p>
                      <strong>(ii) &nbsp;</strong>
                      Receives at least 50% of its total contributions from sponsoring employers (disregarding transfers of assets from other plans described in this part, retirement and pension accounts described in an applicable Model 1 or Model 2 IGA, other retirement funds described in an applicable Model 1 or Model 2 IGA, or accounts described in Regulations section 1.1471-5(b)(2)(i)(A));
                    </p>

                    <p>
                      <strong>(iii) &nbsp;</strong>
                      Either does not permit or penalizes distributions or withdrawals made before the occurrence of specified events related to retirement, disability, or death (except rollover distributions to accounts described in Regulations section 1.1471-5(b)(2)(i)(A) (referring to retirement and pension accounts), to retirement and pension accounts described in an applicable Model 1 or Model 2 IGA, or to other retirement funds described in this part or in an applicable Model 1 or Model 2 IGA);
                      <strong>or</strong>
                    </p>

                    <p>
                      <strong>(iv) &nbsp;</strong>
                      Limits contributions by employees to the fund by reference to earned income of the employee or may not exceed $50,000 annually.
                    </p>

                  </li>

                  <li className="terms">
                    Is the beneficial owner of the payment and is not engaged in commercial financial activities of a type engaged in by an insurance company,
                    custodial institution, or depository institution with respect to the payments, accounts, or obligations for which this form is submitted (except as permitted in Regulations section 1.1471-6(h)(2)).
                  </li>

                </ul>

              </FormControl>

              <FormControl className="checkbox-list">
                <label className="form-label">
                  <b>29c&nbsp;</b>
                  <Checkbox
                    checked={formData['p3_c3']}
                    onChange={handleCheckBox}
                    name="p3_c3" />
                  I certify that the entity identified in Part I:
                </label>

                <ul>

                  <li className="terms">
                    Is organized for the provision of retirement, disability, or death benefits (or any combination thereof) to beneficiaries that are former
                    employees of one or more employers in consideration for services rendered;
                  </li>

                  <li className="terms">
                    Has fewer than 50 participants;
                  </li>

                  <li className="terms">
                    Is sponsored by one or more employers each of which is not an investment entity or passive NFFE;
                  </li>

                  <li className="terms">
                    Employee and employer contributions to the fund (disregarding transfers of assets from other plans described in this part, retirement and pension accounts described in an applicable Model 1 or Model 2 IGA, or accounts described in Regulations section 1.1471-5(b)(2)(i)(A)) are limited by reference to earned income and compensation of the employee, respectively;
                  </li>

                  <li className="terms">
                    Participants that are not residents of the country in which the fund is established or operated are not entitled to more than 20% of the fund's assets; <strong>and</strong>
                  </li>

                  <li className="terms">
                    Is subject to government regulation and provides annual information reporting about its beneficiaries to the relevant tax authorities in the country in which the fund is established or operates.
                  </li>
                </ul>

              </FormControl>

              <FormControl className="checkbox-list">

                <label className="form-label">
                  <b>29d&nbsp;</b>
                  <Checkbox
                    checked={formData['p3_c3']}
                    onChange={handleCheckBox}
                    name="p3_c3" />
                  I certify that the entity identified in Part I is formed pursuant to a pension plan that would meet the requirements of section 401(a), other than the requirement that the plan be funded by a trust created or organized in the United States.
                </label>

              </FormControl>

              <FormControl className="checkbox-list">

                <label className="form-label">
                  <b>29e&nbsp;</b>
                  <Checkbox
                    checked={formData['p3_c3']}
                    onChange={handleCheckBox}
                    name="p3_c3" />
                      I certify that the entity identified in Part I is established exclusively to earn income for the benefit of one or more retirement funds described in this part or in an applicable Model 1 or Model 2 IGA, or accounts described in Regulations section 1.1471-5(b)(2)(i)(A) (referring to retirement and pension accounts), or retirement and pension accounts described in an applicable Model 1 or Model 2 IGA.
                </label>

              </FormControl>

              <FormControl className="checkbox-list">
                <label className="form-label">
                  <b>29f&nbsp;</b>
                  <Checkbox
                    checked={formData['p3_c3']}
                    onChange={handleCheckBox}
                    name="p3_c3" />
                  I certify that the entity identified in Part I:
                </label>

                <ul>

                  <li className="terms">
                    Is established and sponsored by a foreign government, international organization, central bank of issue, or government of a U.S. possession (each as defined in Regulations section 1.1471-6) or an exempt beneficial owner described in an applicable Model 1 or Model 2 IGA to provide retirement, disability, or death benefits to beneficiaries or participants that are current or former employees of the sponsor (or persons designated by such employees); <strong>or</strong>
                  </li>

                  <li className="terms">
                    Is established and sponsored by a foreign government, international organization, central bank of issue, or government of a U.S. possession(each as defined in Regulations section 1.1471-6) or an exempt beneficial owner described in an applicable Model 1 or Model 2 IGA to provide retirement, disability, or death benefits to beneficiaries or participants that are not current or former employees of such sponsor, but are in consideration of personal services performed for the sponsor.
                  </li>

                </ul>

              </FormControl>

            </FormGroup>
          )
        }

        {
          formData['chapter4Status'] === 'active_nffe' && (
            <FormGroup className="form-group">

              <label className="form-group-label">
                <Checkbox
                  checked={formData['p3_c3']}
                  onChange={handleCheckBox}
                  name="p3_c3" />
                I certify that:
              </label>

              <ul>
                <li className="terms">
                  The entity identified in Part 1 is a foreign entity that is not a finanical institution;
                </li>

                <li className="terms">
                  Less than 50% of such entity's gross income for the preceding calendar year is passive income; <b>and</b>
                </li>

                <li className="terms">
                  Less than 50% of the assets held by such entity are assets that produce or are held for the production of passive income (calculated asa weighted average of the percentage of passive assets measured quarterly)
                </li>

              </ul>
            </FormGroup>
          )
        }

        {
          formData['chapter4Status'] === '501(c)' && (
            <FormGroup className="form-group">


              <label className="form-group-label">
                <Checkbox
                  checked={formData['501c']}
                  onChange={handleCheckBox}
                  name="501c" />
                I certify that the entity identified in Part I is a 501(c) organization that:
              </label>

              <ul className="terms-list">

                <li className="terms">
                  Has been issued a determination letter from the IRS that is currently in effect concluding that the payee is a section 501(c) organization that is dated
                  <TextField
                    className="date-input"
                    type="date"
                  />
                  <b>or;</b>
                </li>

                <li className="terms">
                  Has provided a copy of an opinion from U.S. counsel certifying that the payee is a section 501(c) organization (without regard to whether the payee is a foreign private foundation).
                </li>

              </ul>

            </FormGroup>
          )
        }


        {
          formData['4_nonprofit_organization'] && (
            <>
              <FormControlLabel
                className="checkbox"
                label="I certify that the entity identified in Part I is a nonprofit organization that meets the following requirements."
                control={
                  <Checkbox
                    checked={formData['4_nonprofit_organization']}
                    onChange={handleCheckBox}
                    name="4_nonprofit_organization" />
                }
              />

              <ul className="terms-list">
                <li className="terms">
                  The entity is established and maintained in its country of residence exclusively for religious, charitable, scientific, artistic, cultural or educational purposes;
                </li>
                <li className="terms">
                  The entity is exempt from income tax in its country of residence;
                </li>
                <li className="terms">
                  The entity has no shareholders or members who have a proprietary or beneficial interest in its income or assets;
                 </li>
                <li className="terms">
                  Neither the applicable laws of the entity's country of residence nor the entity's formation documents permit any income or assets of the entity
                  to be distributed to, or applied for the benefit of, a private person or noncharitable entity other than pursuant to the conduct of the entity's
                  charitable activities or as payment of reasonable compensation for services rendered or payment representing the fair market value of property
                  which the entity has purchased; <b>and</b>
                </li>
                <li className="terms">
                  The applicable laws of the entity's country of residence or the entity's formation documents require that, upon the entity's liquidation or
                  dissolution, all of its assets be distributed to an entity that is a foreign government, an integral part of a foreign government, a controlled entity
                  of a foreign government, or another organization that is described in this part or escheats to the government of the entity's country of
                  residence or any political subdivision thereof.
                </li>
              </ul>
            </>
          )
        }

        {
          formData['4_publicly_traded_nffe'] && (

            <FormGroup className="form-group">

              <label className="form-group-label">
                Check box 37a or 37b, whichever applies.
              </label>

              <FormControl className="checkbox-list">

                <label className="form-label">
                  <b>37a&nbsp;</b>
                  <Checkbox
                    checked={formData['p3_c3']}
                    onChange={handleCheckBox}
                    name="p3_c3" />
                  I certify that:
                </label>

                <ul>
                  <li>
                    The entity identified in Part I is a foreign corporation that is not a financial institution; and
                  </li>
                  <li>
                    The stock of such corporation is regularly traded on one or more established securities markets, including
                    (name one securities exchange upon which the stock is regularly traded).
                  </li>
                </ul>

              </FormControl>

              <FormControl className="checkbox-list">

                <label className="form-label">
                  <b>37b&nbsp;</b>
                  <Checkbox
                    checked={formData['p3_c3']}
                    onChange={handleCheckBox}
                    name="p3_c3" />
                  I certify that:
                </label>

                <ul>
                  <li className="terms">
                    The entity identified in Part I is a foreign corporation that is not a financial institution;
                  </li>
                  <li className="terms">
                    The entity identified in Part I is a member of the same expanded affiliated group as an entity the stock of which is regularly traded on an
                    established securities market;
                  </li>
                  <li className="terms">
                    The name of the entity, the stock of which is regularly traded on an established securities market, is <TextField /> ; <b>and</b>
                  </li>
                  <li className="terms">
                    The name of the securities market on which the stock is regularly traded is <TextField /> .
                  </li>
                </ul>

              </FormControl>


            </FormGroup>
          )
        }

        {
          formData['5_excepted_territory_nffe'] && (

            <FormGroup className="form-group">

              <FormControl className="checkbox-list">

                <label className="form-label">
                  <b>38&nbsp;</b>
                  <Checkbox
                    checked={formData['p3_c3']}
                    onChange={handleCheckBox}
                    name="p3_c3" />
                  I certify that:
                </label>

                <ul>

                  <li className="terms">
                    The entity identified in Part I is an entity that is organized in a possession of the United States;
                  </li>

                  <li className="terms">
                    The entity identified in Part I:

                    <p>
                      <b>(i)&nbsp;</b> Does not accept deposits in the ordinary course of a banking or similar business;
                    </p>

                    <p>
                      <b>(ii)&nbsp;</b>
                      Does not hold, as a substantial portion of its business, financial assets for the account of others; or
                    </p>

                    <p>
                      <b>(iii)&nbsp;</b> Is not an insurance company (or the holding company of an insurance company) that issues or is obligated to make payments with
                      respect to a financial account; and
                    </p>

                  </li>

                  <li className="terms">
                    All of the owners of the entity identified in Part I are bona fide residents of the possession in which the NFFE is organized or incorporated.
                  </li>
                </ul>

              </FormControl>

            </FormGroup>
          )
        }

        {
          formData['4_passive_nffe'] && (
            <FormGroup className="form-group">

              <hr />

              <FormControl className="checkbox">

                <label className="form-label">
                  <Checkbox
                    checked={formData['40a']}
                    onChange={handleCheckBox}
                    name="40a" />

                  <b>40a.&nbsp;</b>I certify that the entity identified in Part I is a foreign entity that is not a financial institution (other than an investment entity organized in a possession of the United States) and is not certifying its status as a publicly traded NFFE (or affiliate), excepted territory NFFE, direct reporting NFFE, or sponsored direct reporting NNFE.
                </label>

              </FormControl>

              <hr />

              <label className="form-group-label">
                Check box 40b or 40c, whichever applies.
              </label>

              <FormControl className="checkbox">

                <label className="form-label">
                  <Checkbox
                    checked={formData['40b']}
                    onChange={handleCheckBox}
                    name="40b" />

                  <b>40b.&nbsp;</b>I further certify that the entity identified in Part I has no substantial U.S. owner (or, if applicable, no controlling U.S. persons); or
                </label>

              </FormControl>

              <FormControl className="checkbox">

                <label className="form-label">
                  <Checkbox
                    checked={formData['40c']}
                    onChange={handleCheckBox}
                    name="40c" />

                  <b>40c.&nbsp;</b>I further certify that the entity identified in Part I has provided the name, address, and TIN of each substantial U.S. owner (or, if applicable, contrilling U.S. person) of the NFFE in Part XXIX.
                </label>

              </FormControl>

            </FormGroup>
          )
        }

        {
          formData['40c'] && formData['5_passive_nffe'] (
            <FormGroup className="form-group">

              <label className="form-group-label">
                Substantial U.S. Owners of Passive NFFE
                </label>

              { passiveNFFEOwners}

              <Button
                onClick={handleOwnerAdd}
                className="add-owner"
                variant="outlined"
              >
                Add U.S Owner
              </Button>


            </FormGroup>
          )
        }

        <FormGroup className="form-field residence">
          <hr />

          <FormControl className="address">
            <label className="form-label">
              Permanent residence address
            <TextField
                variant="outlined"
                className="address-input"
                name="residence_address"
                onChange={handleChange}
                error={errors.includes('residence_address')}
              />
            </label>
          </FormControl>

          <div className="residence-container">

            <FormControl className="city">
              <label className="form-label">
                City or town, state or province.
                <TextField
                  variant="outlined"
                  className="address-input"
                  name="residence_city_or_town"
                  onChange={handleChange}
                  error={errors.includes('residence_city_or_town')}

                />
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
                  value={formData['residence_country']}
                  onChange={(event, newInputValue) => handleCountryChange('residence_country')(event, newInputValue)}
                  inputValue={residenceCountrySearch}
                  onInputChange={(event, newInputValue) => {
                    handleCountryChange('residence_country_search')(event, newInputValue);
                  }}
                  id="country-select"
                  options={countryNames}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => <TextField {...params}
                    placeholder="Select a country"
                    error={errors.includes('residence_country')}
                    variant="outlined" />}
                />
              </label>
            </FormControl>

          </div>


          <FormControlLabel
            label="Mailing address is different than permanent address."
            control={<Checkbox checked={differentMailingAddress} onChange={() => setDifferentMailingAddress(t => !t)} name="differentMailing" />}
          />

          {
            differentMailingAddress && (
              <>
                <FormControl className="address">
                  <label className="form-label">
                    Mailing address
                    <TextField
                      variant="outlined"
                      className="address-input"
                      onChange={handleChange}
                      name="mailing_address"
                      error={errors.includes('mailing_address')}
                    />
                  </label>
                </FormControl>

                <div className='mailing-container'>

                  <FormControl className="city">
                    <label className="form-label">
                      City or town, state or province.
                      <TextField
                        variant="outlined"
                        className="address-input"
                        onChange={handleChange}
                        name="mailing_city_or_town"
                        error={errors.includes('mailing_city_or_town')}
                      />
                      <small><i>Include postal code where appropriate.</i></small>
                    </label>
                  </FormControl>

                  <FormControl
                    className="country"
                    required
                    variant="outlined"
                  >
                    <label className="form-label">
                      Mailing Country
                      <Autocomplete
                        className="country-select"
                        value={formData['mailing_country']}
                        onChange={(event, newInputValue) => handleCountryChange('mailing_country')(event, newInputValue)}
                        inputValue={mailingCountrySearch}
                        onInputChange={(event, newInputValue) => {
                          handleCountryChange('mailing_country_search')(event, newInputValue);
                        }}
                        id="country-select"
                        options={countryNames}
                        getOptionLabel={(option) => option}
                        renderInput={(params) => <TextField {...params}
                          placeholder="Select a country"
                          error={errors.includes('mailing_country')}
                          variant="outlined" />}
                      />
                    </label>
                  </FormControl>

                </div>
              </>
            )
          }

          <hr />

        </FormGroup>


        <div className="container">

          <FormControl className="form-field tin">
            <label className="form-label">
              U.S. taxpayer identification number (TIN), if required
              <TextField
                variant="outlined"
                className="us_tin"
                name="us_tin"
                onChange={handleChange}
                value={formData['us_tin']}
                error={errors.includes('us_tin')}
              />
            </label>
          </FormControl>

          <FormControl className="form-field tin">
            <label className="form-label">
              Foreign taxpayer identification number (TIN)
              <TextField
                variant="outlined"
                className="foreign_tin"
                name="foreign_tin"
                onChange={handleChange}
                value={formData['foreign_tin']}
                error={errors.includes('foreign_tin')}
              />
            </label>
          </FormControl>
        </div>


        <FormControl className="form-field date-signed">
          <label className="form-label">
            Date signed
              <TextField
              value={formData['date_mm_dd_yyyy']}
              onChange={handleChange}
              name="date_mm_dd_yyyy"
              type="date"
              error={errors.includes('date_mm_dd_yyyy')}
              variant="outlined"
            />
          </label>
        </FormControl>

        <FormControl className="form-field">
          <label className="form-label">Print Name
            <TextField
              variant="outlined"
              onChange={handleChange}
              name="print_name"
              value={formData.print_name}
              error={errors.includes('print_name')}
            />
          </label>
        </FormControl>


        <FormControl className="form-field signature">
          <label className="form-label">
            E-Signature
            <TextField
              variant="outlined"
              onChange={handleChange}
              name="signature"
              className="signature-input"
              value={formData.print_name}
            />
          </label>
        </FormControl>

        {/* {called && loading ? <Loader /> : */}
        <Button onClick={handleSubmit} className="form-button accept">
          I accept
        </Button>
        {/* } */}
        <Button className="form-button decline">
          I decline
        </Button>

      </form>

      <Button onClick={() => toggleOpen(open => !open)} className="close-button">
        <CloseIcon />
      </Button>

    </section >
  )
}

export default W8BENE
