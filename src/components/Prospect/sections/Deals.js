import React, { useEffect } from 'react';
import { gql } from '@apollo/client';
import { useAuth } from '../../../auth/useAuth';

const GET_INVESTOR = gql`
  query GetInvestor($email: String, $_id: String) {
    investor(email: $email, _id: $_id) {
      _id
      name
      first_name
      last_name
      email
      admin
    }
  }
`;

const Deals = () => {
  const { userProfile, loading, refetch } = useAuth(GET_INVESTOR);
  console.log('user==>', userProfile);

  return (
    <div>
      <h1>My deals</h1>
    </div>
  );
};

export default Deals;
