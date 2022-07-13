import { gql } from '@apollo/client';

export const search = gql`
  query SearchUsers($fields: [String]!, $searchTerm: String) {
    searchUsers(fields: $fields, searchTerm: $searchTerm) {
      _id
      name
      email
    }
  }
`;
