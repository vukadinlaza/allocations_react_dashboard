import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { hotjar } from 'react-hotjar';
import { ThemeProvider } from '@material-ui/core/styles';
import Auth0ProviderWithHistory from './Auth0providerWithHistory'
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import theme from './theme';
import "./index.css";

import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'
import { ToastContainer } from 'react-toastify';

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
const ErrorBoundary = Bugsnag.getPlugin('react')
  .createErrorBoundary(React)

ReactDOM.render(
  <ErrorBoundary>
    <ThemeProvider theme={theme}>
      <Router>
        <Auth0ProviderWithHistory

        >
          <ToastContainer />
          <App />
        </Auth0ProviderWithHistory>
      </Router>
    </ThemeProvider>
  </ErrorBoundary>,
  document.getElementById("root")

);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
