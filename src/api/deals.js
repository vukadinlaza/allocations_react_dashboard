import { gql } from 'apollo-boost'

export const search = gql`
  query SearchDeals($q: String!) {
    searchDeals(q: $q) {
      _id
      company_name
      company_description
    }
  }
`