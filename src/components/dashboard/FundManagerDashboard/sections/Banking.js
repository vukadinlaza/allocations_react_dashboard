import React, { useEffect, useState } from 'react';
import { Button, Typography, TextField, Grid } from '@material-ui/core';
import { useQuery, gql, useMutation } from '@apollo/client';
import { get } from 'lodash';
import { toast } from 'react-toastify';
import moment from 'moment';
import Loader from '../../../utils/Loader';

/*
README
To add field validation:
  add field `validation` to a field obj in the field array, its value being a function
  and that function should return an obj with properties `valid` and `errorMessage`
*/

const REFERENCE_NUMBERS_BY_DEAL_ID = gql`
  query ReferenceNumbersByDealId($deal_id: String!) {
    referenceNumbersByDealId(deal_id: $deal_id) {
      number
      available
    }
  }
`;

const CREATE_ND_BANK_ACCOUNT = gql`
  mutation createNDBankAccount($accountInfo: AccountInfo!) {
    createNDBankAccount(accountInfo: $accountInfo) {
      success
    }
  }
`;

const fields = [
  {
    displayName: 'SPV Legal Name',
    prop: 'contactName',
    type: 'text',
  },
  {
    displayName: 'Account Holder Legal Name',
    prop: 'executorLegalName',
    type: 'text',
  },
  {
    displayName: 'Account Type',
    prop: 'accountType',
    type: 'text',
    default: 'Legal Entity',
  },
  {
    displayName: 'Address',
    prop: 'address',
    type: 'text',
    default: '8 The Green Suite A',
  },
  {
    displayName: 'City',
    prop: 'city',
    type: 'text',
    default: 'Dover',
  },
  {
    displayName: 'State',
    prop: 'state',
    type: 'text',
    default: 'Delaware',
  },
  {
    displayName: 'Country',
    prop: 'country',
    type: 'text',
    default: 'United States',
  },
  {
    displayName: 'Zip',
    prop: 'zip',
    type: 'text',
    default: '19901',
  },
  {
    displayName: 'Banking Email',
    default: 'nd-banking@allocations.com',
    prop: 'email',
    type: 'email',
    validator: (email) => {
      const errorMessage = 'Please enter a valid email.';
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@(([^<>()[\]\\.,;:\s@\\"]+\.)+[^<>()[\]\\.,;:\s@\\"]{2,})$/i;
      return { valid: emailRegex.test(email), errorMessage };
    },
  },
  {
    displayName: 'Allocations Contact Phone Number',
    prop: 'phone',
    type: 'text',
    validator: (phone) => {
      const errorMessage = 'Please enter a phone number in format 1-xxx-xxx-xxxx.';
      const reg = /^1-(\d{3})-(\d{3})-(\d{4})$/;
      return { valid: RegExp(reg).test(phone), errorMessage };
    },
  },
  {
    displayName: 'Date Of Birth',
    prop: 'dateOfBirth',
    type: 'date',
    validator: (dob) => {
      const errorMessage = 'Must be over 18 years old';
      const isOverEighteen = moment().subtract(18, 'years').isAfter(moment(dob));

      return { valid: isOverEighteen, errorMessage };
    },
  },
  {
    displayName: 'Tax ID Type',
    prop: 'taxIDType',
    type: 'text',
    default: 'EIN',
  },
  {
    displayName: 'Tax ID Number',
    prop: 'taxIDNumber',
    type: 'text',
    validator: (id) => {
      const errorMessage = 'Number must be XXXXXXXX Format';
      const reg = /^(\d{9})$/;
      return { valid: RegExp(reg).test(id), errorMessage };
    },
  },
  {
    displayName: 'Master LLC Name',
    prop: 'groupName',
    type: 'text',
  },
];

const defaultData = fields.reduce((acc, curr) => {
  acc[curr?.prop] = curr?.default || '';
  return acc;
}, {});

const validatedDataDefault = fields.reduce((acc, val) => {
  let isValid = false;
  if (val.default) isValid = true;
  acc[val?.prop] = isValid;
  return acc;
}, {});

const Banking = ({ deal_id }) => {
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(true); // Show form if account creation flow has not yet started
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [accountInformation, setAccountInformation] = useState({
    ...defaultData,
    contactID: deal_id,
  }); // managing field values
  const [validatedData, setValidatedData] = useState(validatedDataDefault); // Managing field validation

  /*
  After each text input change, make sure each field is validated
  If all fields are valid, setSubmitDisabled to false
  */
  useEffect(() => {
    const allFields = Object.values(validatedData);
    if (!allFields.includes(false)) setSubmitDisabled(false);
    if (allFields.includes(false)) setSubmitDisabled(true);
  }, [validatedData]);

  const [createNDBankAccount] = useMutation(CREATE_ND_BANK_ACCOUNT);

  const { data: refNumData } = useQuery(REFERENCE_NUMBERS_BY_DEAL_ID, {
    variables: { deal_id },
  });

  /*
  First, find if deal has ref numbers - meaning: account creation has started
  Set loading to false after response
  If ref numbers are found, setShowForm to false
  */
  useEffect(() => {
    if (refNumData) setLoading(false);
    if (
      refNumData &&
      refNumData.referenceNumbersByDealId &&
      refNumData.referenceNumbersByDealId.length > 0
    )
      setShowForm(false);
  }, [refNumData]);

  const createBankAccount = () => {
    setLoading(true);
    toast.success('Success! Your request has been submitted.');
    const dateOfBirth = moment(accountInformation.dateOfBirth).toISOString();
    accountInformation.phone = accountInformation.phone.replace('-', '');

    createNDBankAccount({
      variables: {
        accountInfo: { ...accountInformation, dateOfBirth },
      },
    }).then((res) => {
      if (res.success) {
        setLoading(false);
        setShowForm(false);
      }
    });
  };

  const handleChange = ({ prop, newVal, isValidState }) => {
    setAccountInformation((prev) => ({
      ...prev,
      [prop]: newVal,
    }));
    setValidatedData((prev) => {
      return {
        ...prev,
        [prop]: isValidState,
      };
    });
  };

  // Ref number loading - to determine showForm state
  if (loading)
    return (
      <>
        <Loader />
      </>
    );
  return (
    <>
      {showForm === false && (
        <Grid container spacing={4} style={{ padding: '3rem', textAlign: 'center' }}>
          <Grid item sm={12} md={12} lg={12}>
            <Typography variant="h5" style={{ paddingBottom: '2rem' }}>
              Congratulations!
            </Typography>
            <Typography variant="h5">
              Your account information has been submitted to New Direction Bank and is currently
              processing.
            </Typography>
            <Typography variant="h6" style={{ paddingTop: '3rem' }}>
              You will be notified within 24 hours on the status of the account.
            </Typography>
          </Grid>
        </Grid>
      )}

      {showForm === true && (
        <Grid container spacing={2}>
          {fields.map((f) => (
            <Input
              field={f}
              accountInformation={accountInformation}
              handleChange={handleChange}
              validator={f.validator}
            />
          ))}
          <Grid
            item
            sm={12}
            md={12}
            lg={12}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '0 3rem',
              margin: '2rem 30%',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              disabled={submitDisabled}
              onClick={createBankAccount}
              style={{ padding: '1rem' }}
            >
              Create New Directions Bank Account
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Banking;

const Input = ({ field, accountInformation, handleChange, validator }) => {
  const [errorState, setErrorState] = useState(false);
  const [errorStateMessage, setErrorStateMessage] = useState(null);

  return (
    <Grid
      item
      sm={12}
      md={6}
      lg={6}
      style={{ display: 'flex', flexDirection: 'column', padding: '0 3rem' }}
    >
      <Typography style={{ margin: '1rem 0', fontSize: '.9rem', fontWeight: 'bolder' }}>
        {field.displayName}
      </Typography>
      {errorStateMessage && <p style={{ fontSize: '.8rem', color: 'grey' }}>{errorStateMessage}</p>}
      <TextField
        style={{ width: '100%' }}
        type={field.type}
        size="sm"
        error={errorState}
        defaultValue={field.default}
        value={get(accountInformation, field.prop, field.default || '')}
        onChange={(e) => {
          const { value } = e.target;

          let isValidState = false;
          // If value is validated, or !null without a validator : isValid == true
          if (validator) {
            const { valid, errorMessage } = validator(value);
            isValidState = valid;
            if (!valid) setErrorStateMessage(errorMessage);
            if (valid) setErrorStateMessage(null);
            setErrorState(!valid);
          } else if (!value) isValidState = false;
          else isValidState = true;

          handleChange({
            prop: field.prop,
            newVal: e.target.value,
            isValidState,
          });
        }}
        variant="outlined"
      />
    </Grid>
  );
};
