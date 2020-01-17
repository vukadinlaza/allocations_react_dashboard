import { gql } from 'apollo-boost'

export const search = gql`
  query SearchUsers($q: String!) {
    searchUsers(q: $q) {
      _id
      name
      email
    }
  }
`