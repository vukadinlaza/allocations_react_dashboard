import React, { useState, useEffect } from 'react';
import { Grid, TextField, InputAdornment, Button } from '@material-ui/core';
import _ from 'lodash';
import { gql } from 'apollo-boost';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/react-hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  button: {
    marginLeft: theme.spacing(1),
    backgroundColor: 'rgba(87, 204, 100, 1)',
    paddingX: theme.spacing(1),
    color: '#FFFFFF',
  },
  adornment: {
    backgroundColor: '#E3F8DF',
    color: '#6F6F6F80',
    padding: theme.spacing(1.3),
  },
}));

const PLEDGE = gql`
  mutation Pledge($investment: InvestmentInput!) {
    updateInvestment(investment: $investment) {
      _id
      amount
      status
    }
  }
`;

export default ({ investment, refetch }) => {
  const classes = useStyles();
  const [invAmount, setInvAmount] = useState(investment?.amount || 0);
  const [updateInvestment] = useMutation(PLEDGE, {
    onCompleted: refetch,
  });
  const submit = () => {
    updateInvestment({
      variables: {
        investment: { _id: investment._id, amount: Number(invAmount) },
      },
      onCompleted: toast.success('Success! Investment Amount Updated!'),
    });
  };

  return (
    <Grid item xs={12} sm={6} md={6} lg={6}>
      <TextField
        style={{ width: '60%' }}
        size="small"
        type="number"
        defaultValue={invAmount}
        onChange={(e) => setInvAmount(e.target.value)}
        label="My Investment"
        InputProps={{
          startAdornment: (
            <InputAdornment className={classes.adornment} position="start">
              <FontAwesomeIcon icon="dollar-sign" />
            </InputAdornment>
          ),
        }}
        variant="outlined"
      />
      <Button variant="contained" className={classes.button} size="small" onClick={submit} color="secondary">
        Invest
      </Button>
      <Button variant="contained" className={classes.button} size="small" color="primary">
        Pass
      </Button>
    </Grid>
  );
};
