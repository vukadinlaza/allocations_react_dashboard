import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "./react-auth0-spa";
import { hotjar } from 'react-hotjar';
import history from "./utils/history";

console.warn = () => {}

if (process.env.NODE_ENV === "production") {
  // initialize hotjar
  hotjar.initialize(1630114, 6)
}

ReactDOM.render(
  <Router history={history}>
    <Auth0Provider>
      <App />
    </Auth0Provider>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
