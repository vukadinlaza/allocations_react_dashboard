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
import { ApolloLink, concat } from 'apollo-link';
import {Observable} from 'rxjs';

import {getTokenSilently} from "./react-auth0-spa";

import Deal from "./views/Deal";
import Investor from './views/Investor';
import AddDeal from './components/AddDeal';

initFontAwesome();

const cache = new InMemoryCache();


//const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });

const httpLink = new HttpLink({ uri: 'https://api.allocations.co/graphql' });
// Did not work 
const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  console.log("Auth Middleware called");
  return new Promise((resolve,reject)=>{
    getTokenSilently().then(token=>{
        console.log(token);
        operation.setContext({
            headers: {
              authorization: token ? `Bearer ${token}` : ''
            }
          });
          resolve();
      })
      
  })
// console.log("retured");
})


const authLink = new ApolloLink((operation, forward) => {
    return new Observable(observable => {
        let sub = null;

        getTokenSilently().then(token => {
            if (token) {
                
                    operation.setContext({
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    sub = forward(operation).subscribe(observable);
                
            } else {
                sub = forward(operation).subscribe(observable);
            }
        });

        return () => (sub ? sub.unsubscribe() : null);
    });
});

const client = new ApolloClient({
  link: concat(authLink, httpLink),   // https://www.apollographql.com/docs/react/networking/network-layer/#middleware
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
