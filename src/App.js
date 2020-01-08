import React, { useState, useEffect } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

import NavBar from "./components/NavBar";
import SignUp from "./components/SignUp";
import Home from "./views/Home";
import Deal from "./components/Deal";
import Deals from "./components/Deals";
import DealNew from "./components/DealNew";
import DealEdit from "./components/DealEdit";
import InvestorEdit from "./components/InvestorEdit";
import InvestorNew from "./components/InvestorNew";
import Funds from "./components/Funds";
import Sidebar from './components/Sidebar';
import UserHome from './components/UserHome';
import UserEdit from './components/UserEdit';
import Investors from './components/Investors';
import InvitedDeals from './components/InvitedDeals';
import Investments from './components/Investments';
import InvestmentNew from './components/InvestmentNew';
import InvestmentEdit from './components/InvestmentEdit';
import UserInvestments from './components/UserInvestments';
import Profile from './components/Profile';

import history from "./utils/history";
import { ApolloProvider } from '@apollo/react-hooks';
import initFontAwesome from "./utils/initFontAwesome";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AdminRoute from "./auth/admin-route"
import PrivateRoute from "./components/PrivateRoute";
import {getTokenSilently, useAuth0} from "./react-auth0-spa";
import { client } from './apollo-client';

import Loader from "./components/utils/Loader"
import Investor from './views/Investor';
import AddDeal from './components/AddDeal';

import "./App.scss";

const App = () => {
  const { loading, user, getTokenSilently } = useAuth0();

  // currently only effects small screens
  const [showSidebar, setShowSidebar] = useState(false)

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
                  <PrivateRoute path="/investments" component={UserInvestments} />
                  <PrivateRoute path="/invited-deals" component={InvitedDeals} />

                  <PrivateRoute path="/complete-signup" component={UserEdit} />

                  <AdminRoute path="/investor/:id/home">
                    <UserHome /> 
                  </AdminRoute>
                  <AdminRoute path="/investor/:id/investments">
                    <UserInvestments /> 
                  </AdminRoute>
                  <AdminRoute path="/investors/new" exact>
                    <InvestorNew /> 
                  </AdminRoute>
                  <AdminRoute path="/investor/:id/edit">
                    <InvestorEdit /> 
                  </AdminRoute>
                  <AdminRoute path="/investors" exact>
                    <Investors /> 
                  </AdminRoute>
                  <AdminRoute path="/deals" exact>
                    <Deals /> 
                  </AdminRoute>
                  <AdminRoute path="/deal/new" exact>
                    <DealNew /> 
                  </AdminRoute>
                  <AdminRoute path="/deals/:id" exact>
                    <Deal /> 
                  </AdminRoute>
                  <AdminRoute path="/deals/:id/edit" exact>
                    <DealEdit /> 
                  </AdminRoute>
                  <AdminRoute path="/admin/investments" exact>
                    <Investments /> 
                  </AdminRoute>
                  <AdminRoute path="/admin/investment/new" exact>
                    <InvestmentNew /> 
                  </AdminRoute>
                  <AdminRoute path="/admin/investments/:id/edit" exact>
                    <InvestmentEdit /> 
                  </AdminRoute>
                  <AdminRoute path="/funds" exact>
                    <Funds /> 
                  </AdminRoute>
                  <Route path="/signup" exact>
                    <SignUp />
                  </Route>
                  <PrivateRoute path="/" component={UserHome} />
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
