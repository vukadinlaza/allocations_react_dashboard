import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import {Auth0Provider} from "./react-auth0-spa";
import {hotjar} from 'react-hotjar';
import PublicApp from "./PublicApp";
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';

console.warn = () => {
}

/***
 *
 * wraps App & PublicApp in the react-router context and
 * auth0 context, so that downstream hooks can read the auth and routing data
 *
 **/

if (process.env.NODE_ENV === "production") {
  // initialize hotjar
  hotjar.initialize(1630114, 6)
}

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Router>
      <Auth0Provider>
        <Route path="/">
          <App/>
        </Route>
      </Auth0Provider>
    </Router>
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
