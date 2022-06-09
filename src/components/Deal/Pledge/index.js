import React, { useState } from 'react';
import { Grid, TextField, InputAdornment, Button } from '@material-ui/core';
import { toast } from 'react-toastify';
import { useMutation, gql } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  button: {
    marginLeft: theme.spacing(1),
    backgroundColor: theme.colors.success[500],
    paddingX: theme.spacing(1),
    color: theme.colors.white[100],
  },
  adornment: {
    backgroundColor: theme.colors.success[50],
    color: `${theme.colors.gray[500]}80`,
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

export default ({ investment, refetch, allowEdit }) => {
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
      onCompleted: toast.success('Success! Investment amount has been updated'),
    });
  };

  return (
    <Grid item xs={12} sm={4}>
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
      <Button
        variant="contained"
        className={classes.button}
        size="medium"
        onClick={submit}
        disabled={!allowEdit}
      >
        Invest
      </Button>
    </Grid>
  );
};
