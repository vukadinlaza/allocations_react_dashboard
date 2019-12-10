import React from "react";
import { Route, Redirect } from "react-router-dom"
import { useAuth0 } from "../react-auth0-spa";

export const adminWhitelist = ["will.sheehan@toptal.com", "kadvani1@gmail.com", "michelle@allocations.co"]

export default function AdminRoute ({ children, ...rest }) {
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();

  return (
    <Route {...rest}
      render={({ location }) => 
        isAuthenticated && user && adminWhitelist.includes(user.email) 
          ? (children)
          : <Redirect to="/" />
      }
    />
  )
}