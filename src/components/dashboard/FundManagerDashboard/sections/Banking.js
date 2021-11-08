import React, { useState } from 'react';
import { Button, Typography, TextField, Grid } from '@material-ui/core';
import { useQuery, gql, useMutation } from '@apollo/client';
import HelpIcon from '@material-ui/icons/Help';
import { get } from 'lodash';
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
    default: '8 The Green Suite',
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
  },
  {
    displayName: 'Tax ID Number',
    prop: 'taxIDNumber',
    type: 'number',
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
  });

  const { data, loading } = useQuery(REFERENCE_NUMBERS_BY_DEAL_ID, {
    variables: { deal_id },
  });
  const [createNDBankAccount, {}] = useMutation(CREATE_ND_BANK_ACCOUNT);
  const createBankAccount = () => {
    console.log(accountInformation);
    return createNDBankAccount({
      variables: {
        accountInfo: accountInformation,
      },
    });
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
      {loading && (
        <div>
          <Loader />
        </div>
      )}
      <>
        <Grid container spacing={2}>
          {fields.map((f) => (
            <Input field={f} accountInformation={accountInformation} handleChange={handleChange} />
          ))}
        </Grid>
      </>

      <Button
        variant="contained"
        className={classes.createButton}
        color="secondary"
        style={{ marginLeft: '1rem', backgroundColor: 'blue' }}
        onClick={createBankAccount}
      >
        Save
      </Button>
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
        type="text"
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
