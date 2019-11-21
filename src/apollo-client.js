import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getTokenSilently } from "./react-auth0-spa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/graphql"

const httpLink = createHttpLink({ uri: API_URL });

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await getTokenSilently();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

// const cache = new InMemoryCache();
// cache.originalReadQuery = cache.readQuery;
// cache.readQuery = (...args) => {
//   try {
//     return cache.originalReadQuery(...args);
//   } catch (err) {
//     return undefined;
//   }
// };


// const request = async (operation) => {
//   const token = await getTokenSilently();
//   operation.setContext({
//     headers: {
//       authorization: token ? `Bearer ${token}` : ''
//     }
//   });
// };

// const requestLink = new ApolloLink((operation, forward) =>
//   new Observable(observer => {
//     let handle;
//     Promise.resolve(operation)
//       .then(oper => request(oper))
//       .then(() => {
//         handle = forward(operation).subscribe({
//           next: observer.next.bind(observer),
//           error: observer.error.bind(observer),
//           complete: observer.complete.bind(observer),
//         });
//       })
//       .catch(observer.error.bind(observer));

//     return () => {
//       if (handle) handle.unsubscribe();
//     };
//   })
// );

// const _client = new ApolloClient({
//   link: ApolloLink.from([
//     onError(({ graphQLErrors, networkError }) => {
//       if (graphQLErrors) {
//         console.log("Graphqlerrors"+graphQLErrors)
//        // sendToLoggingService(graphQLErrors);
//       }
//       if (networkError) {
//         console.log("Network error"+networkError)
//        // logoutUser();
//       }
//     }),
//     requestLink,
//     withClientState({
//       defaults: {
//         isConnected: true
//       },
//       resolvers: {
//         Mutation: {
//           updateNetworkStatus: (_, { isConnected }, { cache }) => {
//             cache.writeData({ data: { isConnected }});
//             return null;
//           }
//         }
//       },
//       cache
//     }),
//     new HttpLink({
//       uri: API_URL,
//     // credentials: 'include'
//     })
//   ]),
//   cache
// });


// const client = new ApolloClient({
//   uri:"http://localhost:4000/graphql",
//   request:async (operation=>{
//    // const token="edddd";
//      const token= getTokenSilently().then(token=>{
//         console.log(token);
//         return token;
//         })
//       operation.setContext({
//           headers:{
//             authorization: token ? `Bearer ${token}` : ''
//           }
//       })
//   }),
//   cache
// });

// const client = new ApolloClient({
//   uri: "http://localhost:4000/graphql"
// })