import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloLink, Observable } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { WebSocketLink } from 'apollo-link-ws';

/** *
 *
 * Apollo Client is the custom apollo client setup
 * that inject auth into the requests w/ "auth0-token"
 * and prints errors more readably
 *
 * */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/graphql';

const uploadLink = new HttpLink({
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

const request = (operation) => {
  const token = localStorage.getItem('auth0-token');
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });
};

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle;
      Promise.resolve(operation)
        .then((oper) => request(oper))
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

const wsLink = new WebSocketLink({
  url: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true,
  },
});

export const client = new ApolloClient({
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
  wsLink,
});
