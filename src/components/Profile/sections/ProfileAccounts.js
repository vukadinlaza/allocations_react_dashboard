import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_ACCOUNT_USERS = gql`
  query data {
    accountUsers {
      _id
      first_name
      last_name
      name
      email
    }
    rootAdmin
    accountId
  }
`;

const REMOVE_ACCT_USER = gql`
  mutation RemoveAcctUser($accountId: String, $userId: String!) {
    removeAcctUser(accountId: $accountId, userId: $userId)
  }
`;

const ProfileAccounts = () => {
  return (
    <div>
      <h1>Personal accounts working!</h1>
    </div>
  );
};

export default ProfileAccounts;
