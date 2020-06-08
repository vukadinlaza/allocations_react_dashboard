import React from "react";
import _ from 'lodash'
import { Route, Redirect } from "react-router-dom"
import { useAuth0 } from "../react-auth0-spa";
import Loader from '../components/utils/Loader'

/***
 *
 * Admin route is for superadmins ONLY, this is enforced by a whitelist
 * the whitelist protects routes from showing, but even if circumvented by changing the list
 * the backend protects the information
 *
 **/

export const adminWhitelist = [
  "kadvani1@gmail.com",
  "michelle@allocations.com",
  "tim@allocations.com",
  "joel@allocations.com",
  "thomas@allocations.com",
  "olia@allocations.com",
  "peeroke@gmail.com",
]

export default function AdminRoute ({ component, ...rest }) {
  const { isAuthenticated, user } = useAuth0();

  if (isAuthenticated === null || !user) return <Loader />

  if (isAuthenticated === true && adminWhitelist.includes(user.email)) {
    return <Route {...rest} component={component} />
  } else {
    return <Redirect to="/" />
  }
}

export const isAdmin = (user) => adminWhitelist.includes(_.get(user, 'email'))