import { FormControl, TextField, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, { useState } from 'react';
import Loader from '../../../utils/Loader';
import './styles.scss';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router';

const validate = (formData) => {
  const required = [
    'state',
    'city',
    'zip',
    'date_signed',
    'f1_11',
    'f1_12',
    'f1_13',
    'address_number_street_and_apt_or_suite_no_see_instructions',
    'name_as_shown_on_your_income_tax_return_name_is_required_on_this_line_do_not_leave_this_line_blank',
  ];
  return required.reduce((acc, attr) => (formData[attr] ? acc : [...acc, attr]), []);
};

function W9Individual({ toggleOpen, createDoc, called, loading }) {
  const [errors, setErrors] = useState([]);
  const { state } = useLocation()

  const [formData, setFormData] = useState({
    name_as_shown_on_your_income_tax_return_name_is_required_on_this_line_do_not_leave_this_line_blank: state?.investorFormData?.legalName || '',
    address_number_street_and_apt_or_suite_no_see_instructions: '',
    f1_11: '',
    f1_12: '',
    f1_13: '',
    date_signed: moment().format('YYYY-MM-DD'),
    signature: '',
    state: '',
    city: '',
    zip: '',
  });

  const handleSubmit = () => {
    const { city, state, zip } = formData;
    const validation = validate(formData);
    console.log(validation);
    setErrors(validation);

    if (validation.length > 0) {
      return toast.warning('Incomplete Form');
    }

    const payload = { ...formData };
    // format city/state/zip
    delete payload.city;
    delete payload.state;
    delete payload.zip;
    payload.city_state_and_zip_code = `${city}, ${state} ${zip}`;

    createDoc(payload);
  };

  const handleChange = ({ target }) => {
    if (target.name.includes('f1')) {
      const onlyNumbers = target.value.replace(/\D+/g, '');
      return setFormData((prevData) => ({ ...prevData, [target.name]: onlyNumbers }));
    }
    setFormData((prevData) => ({ ...prevData, [target.name]: target.value }));
  };

  console.log('formData', formData)

  return (
    <section className="W9Individual">
      <div className="form-header">
        <h2>Complete W-9 Individual</h2>
        <h3>Please complete this W-9 in order to complete your tax requirements.</h3>
        <Button onClick={() => toggleOpen((open) => !open)} className="close-button">
          <CloseIcon />
        </Button>
      </div>
      <form className="form">
        <FormControl variant="outlined" className="form-field name">
          <label>
            Legal name
            <TextField
              value={
                formData.name_as_shown_on_your_income_tax_return_name_is_required_on_this_line_do_not_leave_this_line_blank
              }
              onChange={handleChange}
              name="name_as_shown_on_your_income_tax_return_name_is_required_on_this_line_do_not_leave_this_line_blank"
              variant="outlined"
              error={errors.includes(
                'name_as_shown_on_your_income_tax_return_name_is_required_on_this_line_do_not_leave_this_line_blank',
              )}
            />
          </label>
        </FormControl>

        <FormControl className="form-field address">
          <label>
            Street address
            <TextField
              value={formData.address_number_street_and_apt_or_suite_no_see_instructions}
              onChange={handleChange}
              name="address_number_street_and_apt_or_suite_no_see_instructions"
              variant="outlined"
              error={errors.includes('address_number_street_and_apt_or_suite_no_see_instructions')}
            />
          </label>
        </FormControl>

        <div className="region container">
          <FormControl className="form-field city">
            <label>
              City
              <TextField
                value={formData.city}
                name="city"
                onChange={handleChange}
                variant="outlined"
                error={errors.includes('city')}
              />
            </label>
          </FormControl>

          <FormControl required className="form-field state">
            <label>
              State
              <TextField
                value={formData.state}
                name="state"
                onChange={handleChange}
                variant="outlined"
                error={errors.includes('state')}
              />
            </label>
          </FormControl>

          <FormControl className="form-field zip">
            <label>
              Zip Code
              <TextField
                value={formData.zip}
                name="zip"
                onChange={handleChange}
                variant="outlined"
                error={errors.includes('zip')}
              />
            </label>
          </FormControl>
        </div>

        <div className="social container">
          <FormControl className="form-field ssn">
            <label>
              SSN
              <div className="ssn container">
                <TextField
                  name="f1_11"
                  value={formData.f1_11}
                  onChange={handleChange}
                  variant="outlined"
                  className="ssn-one"
                  inputProps={{ maxLength: '3' }}
                  error={errors.includes('f1_11')}
                />
                <TextField
                  name="f1_12"
                  value={formData.f1_12}
                  onChange={handleChange}
                  variant="outlined"
                  className="ssn-two"
                  inputProps={{ maxLength: '2' }}
                  error={errors.includes('f1_12')}
                />
                <TextField
                  name="f1_13"
                  value={formData.f1_13}
                  onChange={handleChange}
                  variant="outlined"
                  className="ssn-three"
                  inputProps={{ maxLength: '4' }}
                  error={errors.includes('f1_13')}
                />
              </div>
            </label>
          </FormControl>

          <FormControl className="form-field date-signed">
            <label>
              Date signed
              <TextField
                value={formData.date_signed}
                name="date_signed"
                onChange={handleChange}
                type="date"
                error={errors.includes('date_signed')}
                variant="outlined"
              />
            </label>
          </FormControl>
        </div>

        <FormControl className="form-field signature">
          <label>
            E-Signature
            <TextField
              value={
                formData.name_as_shown_on_your_income_tax_return_name_is_required_on_this_line_do_not_leave_this_line_blank
              }
              variant="outlined"
              className="signature"
            />
          </label>
        </FormControl>
        {called && loading ? <Loader /> :
          <Button onClick={handleSubmit} className="form-button accept">
            I accept
          </Button>
        }
        <Button onClick={() => toggleOpen((open) => !open)} className="form-button decline">
          I decline
        </Button>
      </form>
    </section>
  );
}

export default W9Individual;
