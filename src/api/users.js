import { gql } from '@apollo/client';

export const search = gql`
  query Users($org_id: String!, $query: String!) {
    users(org_id: $org_id, query: $query) {
      _id
      name
      email
    }
  }
`;
