import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_ACCOUNT_ENTITIES = gql`
  query data($accountId: String) {
    getEntities(accountId: $accountId) {
      _id
      first_name
      last_name
      name
      email
      entity_name
      investor_type
      signer_full_name
      country
      isPrimaryEntity
    }
  }
`;

const ProfileEntities = () => {
  return (
    <div>
      <h1>Entities working!</h1>
    </div>
  );
};

export default ProfileEntities;
