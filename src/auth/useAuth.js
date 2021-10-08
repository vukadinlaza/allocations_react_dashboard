/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useLazyQuery, gql } from '@apollo/client';
// const { NODE_ENV } = process.env;

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
`;

/** *
 *
 * useAuth is a hook that is passed a gql QUERY and handles the auth flow
 * automatically around when to send the request (once isAuthenticated)
 * additionally inits slaask (the chatbox)
 *
 * */

export function useAuth(QUERY = GET_INVESTOR) {
  const params = useParams();
  const adminView = params && params.id;
  const { isLoading, user, isAuthenticated, loginWithRedirect, logout, auth0Client } = useAuth0();

  const [getInvestor, { data, error, called, refetch, loading }] = useLazyQuery(QUERY);
  const userProfile = { ...(data?.investor || {}), ...(user || {}) };

  useEffect(() => {
    if (!isLoading && isAuthenticated && !called) {
      adminView ? getInvestor({ variables: { _id: params.id } }) : getInvestor();
    }
  }, [isAuthenticated, isLoading, called, adminView, getInvestor, params.id]);

  useEffect(() => {
    if (data) {
      // if (window._slaask && NODE_ENV === 'production') {
      //   window._slaask.updateContact({
      //     name: `${data.investor.first_name} ${data.investor.last_name}`,
      //     email: user.email,
      //   });
      // }

      window.Intercom('boot', {
        app_id: 't8cjlj0f',
        email: data.email,
        user_id: data._id,
        created_at: new Date(),
      });
      window.hj('identify', data._id, {
        email: data.email,
        testAttr: 'this is a test',
      });
    }
  }, [data]);

  useEffect(() => {
    if (error && user) refetch();
  }, [error, refetch, user]);

  return {
    userProfile,
    error,
    refetch,
    params,
    adminView,
    loading: isLoading || loading || !called,
    isAuthenticated,
    logout,
    loginWithRedirect,
    auth0Client,
  };
}
