import { FormControl, TextField, Button, Select, MenuItem, Tooltip } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, { useState } from 'react';
import moment from 'moment';
import './styles.scss';
import { toast } from 'react-toastify';
import Loader from '../../../utils/Loader';
import { snakeCase } from 'lodash';

const validate = (formData) => {
  const required = [
    'tax_classification',
    'city',
    'state',
    'zip',
    'date_signed',
    'signature',
    'f1_15',
    'f1_14',
    'address_number_street_and_apt_or_suite_no_see_instructions',
    'name_as_shown_on_your_income_tax_return_name_is_required_on_this_line_do_not_leave_this_line_blank',
  ];
  return required.reduce((acc, attr) => (formData[attr] ? acc : [...acc, attr]), []);
};

function W9Entity({ toggleOpen, createDoc, called, loading }) {
  const [errors, setErrors] = useState([]);

  const [formData, setFormData] = useState({
    name_as_shown_on_your_income_tax_return_name_is_required_on_this_line_do_not_leave_this_line_blank: '',
    address_number_street_and_apt_or_suite_no_see_instructions: '',
    f1_14: '',
    f1_15: '',
    tax_classification: '',
    state: '',
    city: '',
    signature: '',
    zip: '',
    date_signed: moment().format('YYYY-MM-DD'),
  });

  const handleChange = ({ target }) => {
    if (target.name.includes('f1')) {
      const onlyNumbers = target.value.replace(/\D+/g, '');
      return setFormData((prevData) => ({ ...prevData, [target.name]: onlyNumbers }));
    }
    setFormData((prevData) => ({ ...prevData, [target.name]: target.value }));
  };

  const handleSubmit = () => {
    const { city, state, zip } = formData;
    const validation = validate(formData);
    setErrors(validation);

    if (validation.length > 0) {
      return toast.warning('Incomplete Form');
    }

    const payload = {
      ...formData,
      federalclassification: {
        tax_classification: formData.tax_classification,
      },
    };
    // format city/state/zip
    delete payload.city;
    delete payload.state;
    delete payload.zip;
    payload.city_state_and_zip_code = `${city}, ${state} ${zip}`;
    createDoc(payload);
  };

  return (
    <section className="W9Entity">
      <div className="form-header">
        <h2>Complete W-9 Entity</h2>
        <h3>Please complete this W-9 in order to complete your tax requirements.</h3>
      </div>
      <form className="form">
        <FormControl className="form-field name">
          <label>
            Legal Entity Name
            <TextField
              variant="outlined"
              onChange={handleChange}
              error={errors.includes(
                'name_as_shown_on_your_income_tax_return_name_is_required_on_this_line_do_not_leave_this_line_blank',
              )}
              name="name_as_shown_on_your_income_tax_return_name_is_required_on_this_line_do_not_leave_this_line_blank"
            />
          </label>
        </FormControl>

        <FormControl className="form-field address">
          <label>
            Tax Classification
            <Select
              onChange={handleChange}
              name="tax_classification"
              error={errors.includes('tax_classification')}
              value={formData.tax_classification}
              variant="outlined"
            >
              <MenuItem value="C Corporation">C Corporation</MenuItem>
              <MenuItem value="S Corporation">S Corporation</MenuItem>
              <MenuItem value="Partnership">Partnership</MenuItem>
              <MenuItem value="SMLLC">Invidivual/sole proprietor or single-member LLC</MenuItem>
              <MenuItem value="Trust/estate">Trust/estate</MenuItem>
              <MenuItem value="Limited Liability Company">Limited Liability Company</MenuItem>
              <MenuItem value="N/A">N/A</MenuItem>
            </Select>
          </label>
        </FormControl>
        {formData.tax_classification === 'Limited Liability Company' && (
          <FormControl className="form-field address">
            <label>
              What is your entity taxed as?
              <Select
                onChange={handleChange}
                name="taxed_as"
                error={errors.includes('taxed_as')}
                value={formData.taxed_as}
                variant="outlined"
              >
                <MenuItem value="C">C Corporation</MenuItem>
                <MenuItem value="S">S Corporation</MenuItem>
                <MenuItem value="P">Partnership</MenuItem>
              </Select>
            </label>
          </FormControl>
        )}

        <FormControl className="form-field address">
          <label>
            Street address
            <TextField
              onChange={handleChange}
              variant="outlined"
              value={formData.address_number_street_and_apt_or_suite_no_see_instructions}
              error={errors.includes('address_number_street_and_apt_or_suite_no_see_instructions')}
              name="address_number_street_and_apt_or_suite_no_see_instructions"
            />
          </label>
        </FormControl>

        <div className="region container ">
          <FormControl className="form-field city">
            <label>
              City
              <TextField
                variant="outlined"
                name="city"
                onChange={handleChange}
                error={errors.includes('city')}
                value={formData.city}
              />
            </label>
          </FormControl>

          <FormControl className="form-field state">
            <label>
              State
              <TextField
                variant="outlined"
                name="state"
                onChange={handleChange}
                error={errors.includes('state')}
                value={formData.state}
              />
            </label>
          </FormControl>

          <FormControl className="form-field zip">
            <label>
              Zip Code
              <TextField
                variant="outlined"
                name="zip"
                onChange={handleChange}
                error={errors.includes('zip')}
                value={formData.zip}
              />
            </label>
          </FormControl>
        </div>

        <div className="social container">
          <FormControl className="form-field ein">
            <label>
              EIN
              <div className="ein container">
                <Tooltip title="First 2 digits of EIN.">
                  <TextField
                    variant="outlined"
                    className="ein-one"
                    onChange={handleChange}
                    name="f1_14"
                    inputProps={{ maxLength: '2' }}
                    error={errors.includes('f1_14')}
                  />
                </Tooltip>
                <Tooltip title="Last 7 digits of EIN.">
                  <TextField
                    variant="outlined"
                    onChange={handleChange}
                    name="f1_15"
                    className="ein-two"
                    inputProps={{ maxLength: '7' }}
                    error={errors.includes('f1_15')}
                  />
                </Tooltip>
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
              value={formData.signature}
              variant="outlined"
              onChange={handleChange}
              name="signature"
              error={errors.includes('signature')}
              className="signature-input"
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

      <Button onClick={() => toggleOpen((open) => !open)} className="close-button">
        <CloseIcon />
      </Button>
    </section>
  );
}

export default W9Entity;
