import React, { useEffect } from 'react'
import { Redirect } from "react-router-dom"
import { useAuth0 } from "../react-auth0-spa"

export default function SignUp () {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0()

  useEffect(() => {
    const fn = async () => {
      if (!isAuthenticated) {
        await loginWithRedirect({
          appState: { targetUrl: "/" },
          initialScreen: 'signUp',
        });
      }
    };
    fn();
  }, [isAuthenticated, loginWithRedirect]);

  return null
}