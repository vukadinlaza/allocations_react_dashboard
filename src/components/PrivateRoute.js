import React from 'react';
import { Route, useHistory, useLocation } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import queryString from 'query-string';

import Loader from './utils/Loader';

const PrivateRoute = ({ component, ...args }) => {
  const location = useLocation();
  const query = queryString.parse(location.search);
  const tvc = query.login === 'tvc' ? 'tvc' : '';
  console.log(query);
  console.log('TVC', tvc);
  return (
    <Route
      component={withAuthenticationRequired(component, {
        onRedirecting: () => <Loader />,
        loginOptions: {
          connection: tvc,
        },
      })}
      {...args}
    />
  );
};

export default PrivateRoute;
