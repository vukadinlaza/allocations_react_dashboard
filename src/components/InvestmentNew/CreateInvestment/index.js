import React, { useState } from 'react';
import { get } from 'lodash';
import { toast } from 'react-toastify';
import { gql, useMutation } from '@apollo/client';
import {
  Button,
  TextField,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  InputAdornment,
} from '@material-ui/core';
import { colors } from '@allocations/design-system';
import styles from '../styles';
import { UserSearch } from '..';

const CREATE_INVESTMENT = gql`
  mutation CreateInvestment($investment: InvestmentInput!) {
    createInvestment(investment: $investment) {
      _id
    }
  }
`;

function validate({ investment, user, deal }) {
  const errors = [];
  if (!investment.amount) errors.push('amount');
  if (!user) errors.push('user');
  if (!deal) errors.push('deal');
  if (!investment.status) errors.push('status');
  return errors;
}

export default function CreateInvestment({ deal, handleUpdate }) {
  const classes = styles();
  const [investment, setInvestment] = useState({});
  const [errors, setErrors] = useState([]);
  const [user, setUser] = useState();
  const [createInvestment] = useMutation(CREATE_INVESTMENT, {
    onCompleted: () => {
      toast.success('Success!');
      handleUpdate.setShowCreateInvModal();
      handleUpdate.refetch();
    },
  });

  const updateInvestmentProp = ({ prop, newVal }) => {
    setInvestment((prev) => ({ ...prev, [prop]: newVal }));
  };

  const convertToPositiveInteger = (num) => {
    return parseInt(num < 0 ? 0 : num, 10);
  };
  const handleCreateInvestment = () => {
    const e = validate({ investment, deal, user });
    if (e.length > 0) {
      toast.error('Error. Please supply the required fields.');
      return setErrors(e);
    }
    createInvestment({
      variables: {
        investment: {
          amount: Math.floor(investment.amount),
          capitalWiredAmount: investment.capitalWiredAmount,
          user_id: user._id,
          deal_id: deal._id,
          status: investment.status,
        },
      },
    });
  };

  return (
    <div>
      <div className={classes.title}>Create Investment</div>
      <form noValidate autoComplete="off">
        <Grid container spacing={3} direction="row" justifyContent="flex-end">
          <Grid item xs={12} sm={12} md={6}>
            <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
              <UserSearch user={user} setUser={setUser} errors={errors} />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
              <TextField
                style={{ width: '100%' }}
                value={`${get(deal, 'company_name', '')} ${get(deal, 'company_description', '')}`}
                disabled
                label="Deal"
                variant="outlined"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
              <TextField
                style={{ width: '100%' }}
                type="number"
                InputProps={{
                  inputProps: { min: 0 },
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                error={errors.includes('amount')}
                value={get(investment, 'amount', '') || undefined}
                placeholder="0"
                onChange={(e) =>
                  // eslint-disable-next-line radix
                  updateInvestmentProp({
                    prop: 'amount',
                    newVal: convertToPositiveInteger(e.target.value),
                  })
                }
                label="Amount Committed"
                variant="outlined"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
              <TextField
                style={{ width: '100%' }}
                type="number"
                InputProps={{
                  inputProps: { min: 0 },
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                placeholder="0"
                value={get(investment, 'capitalWiredAmount', '') || undefined}
                onChange={(e) =>
                  // eslint-disable-next-line radix
                  updateInvestmentProp({
                    prop: 'capitalWiredAmount',
                    newVal: convertToPositiveInteger(e.target.value),
                  })
                }
                label="Amount Received"
                variant="outlined"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <FormControl variant="outlined" style={{ width: '100%' }} size="small">
              <InputLabel>Status</InputLabel>
              <Select
                error={errors.includes('status')}
                value={investment?.status || ''}
                onChange={(e) => updateInvestmentProp({ prop: 'status', newVal: e.target.value })}
                inputProps={{ name: 'status' }}
              >
                <MenuItem value="invited">Invited</MenuItem>
                <MenuItem value="signed">Signed</MenuItem>
                <MenuItem value="wired">Wired</MenuItem>
                <MenuItem value="complete">Complete</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <Button
              variant="contained"
              style={{ backgroundColor: colors.black[50] }}
              onClick={handleCreateInvestment}
              color="primary"
            >
              CREATE INVESTMENT
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
