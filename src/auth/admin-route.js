import React from "react";
import { Route, Redirect, useHistory } from "react-router-dom"
import { useAuth0 } from "../react-auth0-spa";
import Loader from '../components/utils/Loader'

export const adminWhitelist = ["will.sheehan@toptal.com", "kadvani1@gmail.com", "michelle@allocations.co", "hanspaulpizzinini@gmail.com"]

export default function AdminRoute ({ children, ...rest }) {
  const history = useHistory()
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();

  if (isAuthenticated === null || !user) return <Loader />

  if (isAuthenticated === true && adminWhitelist.includes(user.email)) {
    return <Route {...rest}>{children}</Route>
  } else {
    return <Redirect to="/" />
  }
}