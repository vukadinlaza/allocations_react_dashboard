import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from "../react-auth0-spa";
import { useLazyQuery } from '@apollo/react-hooks';

/***
 *
 * useAuth is a hook that is passed a gql QUERY and handles the auth flow
 * automatically around when to send the request (once isAuthenticated)
 * additionally inits slaask (the chatbox)
 *
 **/

export function useAuth (QUERY) {
  const params = useParams()
  const adminView = params && params.id
  const { user, isAuthenticated, loading } = useAuth0()
  const [getInvestor, { data, error, called, refetch }] = useLazyQuery(QUERY)

  useEffect(() => {
    if (!loading && isAuthenticated && !called) {
      adminView ? getInvestor({ variables: { _id: params.id }}) : getInvestor()
    }
  }, [isAuthenticated, loading, called])

  useEffect(() => {
    if (data && window._slaask) window._slaask.updateContact({name: data.investor.name})
  }, [data])

  useEffect(() => {
    if (error && user) refetch()
  }, [error, user])

  return {
    data,
    error,
    refetch,
    user,
    params,
    adminView,
    isAdmin: data ? data.investor.admin : false,
  }
}
