import {
  FormControl,
  TextField,
  Button,
  Select,
  MenuItem,
  Tooltip,
  Checkbox,
} from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CloseIcon from '@material-ui/icons/Close';
import React, { useState } from 'react';
import moment from 'moment';
import './styles.scss';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router';
import Loader from '../../../utils/Loader';

const validate = (formData, revocableTrust) => {
  let required = [
    'tax_classification',
    'city',
    'state',
    'zip',
    'date_signed',
    'signature',
    'address',
    'entity_name',
  ];

  revocableTrust ? required.push('ssn_1', 'ssn_2', 'ssn_3') : required.push('ein_1', 'ein_2');

  if (formData.tax_classification === 'SMLLC') {
    required.push('ein_1', 'ein_2');
  }

  return required.reduce((acc, attr) => (formData[attr] ? acc : [...acc, attr]), []);
};

function W9Entity({ toggleOpen, createDoc, called, loading }) {
  const [errors, setErrors] = useState([]);
  const [revocableTrust, setRevocableTrust] = useState(false);
  const { state } = useLocation();
  const [formData, setFormData] = useState({
    entity_name: state?.investorFormData?.legalName || '',
    address: '',
    ein_1: '',
    ein_2: '',
    ssn_1: '',
    ssn_2: '',
    ssn_3: '',
    tax_classification: '',
    state: '',
    city: '',
    signature: '',
    zip: '',
    date_signed: moment().format('YYYY-MM-DD'),
  });

  const handleChange = ({ target }) => {
    if (target.name.includes('ein') || target.name.includes('ssn')) {
      const onlyNumbers = target.value.replace(/\D+/g, '');
      return setFormData((prevData) => ({ ...prevData, [target.name]: onlyNumbers }));
    }
    if (target.name.includes('tax_classification') && target.value !== 'Trust/estate') {
      setRevocableTrust(false);
      setFormData((prevData) => ({ ...prevData, ssn_1: '', ssn_2: '', ssn_3: '' }));
    }
    setFormData((prevData) => ({ ...prevData, [target.name]: target.value }));
  };

  const handleSubmit = () => {
    const { city, state, zip } = formData;
    const validation = validate(formData, revocableTrust);
    setErrors(validation);

    if (validation.length > 0) {
      return toast.warning('Incomplete form');
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
      <div classname="form-container">
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
                value={formData['entity_name']}
                error={errors.includes('entity_name')}
                name="entity_name"
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
                <MenuItem value="SMLLC">Sole proprietor or single-member LLC</MenuItem>
                <MenuItem value="Trust/estate">Trust/estate</MenuItem>
                <MenuItem value="Limited Liability Company">Limited Liability Company</MenuItem>
                <MenuItem value="N/A">N/A</MenuItem>
              </Select>
            </label>
          </FormControl>

          {formData.tax_classification === 'SMLLC' && (
            //TODO: add prefill for signnature
            <FormControl className="form-field disregarded-entity-name">
              <label>
                SMLLC Owner Name
                <TextField
                  variant="outlined"
                  onChange={handleChange}
                  value={formData['smllc_owner']}
                  error={errors.includes('smllc_owner')}
                  name="smllc_owner"
                />
              </label>
            </FormControl>
          )}

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
                  <MenuItem value="C Corporation">C Corporation</MenuItem>
                  <MenuItem value="S Corporation">S Corporation</MenuItem>
                  <MenuItem value="Partnership">Partnership</MenuItem>
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
                value={formData.address}
                error={errors.includes('address')}
                name="address"
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
          {formData.tax_classification === 'Trust/estate' && (
            <div className="social container">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={revocableTrust}
                    onChange={() => {
                      if (formData.tax_classification !== 'Trust/estate') {
                        return;
                      }
                      setRevocableTrust(!revocableTrust);
                      if (!revocableTrust) {
                        setFormData({
                          ...formData,
                          ein_1: '',
                          ein_2: '',
                        });
                      } else {
                        setFormData({
                          ...formData,
                          ssn_1: '',
                          ssn_2: '',
                          ssn_3: '',
                        });
                      }
                    }}
                    name="revocableTrustCheck"
                    color="primary"
                  />
                }
                label="My entity does not have an EIN"
              />
            </div>
          )}

          <div className="container">
            {!revocableTrust ? (
              <FormControl className="form-field ein">
                <label>
                  EIN
                  <div className="ein container">
                    <Tooltip title="First 2 digits of EIN.">
                      <TextField
                        variant="outlined"
                        className="ein-one"
                        onChange={handleChange}
                        name="ein_1"
                        inputProps={{ maxLength: '2' }}
                        error={errors.includes('ein_1')}
                        value={formData.ein_1}
                      />
                    </Tooltip>
                    <Tooltip title="Last 7 digits of EIN.">
                      <TextField
                        variant="outlined"
                        onChange={handleChange}
                        name="ein_2"
                        className="ein-two"
                        inputProps={{ maxLength: '7' }}
                        error={errors.includes('ein_2')}
                        value={formData.ein_2}
                      />
                    </Tooltip>
                  </div>
                </label>
              </FormControl>
            ) : (
              <FormControl className="form-field ssn">
                SSN
                <div className="ssn container">
                  <Tooltip title="First 3 digits of SSN.">
                    <TextField
                      name="ssn_1"
                      value={formData.ssn_1}
                      onChange={handleChange}
                      variant="outlined"
                      className="ssn-one"
                      inputProps={{ maxLength: '3' }}
                      error={errors.includes('ssn_1')}
                    />
                  </Tooltip>

                  <Tooltip title="Second 2 digits of SSN.">
                    <TextField
                      name="ssn_2"
                      value={formData.ssn_2}
                      onChange={handleChange}
                      variant="outlined"
                      className="ssn-two"
                      inputProps={{ maxLength: '2' }}
                      error={errors.includes('ssn_2')}
                    />
                  </Tooltip>
                  <Tooltip title="Last 4 digits of SSN.">
                    <TextField
                      name="ssn_3"
                      value={formData.ssn_3}
                      onChange={handleChange}
                      variant="outlined"
                      className="ssn-three"
                      inputProps={{ maxLength: '4' }}
                      error={errors.includes('ssn_3')}
                    />
                  </Tooltip>
                </div>
              </FormControl>
            )}
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

          {formData.tax_classification === 'SMLLC' && (
            <FormControl className="form-field social">
              Social Security Number
              <div className="container">
                <Tooltip title="First 3 digits of SSN.">
                  <TextField
                    name="ssn_1"
                    value={formData.ssn_1}
                    onChange={handleChange}
                    variant="outlined"
                    className="ssn-one"
                    inputProps={{ maxLength: '3' }}
                    error={errors.includes('ssn_1')}
                  />
                </Tooltip>
                <span className="dash">-</span>
                <Tooltip title="Second 2 digits of SSN.">
                  <TextField
                    name="ssn_2"
                    value={formData.ssn_2}
                    onChange={handleChange}
                    variant="outlined"
                    className="ssn-two"
                    inputProps={{ maxLength: '2' }}
                    error={errors.includes('ssn_2')}
                  />
                </Tooltip>
                <span className="dash">-</span>
                <Tooltip title="Last 4 digits of SSN.">
                  <TextField
                    name="ssn_3"
                    value={formData.ssn_3}
                    onChange={handleChange}
                    variant="outlined"
                    className="ssn-three"
                    inputProps={{ maxLength: '4' }}
                    error={errors.includes('ssn_3')}
                  />
                </Tooltip>
              </div>
            </FormControl>
          )}

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

          {called && loading ? (
            <Loader />
          ) : (
            <Button onClick={handleSubmit} className="form-button accept">
              I accept
            </Button>
          )}

          <Button onClick={() => toggleOpen((open) => !open)} className="form-button decline">
            I decline
          </Button>
        </form>

        <Button onClick={() => toggleOpen((open) => !open)} className="close-button">
          <CloseIcon />
        </Button>
      </div>
    </section>
  );
}

export default W9Entity;
