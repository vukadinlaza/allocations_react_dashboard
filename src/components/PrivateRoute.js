import React from 'react';
import { Route, useLocation } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import queryString from 'query-string';
import base64 from 'base-64';
import Loader from './utils/Loader';

const connection = process.env.NODE_ENV === 'production' ? 'theventurecollective' : 'tvc';
const PrivateRoute = ({ component, ...args }) => {
  const { search, pathname } = useLocation();
  const isTvc = pathname.includes('theventurecollective');
  let decodedParams = {};
  if (isTvc) {
    decodedParams = base64.decode(search.substring(1));
  }
  const paramsToUse = isTvc ? decodedParams : search;
  const query = queryString.parse(paramsToUse);

  const tvc = query.login === 'tvc' ? connection : '';
  console.log('IS TVC from private route', tvc);
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
