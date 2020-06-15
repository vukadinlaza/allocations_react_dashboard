import React from "react";
import _ from 'lodash'
import { Route, Redirect } from "react-router-dom"
import { useAuth0 } from "../react-auth0-spa";
import { useLazyQuery } from '@apollo/react-hooks';
import { useEffect } from 'react';
import {gql} from 'apollo-boost'
import Loader from '../components/utils/Loader'

/***
 *
 * Admin route is for superadmins ONLY, this is enforced by a whitelist
 * the whitelist protects routes from showing, but even if circumvented by changing the list
 * the backend protects the information
 *
 **/

const GET_INVESTOR = gql`
  {
    investor {
      _id
      name
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

export default function AdminRoute ({ component, ...rest }) {
  const { isAuthenticated, user, loading } = useAuth0();
  const [getInvestor, { data, error, called }] = useLazyQuery(GET_INVESTOR)

  useEffect(() => {
    if (!loading && isAuthenticated && !called) {
      getInvestor()
    }
  }, [isAuthenticated, loading, called])

  if (isAuthenticated === null || !data) return <Loader />

  if (isAuthenticated === true && data.investor.admin) {
    return <Route {...rest} component={component} />
  } else {
    return <Redirect to="/" />
  }
}
