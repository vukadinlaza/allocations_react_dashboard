import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';
import { get } from 'lodash';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { TextField, Button, FormControl, Grid, Paper } from '@material-ui/core';

/** *
 *
 * Create New investor (just email) & then redirects to investor edit
 *
 * */

const CREATE_INVESTOR = gql`
  mutation CreateInvestor($user: UserInput!) {
    createInvestor(user: $user) {
      _id
    }
  }
`;

export default function InvestorNew({ push, setNewUser }) {
  const history = useHistory();
  const [investor, setInvestor] = useState();
  const [createInvestor, { data }] = useMutation(CREATE_INVESTOR);

  useEffect(() => {
    if (data && data.createInvestor._id && push) history.push(`/investor/${data.createInvestor._id}/edit`);
    if (data && data.createInvestor._id) {
      setNewUser(false);
    }
  }, [data, history]);

  const submit = () => {
    createInvestor({
      variables: { user: investor },
      onCompleted: toast.success('Success! Investor created!'),
    });
  };

  const handleChange = (prop) => (e) => {
    e.persist();
    if (prop === 'investor_type') {
      return setInvestor((prev) => ({ ...prev, [prop]: e.target.value, accredited_investor_status: '' }));
    }
    return setInvestor((prev) => ({ ...prev, [prop]: e.target.value }));
  };

  return (
    <>
      <Paper style={{ marginBottom: '2rem' }}>
        <form noValidate autoComplete="off" style={{ padding: '16px' }}>
          <Grid container spacing={3} style={{ marginTop: '16px' }}>
            <Grid item xs={12} sm={12} md={6}>
              <FormControl variant="outlined" style={{ width: '100%' }}>
                <TextField
                  style={{ width: '100%' }}
                  value={get(investor, 'email') || ''}
                  onChange={handleChange('email')}
                  label="Email"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                required
                style={{ width: '100%' }}
                value={get(investor, 'first_name') || ''}
                onChange={handleChange('first_name')}
                label="First Name"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <TextField
                required
                style={{ width: '100%' }}
                value={get(investor, 'last_name') || ''}
                onChange={handleChange('last_name')}
                label="Last Name"
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Button variant="contained" style={{ marginTop: 16 }} onClick={submit} color="primary">
            Create Investor
          </Button>
        </form>
      </Paper>
    </>
  );
}
