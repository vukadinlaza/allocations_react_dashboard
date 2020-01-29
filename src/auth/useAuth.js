import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from "../react-auth0-spa";
import { useLazyQuery } from '@apollo/react-hooks';

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
    if (data) window._slaask.updateContact({name: data.investor.name})
  }, [data])

  useEffect(() => {
    if (error && user) refetch()
  }, [error, user])

  return { data, error, refetch, user, params, adminView }
}