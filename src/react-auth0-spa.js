import React, { useState, useEffect, useContext } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";
import history from "./utils/history";

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);
let _initOptions, _client

const domain="login.allocations.co";
const client_id="R2iJsfjNPGNjIdPmRoE3IcKd9UvVrsp1";
const audience="https://api.graphql.com"

const defaultOptions = {
  domain,
  client_id,
  audience,
  redirect_uri: window.location.origin
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

export const Auth0Provider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [clientPromise, setClientPromise] = useState(null)

  const options = {
    onRedirectCallback: appState => {
      setIsAuthenticated(true)  
      history.push(
        appState && appState.targetUrl
          ? appState.targetUrl
          : window.location.pathname
      )
    }
  }

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("auth0-token") ? true : null)
  }, [])

  useEffect(() => {
    let start = Date.now()
    const p = getAuth0Client(options)
    setClientPromise(p)

    p.then(client => {
      _client = client
      setAuth0(client)
      console.log("Got Auth0 Client in:", Date.now() - start, "ms")
    })
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (auth0Client) {
      console.log("Auth0 Client Initialized")
      if (window.location.search.includes("code=")) {
        auth0Client.handleRedirectCallback()
          .then(({ appState }) => options.onRedirectCallback(appState))
      }

      auth0Client.isAuthenticated()
        .then(async val => {
          if (val) {
            const token = await auth0Client.getTokenSilently()
            localStorage.setItem("auth0-token", token)
            if (val) {
              auth0Client.getUser().then(u => {
                setUser(u)
                setLoading(false)
              })
            }
          }
          setIsAuthenticated(val)          
        })
    }
  }, [auth0Client])

  const getTokenSilently = async () => {
    const t = localStorage.getItem("auth0-token")
    if (!t) {
      // need to wait for the client to be ready
      const client = await clientPromise()
      const token = await client.getTokenSilently()
      localStorage.setItem("auth0-token", token)
      return token
    }
    return t
  }

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  }

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        getTokenSilently,
        handleRedirectCallback,
        loginWithRedirect: async (...p) => {
          // if (!auth0Client) {
          //   const client = await clientPromise()
          //   return client.loginWithRedirect(...p)
          // }
          console.log("LOGIN W/ Redirect?")
          auth0Client.loginWithRedirect(...p)
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
