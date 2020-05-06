import React, { useEffect } from "react";
import _ from 'lodash'
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import { useAuth0 } from "../react-auth0-spa";

/***
 *
 * Private route is a route a user must be logged in to view
 * if they aren't logged in it sends them to login and automatically
 * redirects back the page they originally requested
 *
 **/

const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const { isAuthenticated, loginWithRedirect, auth0Client } = useAuth0();

  useEffect(() => {
    if (auth0Client && isAuthenticated === false) {
      loginWithRedirect({ appState: { targetUrl: _.get(rest, 'location.pathname', '/') }, initialScreen: 'signIn' })
    }
  }, [auth0Client, isAuthenticated]);

  const render = props =>
    isAuthenticated === true ? <Component {...props} /> : null;

  return <Route path={path} render={render} {...rest} />;
};

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired
};

export default PrivateRoute;
