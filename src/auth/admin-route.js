import React from "react";
import { Route, Redirect } from "react-router-dom"
import { useAuth0 } from "../react-auth0-spa";
import Loader from '../components/utils/Loader'

export const adminWhitelist = ["will@allocations.com", "kadvani1@gmail.com", "michelle@allocations.co", "tim@allocations.com"]

export default function AdminRoute ({ component, ...rest }) {
  const { isAuthenticated, user } = useAuth0();

  if (isAuthenticated === null || !user) return <Loader />

  if (isAuthenticated === true && adminWhitelist.includes(user.email)) {
    return <Route {...rest} component={component} />
  } else {
    return <Redirect to="/" />
  }
}