import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { useQuery, gql } from '@apollo/client';
import Loader from '../../../../utils/Loader';

const GET_WALLET_BALANCE = gql`
  query getWalletBalance($deal_id: String!) {
    walletBalance(deal_id: $deal_id) {
      acknowledged
      balances {
        amount
        currency
      }
    }
  }
`;

const Crypto = ({ deal_id }) => {
  const { data, loading } = useQuery(GET_WALLET_BALANCE, {
    variables: { deal_id },
  });

  return (
    <Grid container spacing={4} style={{ padding: '3rem', textAlign: 'center' }}>
      <Typography variant="h5" style={{ paddingBottom: '2rem' }}>
        Crypto Wallet Balance
      </Typography>
      <Grid item sm={12} md={12} lg={12}>
        {loading ? (
          <Loader />
        ) : (
          <Typography variant="h5" style={{ paddingBottom: '2rem' }}>
            {data ? `$${data?.walletBalance?.balances[0].amount}` : 'No Wallet Found'}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Crypto;
