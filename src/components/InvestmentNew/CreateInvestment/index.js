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
  mutation NewCreateInvestment($investment: Object!) {
    newCreateInvestment(investment: $investment)
  }
`;

function validate({ investment, user, deal }) {
  const errors = [];
  if (!investment.total_committed_amount) errors.push('total_committed_amount');
  if (!user) errors.push('user');
  if (!deal) errors.push('deal');
  if (!investment.phase) errors.push('phase');
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
          total_committed_amount: Math.floor(investment.total_committed_amount),
          wired_amount: investment.wired_amount,
          user_id: user._id,
          deal_id: deal._id,
          phase: investment.phase,
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
              <UserSearch
                user={user}
                setUser={setUser}
                deal_id={get(deal, '_id', '')}
                errors={errors}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <FormControl required disabled variant="outlined" style={{ width: '100%' }}>
              <TextField
                style={{ width: '100%' }}
                value={`${get(deal, 'name', '')} ${get(deal, 'description', '')}`}
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
                error={errors.includes('total_committed_amount')}
                value={get(investment, 'total_committed_amount', '') || undefined}
                placeholder="0"
                onChange={(e) =>
                  // eslint-disable-next-line radix
                  updateInvestmentProp({
                    prop: 'total_committed_amount',
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
                value={get(investment, 'wired_amount', '') || undefined}
                onChange={(e) =>
                  // eslint-disable-next-line radix
                  updateInvestmentProp({
                    prop: 'wired_amount',
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
                error={errors.includes('phase')}
                value={investment?.phase || ''}
                onChange={(e) => updateInvestmentProp({ prop: 'phase', newVal: e.target.value })}
                inputProps={{ name: 'phase' }}
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
