import {
  Autocomplete,
  Button,
  Checkbox,
  colors,
  Input,
  Logo,
  Typography,
} from '@allocations/design-system';
import { openInNewTab, validateEmail } from '@allocations/nextjs-common';
import { Grid, Paper } from '@material-ui/core';
import React, { useState } from 'react';
import codes from 'country-calling-code';
import useStyles from './styles';

const fields = [
  {
    name: 'organization_name',
    label: 'Organization Name',
    required: true,
  },
  {
    name: 'full_name',
    label: 'Full Name',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    required: true,
  },
  {
    name: 'phone',
    label: 'Phone Number',
    required: true,
  },
  {
    name: 'spv_count',
    label: 'How many SPVs do you manage?',
    required: false,
  },
];

export default function DataStorageForm({
  setOpenModal,
  setForm,
  form,
  setCountryCode,
  countryCode,
}) {
  const classes = useStyles();
  const [errors, setErrors] = useState({});

  const updateForm = (target) => {
    setForm({ ...form, [target.name]: target.name === 'terms' ? target.checked : target.value });
  };

  const validateFields = () => {
    let validated = true;
    const errorsFound = {};

    const validate = ({ field, validCondition, errorMessage }) => {
      const isValid = validCondition;
      if (!isValid) {
        errorsFound[field.name] = errorMessage;
      } else {
        errorsFound[field.name] = '';
      }
      return isValid;
    };

    const isNumeric = (value) => {
      return /^\d+$/.test(value);
    };

    fields.forEach((field) => {
      if (validated) {
        if (field.name === 'email') {
          validated = validate({
            field,
            validCondition: !!validateEmail(form[field.name]),
            errorMessage: 'Email is not valid',
          });
        } else if (field.name === 'phone') {
          validated = validate({
            field,
            validCondition: isNumeric(form[field.name]),
            errorMessage: 'This field has to be a number',
          });
          if (!countryCode) {
            validated = false;
            errorsFound[field.name] = 'Please select a country code';
          }
        } else if (field.name === 'spv_count') {
          validated = validate({
            field,
            validCondition: !form[field.name] || isNumeric(form[field.name]),
            errorMessage: 'This field has to be a number',
          });
        } else {
          validated = validate({
            field,
            validCondition: !field.required || !!form[field.name],
            errorMessage: 'This field is required',
          });
        }
      }
    });
    if (errorsFound) setErrors(errorsFound);
    return validated;
  };

  const handleSubmit = () => {
    if (!validateFields()) return;
    setOpenModal(true);
  };

  return (
    <Grid item xs={12} md={6} className={classes.rightSide}>
      <Paper className={classes.formContainer}>
        <Logo width={300} />
        {fields.map((field, index) => (
          <Grid container spacing={2} className={classes.dataFormInput} key={`field-${index}`}>
            {field.name === 'phone' && (
              <Grid item xs={12} md={6}>
                <Autocomplete
                  items={codes.map((code) => ({
                    id: code.countryCodes[0],
                    label: `${code.country} (${code.countryCodes[0]})`,
                  }))}
                  label="Country Code"
                  onChange={(_e, code) => setCountryCode(code.id)}
                  value={countryCode}
                  fullWidth={false}
                />
              </Grid>
            )}
            <Grid item md={field.name === 'phone' ? 6 : 12} xs={12}>
              <Input
                onChange={({ target }) => updateForm(target)}
                label={field.label}
                name={field.name}
                type="text"
                value={form[field.name]}
                error={!!errors[field.name]}
                helperText={errors[field.name]}
                fullWidth={field.name !== 'phone'}
              />
            </Grid>
          </Grid>
        ))}
        <div className={classes.termsContainer}>
          <span className={classes.checkbox}>
            <Checkbox
              name="terms"
              onChange={({ target }) => updateForm(target)}
              checked={form.terms}
            />
          </span>
          <span className={classes.text}>
            <Typography
              variant="paragraph3"
              fontWeight={400}
              content="By clicking here, I accept Allocations"
              component="span"
            />
          </span>
          <span className={classes.textSpace} />
          <span
            onClick={() => openInNewTab('//allocations.com/privacy-policy-migrations')}
            className={classes.terms}
          >
            <Typography
              variant="paragraph3"
              fontColor={colors.brand[300]}
              fontWeight={500}
              content="Privacy Policy"
              component="span"
            />
          </span>
          <span className={classes.textSpace} />
          <Typography variant="paragraph3" fontWeight={400} content="and" component="span" />
          <span className={classes.textSpace} />
          <span
            onClick={() => openInNewTab('//allocations.com/terms-and-conditions-migrations')}
            className={classes.terms}
          >
            <Typography
              variant="paragraph3"
              fontColor={colors.brand[300]}
              fontWeight={500}
              content=" Terms and Conditions"
              component="span"
            />
          </span>
        </div>
        <Button onClick={handleSubmit} text="Continue" fullWidth disabled={!form.terms} />
      </Paper>
    </Grid>
  );
}
