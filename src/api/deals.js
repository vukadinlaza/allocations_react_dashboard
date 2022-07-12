import { gql } from '@apollo/client';

export const search = gql`
  query DealsByField($field: String!, $searchTerm: String) {
    dealsByField(field: $field, searchTerm: $searchTerm) {
      _id
      company_name
      company_description
    }
  }
`;
