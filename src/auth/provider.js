import React, { useEffect, useState, createContext, useContext } from 'react'
import { gql } from 'apollo-boost'
import { useLazyQuery } from '@apollo/react-hooks';
import { useAuth0 } from "../react-auth0-spa";

const GET_USER = gql`
  query GetUser($email: String) {
    investor(email: $email) {
      _id
      first_name
      last_name
      email
    }
  }
`
export const AuthContext = createContext({ isAuthenticated: null, user: null })

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const { loading, user: auth0user, isAuthenticated } = useAuth0()
  const [getUser, {data, error}] = useLazyQuery(GET_USER) 

  useEffect(() => {
    if (auth0user && isAuthenticated) {
      getUser({ variables: { email: auth0user.email }})
    }
  }, [auth0user, isAuthenticated])

  useEffect(() => {
    if (data) setUser(data.investor)
  }, [data])

  return (
    <AuthContext.Provider value={{ isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 