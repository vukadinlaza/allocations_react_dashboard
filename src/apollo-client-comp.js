import { ApolloClient } from 'apollo-client';
import { ApolloLink, Observable, split } from 'apollo-link';
import { ApolloProvider } from '@apollo/react-hooks';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { RetryLink } from 'apollo-link-retry';
import { createUploadLink } from 'apollo-upload-client';
import { withClientState } from 'apollo-link-state';

import { useAuth0 } from '@auth0/auth0-react';
import React, { useState, useEffect } from 'react';
import { setContext } from 'apollo-link-context';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
// import { WebSocketLink } from '@apollo/client/link/ws';

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
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  
  /**
   * Adding fix to improve logRocket recording
   * https://docs.logrocket.com/docs/troubleshooting-sessions#apollo-client
   */
  const token = getAccessTokenSilently();
  useEffect(() => {

  }, [token])
  // const getToken = async () => {
  //   const token = await getAccessTokenSilently();
  //   return token;
  // }
  // if(!token || typeof token !== "string") return <div>Loading...</div>;
  const request = async (operation) => {
    if (!window.location.pathname.includes('/public/')) {
      // const token = await getToken();
      operation.setContext({
        headers: {
          authorization: token ? `Bearer ${token}` : '',
        },
      });
    } else if (window.location.pathname.includes('/public/') && isAuthenticated) {
      // const token = await getToken();
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

  const onErrorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      console.log('Graphqlerrors');
      console.log(graphQLErrors);
    }
    if (networkError) {
      console.log('Network error');
      console.log(networkError);
    }
  });

  const withClientLink = withClientState({
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
  });

  const wsLink = (async () => {
    // const token = await getToken();
    const subscriptionOptions = {
      reconnect: true,
      connectionParams: {
        authToken: token? token : '',
      },
    };
    console.log(JSON.stringify(subscriptionOptions.connectionParams.authToken))
    const subscriptionClient = await new SubscriptionClient('ws://localhost:4000/graphql', subscriptionOptions);
    const newWSLink = await new WebSocketLink(subscriptionClient);
    return newWSLink;
  })();

  const linksArray = [onErrorLink, requestLink, withClientLink, uploadLink];

  console.log({linksArray})


  console.log({token})
  linksArray[3] = wsLink;
  const client = new ApolloClient({
    link: ApolloLink.from(linksArray),
    cache,
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default AuthorizedApolloProvider;
