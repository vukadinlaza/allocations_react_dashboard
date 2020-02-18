import { gql } from 'apollo-boost'

export const search = gql`
  query SearchUsers($org: String!, $q: String!) {
    searchUsers(org: $org, q: $q) {
      _id
      name
      email
    }
  }
`