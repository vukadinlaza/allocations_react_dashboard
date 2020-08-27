import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { hotjar } from 'react-hotjar';
import { ThemeProvider } from '@material-ui/core/styles';

import { Auth0Provider } from "./react-auth0-spa";
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
  console.log('fires')
  hotjar.initialize(1630114, 6)
}

var userId = "1" || null; // Replace your_user_id with your own if available.
window.hj('identify', userId, {
  "email":"test@test.com"
    // Add your own custom attributes here. Some EXAMPLES:
    // 'Signed up': '2019—06-20Z', // Signup date in ISO-8601 format.
    // 'Last purchase category': 'Electronics', // Send strings with quotes around them.
    // 'Total purchases': 15, // Send numbers without quotes.
    // 'Last purchase date': '2019-06-20Z', // Send dates in ISO-8601 format.
    // 'Last refund date': null, // Send null when no value exists for a user.
});


const ErrorBoundary = Bugsnag.getPlugin('react')
  .createErrorBoundary(React)

ReactDOM.render(
  <ErrorBoundary>
    <ThemeProvider theme={theme}>
      <Router>
        <Auth0Provider>
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
