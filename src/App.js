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

// superadmin
import SuperAdminManager from './components/superadmin/Manager'
import SuperAdminOverview from './components/superadmin/Overview'

// admin
import AdminHome from './components/admin/AdminHome'
import Compliance from './components/admin/Compliance'

// allocationsX
import AllocationsX from './allocationsX/Home';
import DealExchange from './allocationsX/DealExchange';
import AdminExchangeOverview from './allocationsX/AdminOverview';

import Profile from './components/Profile';
import OrganizationNew from './components/OrganizationNew'
import OrganizationMembers from './components/OrganizationMembers'

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
              <img src="https://allocations-public.s3.us-east-2.amazonaws.com/logo.png" alt="#" style={{height:'70px'}} />
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

                {/** Deals **/}
                <PrivateRoute path="/deals/:deal_slug" component={Deal} exact />
                <PrivateRoute path="/deals/:organization/:deal_slug" component={Deal} exact />

                {/** AllocationsX **/}
                <PrivateRoute path="/exchange" component={AllocationsX} exact />
                <PrivateRoute path="/exchange/:deal" component={DealExchange} exact />
                <AdminRoute path="/admin/:organization/exchange" component={AdminExchangeOverview} exact />

                <AdminRoute path="/investor/:id/home" component={UserHome} />
                <AdminRoute path="/investor/:id/investments" component={UserInvestments} />
                <AdminRoute path="/investors/new" component={InvestorNew} exact />
                <AdminRoute path="/investor/:id/edit" component={InvestorEdit} />
                <AdminRoute path="/admin/investment/new" component={InvestmentNew} exact />
                <AdminRoute path="/admin/investments/:id/edit" component={InvestmentEdit} exact />
                <AdminRoute path="/admin/organizations/new" component={OrganizationNew} exact />

                {/** SuperAdmin **/}
                <AdminRoute path="/superadmin" component={SuperAdminOverview} exact />
                <AdminRoute path="/admin/:organization/manager" component={SuperAdminManager} exact />

                {/** Whitelabel Routes **/}
                <PrivateRoute path="/admin/funds" component={Funds} exact />
                <PrivateRoute path="/admin/:organization" component={AdminHome} exact />
                <AdminRoute path="/admin/:organization/members" component={OrganizationMembers} exact />

                <PrivateRoute path="/admin/:organization/deals" component={Deals} exact />
                <PrivateRoute path="/admin/:organization/deal/new" component={DealNew} exact />
                <PrivateRoute path="/admin/:organization/deals/:id/edit" component={DealEdit} exact />

                <PrivateRoute path="/admin/:organization/investments" component={Investments} exact />
                <PrivateRoute path="/admin/:organization/compliance" component={Compliance} exact />
                <AdminRoute path="/admin/:organization/investors" component={Investors} exact />

                <Route path="/signup" component={SignUp} exact />
                <Route path="/getting-started" component={Faq} exact />
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
