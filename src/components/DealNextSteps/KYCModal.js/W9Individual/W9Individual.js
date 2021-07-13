import { FormControl, TextField, Button, Grid } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import React, { useState, useEffect } from 'react';
import './styles.scss';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router';
import PlacesAutocomplete, { geocodeByPlaceId } from 'react-places-autocomplete';
import Loader from '../../../utils/Loader';

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
  const { state } = useLocation();

  // state for auto-complete
  const [address, setAddress] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [addressComponents, setAddressComponents] = useState('');

  const [formData, setFormData] = useState({
    // eslint-disable-next-line max-len
    name_as_shown_on_your_income_tax_return_name_is_required_on_this_line_do_not_leave_this_line_blank:
      state?.investorFormData?.legalName || '',
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

  const handleSelect = (address, placeId) => {
    setAddress(address);
    setPlaceId(placeId);
  };

  useEffect(() => {
    geocodeByPlaceId(placeId)
      .then((results) => setAddressComponents(results[0].address_components))
      .catch((error) => console.error(error));
  }, [placeId]);

  useEffect(() => {
    // set auto-complete address info (all or nothing)
    const addressInfo = () => {
      try {
        const streetNumber = (addressComponents === '' ? '' : addressComponents.filter((i) => i.types[0] === 'street_number')[0].long_name);
        const route= (addressComponents === '' ? '' : addressComponents.filter((i) => i.types[0] === 'route')[0].long_name);
        setFormData({
          ...formData,
          address_number_street_and_apt_or_suite_no_see_instructions: `${streetNumber} ${route}`,
          city: addressComponents === '' ? '' : addressComponents.filter((i) => i.types[0] === 'locality')[0].long_name,
          state: addressComponents === '' ? '' : addressComponents.filter((i) => i.types[0] === 'administrative_area_level_1')[0].long_name,
          zip: addressComponents === '' ? '' : addressComponents.filter((i) => i.types[0] === "postal_code")[0].long_name
        });
        setAddress(`${streetNumber} ${route}`);
      } catch {
        setFormData({
          ...formData,
          address_number_street_and_apt_or_suite_no_see_instructions: '',
          city: '',
          state: '',
          zip: '',
        });
        setAddress('');
      }
    };
    addressInfo();
  }, [addressComponents]);

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
          Legal name
          <TextField
            value={
              // eslint-disable-next-line max-len
              formData.name_as_shown_on_your_income_tax_return_name_is_required_on_this_line_do_not_leave_this_line_blank
            }
            onChange={handleChange}
            name="name_as_shown_on_your_income_tax_return_name_is_required_on_this_line_do_not_leave_this_line_blank"
            variant="outlined"
            error={errors.includes(
              'name_as_shown_on_your_income_tax_return_name_is_required_on_this_line_do_not_leave_this_line_blank',
            )}
          />
        </FormControl>

        <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
          {({ getInputProps, suggestions, getSuggestionItemProps }) => (
            <>
              <Autocomplete
                className="form-field address"
                options={suggestions}
                filterOptions={(x) => x}
                disableClearable
                onChange={handleChange}
                inputValue={address}
                onInputChange={(address) => address}
                getOptionLabel={(suggestion) => suggestion.description} // filter value
                renderInput={(params) => {
                  return (
                    <>
                      Street address
                      <TextField
                        {...params}
                        name="address_number_street_and_apt_or_suite_no_see_instructions"
                        variant="outlined"
                        error={errors.includes(
                          'address_number_street_and_apt_or_suite_no_see_instructions',
                        )}
                        {...getInputProps()}
                      />
                    </>
                  );
                }}
                renderOption={(suggestion) => {
                  const style = suggestion.active
                    ? {
                        backgroundColor: '#4169E1',
                        cursor: 'pointer',
                        width: '99%',
                        borderRadius: '5px',
                      }
                    : {
                        backgroundColor: '#FBFCFF',
                        cursor: 'pointer',
                        width: '99%',
                      };
                  return (
                    <Grid container spacing={0} alignItems="center">
                      <Grid item>
                        <LocationOnIcon style={{ color: '#4169E1' }} />
                      </Grid>
                      <Grid item xs>
                        <TextField
                          variant="outlined"
                          value={suggestion.description}
                          {...getSuggestionItemProps(suggestion, { style })}
                        />
                      </Grid>
                    </Grid>
                  );
                }}
              />
            </>
          )}
        </PlacesAutocomplete>

        <div className="region container">
          <FormControl className="form-field city">
            City
            <TextField
              value={formData.city}
              name="city"
              onChange={handleChange}
              variant="outlined"
              error={errors.includes('city')}
            />
          </FormControl>

          <FormControl required className="form-field state">
            State
            <TextField
              value={formData.state}
              name="state"
              onChange={handleChange}
              variant="outlined"
              error={errors.includes('state')}
            />
          </FormControl>

          <FormControl className="form-field zip">
            Zip Code
            <TextField
              value={formData.zip}
              name="zip"
              onChange={handleChange}
              variant="outlined"
              error={errors.includes('zip')}
            />
          </FormControl>
        </div>

        <div className="social container">
          <FormControl className="form-field ssn">
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
          </FormControl>

          <FormControl className="form-field date-signed">
            Date signed
            <TextField
              value={formData.date_signed}
              name="date_signed"
              onChange={handleChange}
              type="date"
              error={errors.includes('date_signed')}
              variant="outlined"
            />
          </FormControl>
        </div>

        <FormControl className="form-field signature">
          E-Signature
          <TextField
            value={
              // eslint-disable-next-line max-len
              formData.name_as_shown_on_your_income_tax_return_name_is_required_on_this_line_do_not_leave_this_line_blank
            }
            variant="outlined"
            className="signature"
          />
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
    </section>
  );
}

export default W9Individual;
