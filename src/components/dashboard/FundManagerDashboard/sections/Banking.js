import React, { useState } from 'react';
import { Button, Typography, TextField, Grid } from '@material-ui/core';
import { useQuery, gql, useMutation } from '@apollo/client';
import HelpIcon from '@material-ui/icons/Help';
import { get } from 'lodash';
import { toast } from 'react-toastify';
import Loader from '../../../utils/Loader';
import { ModalTooltip } from '../widgets';

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
  },
  {
    displayName: 'Phone',
    prop: 'phone',
    type: 'text',
  },
  {
    displayName: 'Date Of Birth',
    prop: 'dateOfBirth',
    type: 'date',
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

const Banking = ({
  classes,
  deal_id,
  company_name,
  deal_NDvirtualAccountNum,
  handleTooltip,
  openTooltip,
  orgSlug,
}) => {
  const defaultData = fields.reduce((acc, curr) => {
    acc[curr?.prop] = curr?.default || '';
    return acc;
  }, {});
  const [accountInformation, setAccountInformation] = useState({
    ...defaultData,
    contactID: deal_id,
    contactName: company_name,
  });
  const [showForm, setShowForm] = useState(true);

  const { data, loading } = useQuery(REFERENCE_NUMBERS_BY_DEAL_ID, {
    variables: { deal_id },
  });
  const [createNDBankAccount, {}] = useMutation(CREATE_ND_BANK_ACCOUNT);
  const createBankAccount = () => {
    setShowForm(false);
    toast.success('Success! Your request has been submitted.');

    // return createNDBankAccount({
    //   variables: {
    //     accountInfo: accountInformation,
    //   },
    // });
  };
  const handleChange = ({ prop, newVal }) => {
    setAccountInformation((prev) => ({
      ...prev,
      [prop]: newVal,
    }));
  };

  let referenceNumberRange = null;
  if (data && data.referenceNumbersByDealId && data.referenceNumbersByDealId.length > 0) {
    const refNums = [...data.referenceNumbersByDealId].sort(
      (a, b) => Number(a.number) - Number(b.number),
    );
    const low = refNums[0].number;
    const high = refNums[refNums.length - 1].number;
    referenceNumberRange = `${low}-${high}`;
  }

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
            <Input field={f} accountInformation={accountInformation} handleChange={handleChange} />
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

const Input = ({ field, accountInformation, handleChange }) => {
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
      <TextField
        style={{ width: '100%' }}
        type={field.type}
        size="sm"
        defaultValue={field.default}
        value={get(accountInformation, field.prop, field.default || '')}
        onChange={(e) =>
          // eslint-disable-next-line radix
          handleChange({
            prop: field.prop,
            newVal: e.target.value,
          })
        }
        variant="outlined"
      />
    </Grid>
  );
};
