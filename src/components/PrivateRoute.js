import React from 'react';
import { Route, useLocation } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { withLDProvider } from 'launchdarkly-react-client-sdk';
import queryString from 'query-string';
import base64 from 'base-64';
import AllocationsLoader from './utils/AllocationsLoader';
import { useAuth } from '../auth/useAuth';

const connection = process.env.NODE_ENV === 'production' ? 'theventurecollective' : 'tvc';
const PrivateRoute = ({ component, ...args }) => {
  const { isAuthenticated, loading, userProfile } = useAuth();
  const { search, pathname } = useLocation();
  const isTvc = pathname.includes('theventurecollective');
  let decodedParams = {};
  if (isTvc) {
    const substring = search.substring(1);

    decodedParams = substring;
    if (!substring.includes('investmentId')) {
      decodedParams = base64.decode(substring);
    }
  }
  const paramsToUse = isTvc ? decodedParams : search;
  const query = queryString.parse(paramsToUse);

  const tvc = query.login === 'tvc' ? connection : '';

  const launchDarklyUser = { key: userProfile?._id, email: userProfile?.email };

  const FlagComponent = withLDProvider({
    clientSideID: process.env.REACT_APP_LAUNCH_DARKLY_ID,
    user: isAuthenticated && !loading ? launchDarklyUser : undefined,
  })(component);

  return (
    <Route
      component={withAuthenticationRequired(FlagComponent, {
        onRedirecting: () => <AllocationsLoader fullHeight />,
        loginOptions: {
          connection: tvc,
        },
      })}
      {...args}
    />
  );
};

export default PrivateRoute;
