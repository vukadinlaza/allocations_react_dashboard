import React from 'react';
import { Route, useHistory } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import Loader from './utils/Loader';

const PrivateRoute = ({ component, ...args }) => {
  const history = useHistory();
  const tvc = history.location.pathname.includes('tvc') ? 'theventurecollective' : '';
  console.log({ tvc });
  return (
    <Route
      component={withAuthenticationRequired(component, {
        onRedirecting: () => <Loader />,
        loginOptions: {
          connection: 'tvc',
        },
      })}
      {...args}
    />
  );
};

export default PrivateRoute;
