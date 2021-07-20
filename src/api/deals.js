import { gql } from '@apollo/client';

export const search = gql`
  query SearchDeals($q: String!) {
    searchDeals(q: $q) {
      _id
      company_name
      company_description
    }
  }
`;

export const searchByOrg = gql`
  query SearchDealsByOrg($q: String!, $org: String!) {
    searchDealsByOrg(q: $q, org: $org) {
      _id
      company_name
      company_description
    }
  }
`;
