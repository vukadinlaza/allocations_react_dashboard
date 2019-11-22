import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Sidebar from './components/Sidebar';
import UserHome from './components/UserHome';
import Investments from './components/Investments';
import Profile from "./views/Profile";
import history from "./utils/history";
import { ApolloProvider } from '@apollo/react-hooks';
import initFontAwesome from "./utils/initFontAwesome";
import { InMemoryCache } from "apollo-boost";
import ApolloClient from 'apollo-boost';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink, Observable } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { withClientState } from 'apollo-link-state';


import PrivateRoute from "./components/PrivateRoute";
import {getTokenSilently, useAuth0} from "./react-auth0-spa";
import { client } from './apollo-client';

import Deal from "./views/Deal";
import Investor from './views/Investor';
import AddDeal from './components/AddDeal';

import "./App.scss";

const App = () => {
  const { loading } = useAuth0();

  if (loading) {
    return <Loading />;
  }

  return (
    <ApolloProvider client={client}>
      <Router history={history}>
        <div id="app" className="d-flex flex-column h-100">
          <Container fluid={true}>
            <Row>
              <Sidebar />
              <Col xs="10" className="offset-2">
                <NavBar />
                <Switch>
                  <PrivateRoute path="/" exact component={UserHome} />
                  <PrivateRoute path="/profile" component={Profile} />
                  <PrivateRoute path="/investments" component={Investments} />
                  <Route path="/deal/new" component={AddDeal} />
                  <Route path="/deal" component={Deal} />
                  <Route path="/investor" component={Investor} />
                </Switch>
              </Col>
            </Row>
          </Container>
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default App;
