import React, { useState, useEffect, useContext } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";
import { useHistory } from "react-router-dom"
import jwt from "jsonwebtoken"
import { useSimpleReducer } from "./utils/hooks"

/***
 *
 * Setup for Auth0 integration
 * the reason this is so complicated is that
 *  1) the default @auth0/auth0-spa-js requires a lot of setup
 *  2) the library doesn't enable caching so I had to manually
 *      modify to store saved auth0-tokens in localStorage, 
 *      auth0 claims this is insecure but they're wrong
 *
 * the general flow here is check if the token exists 
 * - if it does and is valid, isAuthenticated = true
 * - otherwise wait for auth0 to init and once inited save the token
 * listeners therefore want to wait for isAuthenticated before hitting the backend
 *
 **/

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const client_id = process.env.REACT_APP_AUTH0_KEY;
const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

const defaultOptions = {
  domain,
  client_id,
  audience,
  redirect_uri: window.location.origin,
}

const getAuth0Client = (options) => {
  return new Promise(async (resolve, reject) => {
    let client
    if (!client) {
      try {
        client = await createAuth0Client({ ...defaultOptions, ...options })
        resolve(client)
      } catch (e) {
        console.log(e);
        reject(new Error('getAuth0Client Error', e))
      }
    }
  })
}

const isAuthed = () => {
  const token = localStorage.getItem("auth0-token")
  if (token) {
    const { exp } = jwt.decode(token)
    return Date.now() < (exp * 1000) ? true : null
  }
  return null
}

export const Auth0Provider = ({ children }) => {
  const history = useHistory()
  const [{ user, isAuthenticated, loading, auth0Client, clientPromise }, setState] = useSimpleReducer(
    { user: null, isAuthenticated: null, loading: true, auth0Client: null, clientPromise: null }
  )

  const getTokenSilently = async (client = auth0Client) => {
    if (!isAuthed()) {
      // const client = await clientPromise()
      const token = await client.getTokenSilently()
      localStorage.setItem("auth0-token", token)
      return token
    }
    return localStorage.getItem("auth0-token")
  }

  const options = {
    onRedirectCallback: async ({ appState, client }) => {
      const u = await client.getUser()
      await getTokenSilently(client)
      setState({ isAuthenticated: true, loading: false, user: u })
      history.push(
        (appState && appState.targetUrl) ? appState.targetUrl : window.location.pathname
      )
    }
  }

  useEffect(() => {
    // init auth client
    const p = getAuth0Client(options)
    setState({ 
      isAuthenticated: isAuthed(),
      clientPromise: p,
    }) 

    p.then(client => {
      setState({ auth0Client: client })

      // this means we've been redirected back from login
      if (window.location.search.includes("code=")) {
        client.handleRedirectCallback()
          .then(({ appState }) => options.onRedirectCallback({ appState, client }))
          .catch(err => console.error("Error Logging in"))
      } else {
        // this is the standard case
        client.isAuthenticated()
          .then(async val => {
            if (val) {
              const token = await client.getTokenSilently()
              localStorage.setItem("auth0-token", token)
              client.getUser().then(u => {
                setState({ user: u, loading: false })
              })
            }
            setState({ isAuthenticated: val })
          })
      }  
    }).catch(console.error)
  }, [])

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        auth0Client,
        getTokenSilently,
        loginWithRedirect: async (...p) => {
          if (!auth0Client) {
            const auth0Client = await clientPromise()
            return auth0Client.loginWithRedirect(...p)
          } else {
            return auth0Client.loginWithRedirect(...p)
          }
        },
        logout: (...p) => {
          localStorage.removeItem("auth0-token")
          auth0Client.logout(...p)
        }
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
