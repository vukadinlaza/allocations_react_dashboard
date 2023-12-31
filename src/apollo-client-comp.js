/* eslint-disable no-console */
import React from 'react';
import {
  ApolloClient,
  ApolloProvider,
  ApolloLink,
  Observable,
  InMemoryCache,
} from '@apollo/client';
import { onError } from 'apollo-link-error';
import { useAuth0 } from '@auth0/auth0-react';

import { createUploadLink } from 'apollo-upload-client';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/graphql';

const uploadLink = createUploadLink({
  uri: API_URL,
  headers: { 'keep-alive': 'true' },
});
const cache = new InMemoryCache();
cache.originalReadQuery = cache.readQuery;
cache.readQuery = (...args) => {
  try {
    return cache.originalReadQuery(...args);
  } catch (err) {
    return undefined;
  }
};

const AuthorizedApolloProvider = ({ children }) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  /**
   * Adding fix to improve logRocket recording
   * https://docs.logrocket.com/docs/troubleshooting-sessions#apollo-client
   */

  const request = async (operation) => {
    if (!window.location.pathname.includes('/public/')) {
      const token = await getAccessTokenSilently();
      localStorage.setItem('allocationsToken', token);
      operation.setContext({
        headers: {
          authorization: token ? `Bearer ${token}` : '',
        },
      });
    } else if (window.location.pathname.includes('/public/') && isAuthenticated) {
      const token = await getAccessTokenSilently();
      if (token) localStorage.setItem('allocationsToken', token);
      operation.setContext({
        headers: {
          authorization: token ? `Bearer ${token}` : '',
        },
      });
    }
  };

  const requestLink = new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        let handle;
        Promise.resolve(operation)
          .then((op) => request(op))
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch(observer.error.bind(observer));

        return () => {
          if (handle) handle.unsubscribe();
        };
      }),
  );

  const client = new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          console.log('Graphqlerrors');
          console.log(graphQLErrors);
        }
        if (networkError) {
          console.log('Network error');
          console.log(networkError);
        }
      }),
      requestLink,
      // apollo-link-state deprecated in V3
      // https://github.com/apollographql/apollo-client/pull/4155
      // https://github.com/apollographql/apollo-client/pull/4338
      uploadLink,
    ]),
    cache,
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default AuthorizedApolloProvider;
