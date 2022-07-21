import { gql } from '@apollo/client';

export const search = gql`
  query SearchDeals($fields: [String]!, $searchTerm: String) {
    searchDeals(fields: $fields, searchTerm: $searchTerm) {
      _id
      company_name
      company_description
    }
  }
`;
