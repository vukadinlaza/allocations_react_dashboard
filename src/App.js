import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import PrivateRoute from "./components/PrivateRoute";
import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Profile from "./views/Profile";
import { useAuth0 } from "./react-auth0-spa";
import history from "./utils/history";
import "./App.css";
import { ApolloProvider } from '@apollo/react-hooks';
import initFontAwesome from "./utils/initFontAwesome";
import { InMemoryCache } from "apollo-boost";
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink, Observable } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { withClientState } from 'apollo-link-state';
import {getTokenSilently} from "./react-auth0-spa";

import Deal from "./views/Deal";
import Investor from './views/Investor';
import AddDeal from './components/AddDeal';

initFontAwesome();


let API_URL="https://api.allocations.co/graphql";
// if(process.env.NODE_ENV==="development"){
//   API_URL="http://localhost:4000/graphql"
  
// }else{
//   API_URL="https://api.allocations.co/graphql"
// }

const cache = new InMemoryCache();
cache.originalReadQuery = cache.readQuery;
cache.readQuery = (...args) => {
  try {
    return cache.originalReadQuery(...args);
  } catch (err) {
    return undefined;
  }
};


const request = async (operation) => {
  const token = await getTokenSilently();
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : ''
    }
  });
};

const requestLink = new ApolloLink((operation, forward) =>
  new Observable(observer => {
    let handle;
    Promise.resolve(operation)
      .then(oper => request(oper))
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
  })
);



const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        console.log("Graphqlerrors"+graphQLErrors)
       // sendToLoggingService(graphQLErrors);
      }
      if (networkError) {
        console.log("Network error"+networkError)
       // logoutUser();
      }
    }),
    requestLink,
    withClientState({
      defaults: {
        isConnected: true
      },
      resolvers: {
        Mutation: {
          updateNetworkStatus: (_, { isConnected }, { cache }) => {
            cache.writeData({ data: { isConnected }});
            return null;
          }
        }
      },
      cache
    }),
    new HttpLink({
      uri: API_URL,
    // credentials: 'include'
    })
  ]),
  cache
});
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


const App = () => {
  const { loading } = useAuth0();

  if (loading) {
    return <Loading />;
  }

  return (
    <ApolloProvider client={client}>
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />
        <Container className="flex-grow-1 mt-5">
          <Switch>
            <Route path="/" exact component={Home} />
            <PrivateRoute path="/profile" component={Profile} />
             <PrivateRoute path="/deal" component={Deal} />
             <PrivateRoute path="/investor" component={Investor} />
             <PrivateRoute path="/addDeal" component={AddDeal} />
          </Switch>
        </Container>
        <Footer />
      </div>
    </Router>
    </ApolloProvider>
  );
};

export default App;
