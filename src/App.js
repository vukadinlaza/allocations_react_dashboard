import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

import Faq from "./components/Faq";
import NavBar from "./components/NavBar";
import SignUp from "./components/SignUp";
import Deal from "./components/Deal";
import Deals from "./components/Deals";
import DealNew from "./components/DealNew";
import DealEdit from "./components/DealEdit";
import InvestorEdit from "./components/InvestorEdit";
import InvestorNew from "./components/InvestorNew";
import Funds from "./components/Funds";
import Sidebar from './components/Sidebar';
import UserHome from './components/UserHome';
import Investors from './components/Investors';
import InvitedDeals from './components/InvitedDeals';
import Investments from './components/Investments';
import InvestmentNew from './components/InvestmentNew';
import InvestmentEdit from './components/InvestmentEdit';
import UserInvestments from './components/UserInvestments';
import AllocationsX from './allocationsX/Home';
import Profile from './components/Profile';

import AdminHome from './components/AdminHome'

import { useAuth0 } from "./react-auth0-spa"
import { ApolloProvider } from '@apollo/react-hooks';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AdminRoute from "./auth/admin-route"
import PrivateRoute from "./components/PrivateRoute";
import { client } from './apollo-client';

import "./App.scss";
import "./utils/initFontAwesome"

const App = () => {
  // currently only effects small screens
  const { user } = useAuth0()
  const [showSidebar, setShowSidebar] = useState(false)

  const closeSidebar = () => {
    if (showSidebar) setShowSidebar(false)
  }

  useEffect(() => {
    if (window._slaask && user) {
      window._slaask.updateContact({email: user.email})
    }
  }, [window, user])

  return (
    <ApolloProvider client={client}>
      <div id="app" className="d-flex flex-column h-100" onClick={closeSidebar}>
        <Container fluid>
          <Row>
            <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
            <Col xs="12" className="xs-navbar">
              <img src="https://www.allocations.co/assets/img/brand.svg" alt="#" style={{height:'40px'}} />
              <span className="hamburger" style={{ display: showSidebar ? 'none' : 'inline-block'}}>
                <FontAwesomeIcon icon="bars" onClick={() => setShowSidebar(true)} />
              </span>
            </Col>
            <Col xs={{size: 12, offset: 0}} md={{size: 10, offset: 2}} className="app-body">
              <NavBar />
              <Switch>
                <PrivateRoute path="/" exact component={UserHome} />
                <PrivateRoute path="/profile" component={Profile} />
                <PrivateRoute path="/investments" component={UserInvestments} />
                <PrivateRoute path="/invited-deals" component={InvitedDeals} />

                <PrivateRoute path="/deals/:id" component={Deal} exact/>
                <PrivateRoute path="/exchange" component={AllocationsX} exact/>

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

                {/** Whitelabel Routes **/}
                <AdminRoute path="/admin/:organization" exact>
                  <AdminHome />
                </AdminRoute>


                <AdminRoute path="/funds" exact>
                  <Funds /> 
                </AdminRoute>
                <Route path="/signup" exact>
                  <SignUp />
                </Route>
                <Route path="/getting-started" exact><Faq /></Route>
                <PrivateRoute path="/" component={UserHome} />
              </Switch>
            </Col>
          </Row>
        </Container>
      </div>
    </ApolloProvider>
  );
};

export default App;
