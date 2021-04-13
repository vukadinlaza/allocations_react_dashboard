import { ApolloClient } from 'apollo-client';
import { ApolloLink, Observable } from 'apollo-link';
import { ApolloProvider } from '@apollo/react-hooks';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { RetryLink } from 'apollo-link-retry';
import { createUploadLink } from 'apollo-upload-client';
import { withClientState } from 'apollo-link-state';

import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { setContext } from 'apollo-link-context';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/graphql';

// IF you want to enable/disable dev tools in different enviroments
const devTools = localStorage.getItem('apolloDevTools') || false;

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
  const { getAccessTokenSilently } = useAuth0();

  /**
   * Adding fix to improve logRocket recording
   * https://docs.logrocket.com/docs/troubleshooting-sessions#apollo-client
   */

  const request = async (operation) => {
    if (!window.location.pathname.includes('/public/')) {
      const token = await getAccessTokenSilently();
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
      withClientState({
        defaults: {
          isConnected: true,
        },
        resolvers: {
          Mutation: {
            updateNetworkStatus: (_, { isConnected }, { cache }) => {
              cache.writeData({ data: { isConnected } });
              return null;
            },
          },
        },
        cache,
      }),
      uploadLink,
    ]),
    cache,
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default AuthorizedApolloProvider;
