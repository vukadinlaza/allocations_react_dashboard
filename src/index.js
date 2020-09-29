import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { hotjar } from 'react-hotjar';
import { ThemeProvider } from '@material-ui/core/styles';
import { useAuth } from './auth/useAuth'
import { Auth0Provider } from "@auth0/auth0-react";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

import theme from './theme';
import "./index.css";

import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'

Bugsnag.start({
  apiKey: 'b6fcaf96aefe9b327e7db6e6d6178a2c',
  plugins: [new BugsnagPluginReact()]
})

/***
 *
 * wraps App & PublicApp in the react-router context and
 * auth0 context, so that downstream hooks can read the auth and routing data
 *
 **/

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === 'staging') {
  // initialize hotjar
  hotjar.initialize(1630114, 6)
}

// let user = null

// const GetUser = () => {
//   const userProfile = useAuth()
//   useEffect(() => {
//     user = userProfile
//   }, [userProfile])
//   return <> </>
// }

// console.log('USER', user)

// var userId = "1" || null; // Replace your_user_id with your own if available.
// window.hj('identify', userId, {
//   'email': 'test@test.com',
//   'Signed up': '2019—06-20Z'
// });

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const client_id = process.env.REACT_APP_AUTH0_KEY;
const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

const defaultOptions = {
  domain,
  client_id,
  audience,
  redirect_uri: window.location.origin,
}

const ErrorBoundary = Bugsnag.getPlugin('react')
  .createErrorBoundary(React)

ReactDOM.render(
  <ErrorBoundary>
    <ThemeProvider theme={theme}>
      <Router>
        <Auth0Provider
          domain={domain}
          clientId={client_id}
          audience={audience}
          redirectUri={window.location.origin}>
          <App />
        </Auth0Provider>
      </Router>
    </ThemeProvider>
  </ErrorBoundary>,
  document.getElementById("root")

);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
