import React, { useState, useEffect, useContext } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";
import history from "./utils/history";

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);
let _initOptions, _client

const domain="login.allocations.co";
const client_id="R2iJsfjNPGNjIdPmRoE3IcKd9UvVrsp1";
const audience="https://api.graphql.com"

const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

const options = {
  domain,
  client_id,
  audience,
  redirect_uri: window.location.origin,
  onRedirectCallback
}

const getAuth0Client = () => {
  return new Promise(async (resolve, reject) => {
    let client
    if (!client) {
      try {
        client = await createAuth0Client(options)
        resolve(client)
      } catch (e) {
        console.log(e);
        reject(new Error('getAuth0Client Error', e))
      }
    }
  })
}

export const getTokenSilently = async (...p) => {
  if(!_client) {
    _client = await getAuth0Client()
  }
  return  _client.getTokenSilently(...p) 
}

export const Auth0Provider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      let start = Date.now()
      const client = await getAuth0Client()
      _client = client
      setAuth0(client)
      console.log("Got Auth0 Client in:", Date.now() - start, "ms")

      if (window.location.search.includes("code=")) {
        const { appState } = await client.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await client.isAuthenticated();
      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await client.getUser();
        setUser(user);
      }

      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client.getUser();
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };
  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
        getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
        getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
        logout: (...p) => auth0Client.logout(...p)
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
