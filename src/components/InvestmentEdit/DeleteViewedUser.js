import React from 'react';
import { Typography, Grid, Button } from '@material-ui/core';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { toast } from 'react-toastify';

const DELETE_VIEWED_USER = gql`
  mutation deleteUserAsViewed($user_id: String!, $deal_id: String!) {
    deleteUserAsViewed(user_id: $user_id, deal_id: $deal_id) {
      _id
    }
  }
`;

const DeleteViewedUser = ({ dealId, investorId, handleUpdate = false }) => {
  const [deleteViewedUser] = useMutation(DELETE_VIEWED_USER, {
    onCompleted: () => {
      if (handleUpdate) {
        handleUpdate();
      }
      toast.success('Investment Removed');
    },
  });
  return (
    <Grid container style={{ padding: '2rem', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h6">Remove Investment</Typography>
      <Button
        variant="contained"
        style={{ backgroundColor: 'red', maxWidth: '30%', marginTop: '1rem' }}
        onClick={() => {
          deleteViewedUser({
            variables: {
              deal_id: dealId,
              user_id: investorId,
            },
          });
        }}
      >
        Delete
      </Button>
    </Grid>
  );
};

export default DeleteViewedUser;
