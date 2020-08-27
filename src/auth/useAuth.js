import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from "../react-auth0-spa";
import { useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost'

const { NODE_ENV } = process.env

const GET_INVESTOR = gql`
  {
    investor {
      _id
      email
      first_name
      last_name
      admin
      organizations_admin {
        _id
        slug
        name
        logo
      }
    }
  }
`

/***
 *
 * useAuth is a hook that is passed a gql QUERY and handles the auth flow
 * automatically around when to send the request (once isAuthenticated)
 * additionally inits slaask (the chatbox)
 *
 **/

export function useAuth(QUERY = GET_INVESTOR) {
  const params = useParams()
  const adminView = params && params.id
  const {
    loading,
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
    auth0Client,
  } = useAuth0();
  const [getInvestor, { data, error, called, refetch }] = useLazyQuery(QUERY)
  const [userProfile, setUserProfile] = useState({})

  useEffect(() => {
    if (!loading && isAuthenticated && !called) {
      adminView ? getInvestor({ variables: { _id: params.id } }) : getInvestor()
    }
  }, [isAuthenticated, loading, called])

  useEffect(() => {
    if (data) {
      if (window._slaask && NODE_ENV === 'production') {
        window._slaask.updateContact({
          name: data.investor.first_name + ' ' + data.investor.last_name,
          email: user.email,
        })
      }

      const { __typename, ...rest } = data.investor
      setUserProfile({ ...user, ...rest, })
      console.log('window', window)
      window.hj('indentity', userProfile?._id, {
        email: 'test@tester.com'
      })

    }
  }, [data])

  useEffect(() => {
    if (error && user) refetch()
  }, [error, user])

  return {
    userProfile,
    error,
    refetch,
    params,
    adminView,
    loading,
    isAuthenticated,
    logout,
    loginWithRedirect,
    auth0Client,
  }
}
