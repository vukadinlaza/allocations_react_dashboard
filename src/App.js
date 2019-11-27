import React, { useState } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import DealEdit from "./components/DealEdit";
import Funds from "./components/Funds";
import Sidebar from './components/Sidebar';
import UserHome from './components/UserHome';
import Investors from './components/Investors';
import InvitedDeals from './components/InvitedDeals';
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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AdminRoute from "./auth/admin-route"
import PrivateRoute from "./components/PrivateRoute";
import {getTokenSilently, useAuth0} from "./react-auth0-spa";
import { client } from './apollo-client';

import Deal from "./views/Deal";
import Investor from './views/Investor';
import AddDeal from './components/AddDeal';

import "./App.scss";

const App = () => {
  const { loading } = useAuth0();

  // currently only effects small screens
  const [showSidebar, setShowSidebar] = useState(false)

  if (loading) {
    return <Loading />;
  }

  return (
    <ApolloProvider client={client}>
      <Router history={history}>
        <div id="app" className="d-flex flex-column h-100">
          <Container fluid={true}>
            <Row>
              <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
              <Col xs="12" className="xs-navbar">
                <img src="https://www.allocations.co/assets/img/brand.svg" style={{height:'40px'}} />
                <span className="hamburger" style={{ display: showSidebar ? 'none' : 'inline-block'}}>
                  <FontAwesomeIcon icon="bars" onClick={() => setShowSidebar(true)} />
                </span>
              </Col>
              <Col xs={{size: 12, offset: 0}} md={{size: 10, offset: 2}}>
                <NavBar />
                <Switch>
                  <PrivateRoute path="/" exact component={UserHome} />
                  <PrivateRoute path="/profile" component={Profile} />
                  <PrivateRoute path="/investments" component={Investments} />
                  <PrivateRoute path="/invited-deals" component={InvitedDeals} />

                  <Route path="/deal/new" component={AddDeal} />
                  <Route path="/deal" component={Deal} />

                  <AdminRoute path="/investor/:id/home">
                    <UserHome /> 
                  </AdminRoute>
                  <AdminRoute path="/investor/:id/investments">
                    <Investments /> 
                  </AdminRoute>
                  <AdminRoute path="/investors" exact>
                    <Investors /> 
                  </AdminRoute>
                  <AdminRoute path="/deals/:id/edit" exact>
                    <DealEdit /> 
                  </AdminRoute>
                  <AdminRoute path="/funds" exact>
                    <Funds /> 
                  </AdminRoute>
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
