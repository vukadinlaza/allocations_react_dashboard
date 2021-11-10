import React, { useEffect, useState } from 'react';
import { Button, Typography, TextField, Grid } from '@material-ui/core';
import { useQuery, gql, useMutation } from '@apollo/client';
import HelpIcon from '@material-ui/icons/Help';
import { get } from 'lodash';
import { toast } from 'react-toastify';
import moment from 'moment';

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
    createNDBankAccount(accountInfo: $accountInfo)
  }
`;

const fields = [
  {
    displayName: 'SPV Name',
    prop: 'contactName',
    type: 'text',
  },
  {
    displayName: 'Executor Legal Name',
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
    displayName: 'Phone',
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

const Banking = ({ deal_id, company_name }) => {
  const [loading, setLoading] = useState(false);
  const [accountInformation, setAccountInformation] = useState({
    ...defaultData,
    contactID: deal_id,
    contactName: company_name,
  });
  const [showForm, setShowForm] = useState(true);
  const [validatedData, setValidatedData] = useState({
    ...validatedDataDefault,
    contactName: company_name,
  });
  const [submitDisabled, setSubmitDisabled] = useState(true);

  useEffect(() => {
    const allFields = Object.values(validatedData);
    if (!allFields.includes(false)) setSubmitDisabled(false);
  }, [validatedData]);

  const { data: refNumData } = useQuery(REFERENCE_NUMBERS_BY_DEAL_ID, {
    variables: { deal_id },
  });
  const [createNDBankAccount, { data: newAccountData }] = useMutation(CREATE_ND_BANK_ACCOUNT);

  const createBankAccount = () => {
    setLoading(true);
    // toast.success('Success! Your request has been submitted.');
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

  // let referenceNumberRange = null;
  // if (
  //   refNumData &&
  //   refNumData.referenceNumbersByDealId &&
  //   refNumData.referenceNumbersByDealId.length > 0
  // ) {
  //   const refNums = [...refNumData.referenceNumbersByDealId].sort(
  //     (a, b) => Number(a.number) - Number(b.number),
  //   );
  //   const low = refNums[0].number;
  //   const high = refNums[refNums.length - 1].number;
  //   referenceNumberRange = `${low}-${high}`;
  //   setShowForm(false);
  // }

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
          let isValidState = false;
          if (validator) {
            const { valid, errorMessage } = validator(e.target.value);
            isValidState = valid;
            if (!valid) setErrorStateMessage(errorMessage);
            if (valid) setErrorStateMessage(null);
            setErrorState(!valid);
          } else isValidState = true;

          // eslint-disable-next-line radix
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
