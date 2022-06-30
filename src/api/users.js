import { gql } from '@apollo/client';

export const search = gql`
  query UsersByField($field: String!, $searchTerm: String) {
    usersByField(field: $field, searchTerm: $searchTerm) {
      _id
      name
      email
    }
  }
`;
