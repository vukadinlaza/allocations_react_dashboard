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
  const { loading, user, isAuthenticated, loginWithRedirect, logout, auth0Client } = useAuth0();

  const [getInvestor, { data, error, called, refetch }] = useLazyQuery(QUERY);
  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    if (!loading && isAuthenticated && !called) {
      adminView ? getInvestor({ variables: { _id: params.id } }) : getInvestor();
    }
  }, [isAuthenticated, loading, called, adminView, getInvestor, params.id]);

  useEffect(() => {
    if (data) {
      // if (window._slaask && NODE_ENV === 'production') {
      //   window._slaask.updateContact({
      //     name: `${data.investor.first_name} ${data.investor.last_name}`,
      //     email: user.email,
      //   });
      // }

      const { __typename, ...rest } = data.investor;
      setUserProfile({ ...user, ...rest });

      const userData = { ...rest } || null; // Replace your_user_id with your own if available.
      window.Intercom('boot', {
        app_id: 't8cjlj0f',
        email: userData?.email,
        user_id: userData?._id,
        created_at: new Date(),
      });
      window.hj('identify', userData?._id, {
        email: userData?.email,
        testAttr: 'this is a test',
      });
    }
  }, [data, user]);

  useEffect(() => {
    if (error && user) refetch();
  }, [error, refetch, user]);

  if (loading) return null;

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
  };
}
