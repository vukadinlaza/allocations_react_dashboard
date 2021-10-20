import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Cohere from 'cohere-js';
import AdminRoute from './auth/admin-route';
import PrivateRoute from './components/PrivateRoute';
import Faq from './components/Faq';
import Deals from './components/AllDeals';
import DealNew from './components/DealNew';
import DealEditNew from './components/DealEditNew';
import Sidebar from './components/Sidebar';
import UserHome from './components/UserHome';
import Investors from './components/Investors';
import InvestmentNew from './components/InvestmentNew';
import Profile from './components/Profile/Profile';
import OrganizationNew from './components/OrganizationNew';
import OrganizationMembers from './components/OrganizationMembers';
import DealTable from './components/DealsTable';
import NotFound from './components/NotFound';

// admin
import FundManagerDashboard from './components/admin/FundManagerDashboard';

import DealNextSteps from './components/DealNextSteps/DealNextSteps';
import DealLandingPage from './components/DealOneClick/LandingPage/LandingPage';
import InvestmentPage from './components/DealOneClick/InvestmentPage/InvestmentPage';

// test
import BuildSPVForm from './components/NewBuild/BuildSPVForm/index';
import BuildFundForm from './components/NewBuild/BuildFundForm/index';

// import DealSetup from './components/DealSetup';
import DealSetup from './components/deals/fund-manager/Setup';

import AuthorizedApolloProvider from './apollo-client-comp';
import './App.scss';
import './utils/initFontAwesome';

Cohere.init('Ywm0QKbP1exHuFEdx62GynbW');

/** *
 *
 * App.js sets up the routing for all the components, wrapping
 * with auth where appropriate {AdminRoute, PrivateRoute}
 *
 * */

const App = () => {
  return (
    <AuthorizedApolloProvider>
      {/* Sidebar should handle openState, not App.js */}
      <div className="App">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="mainRoute">
          <Switch>
            <PrivateRoute path="/new-build-spv" exact component={BuildSPVForm} />
            <PrivateRoute path="/new-build-fund" exact component={BuildFundForm} />
            <PrivateRoute path="/" exact component={UserHome} />
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/deal-setup" component={DealSetup} />

            {/** Onboarding * */}
            <Route path="/getting-started" component={Faq} exact />

            {/** Deals * */}
            {/* PUBLIC Landing Page */}
            <Route path="/public/:organization/:deal_slug" component={DealLandingPage} exact />
            <Route path="/public/:deal_slug" component={DealLandingPage} exact />

            {/* Private Landing Page */}
            <PrivateRoute path="/deals/:deal_slug" component={DealLandingPage} exact />
            <PrivateRoute
              path="/deals/:organization/:deal_slug"
              component={DealLandingPage}
              exact
            />

            {/* Private Invest Page */}
            <PrivateRoute path="/invest/:deal_slug" component={InvestmentPage} exact />
            <PrivateRoute
              path="/invest/:organization/:deal_slug"
              component={InvestmentPage}
              exact
            />

            {/* Private Next Steps page */}
            <PrivateRoute path="/next-steps/:deal_slug" component={DealNextSteps} exact />
            <PrivateRoute
              path="/next-steps/:organization/:deal_slug"
              component={DealNextSteps}
              exact
            />

            <PrivateRoute path="/investor/:id/home" component={UserHome} />
            <AdminRoute path="/admin/investment/new" component={InvestmentNew} exact />
            <AdminRoute path="/admin/organizations/new" component={OrganizationNew} exact />

            {/** Whitelabel Routes * */}
            <PrivateRoute path="/admin/type/:type" component={DealTable} exact />
            <PrivateRoute path="/admin/:organization" component={FundManagerDashboard} exact />
            <AdminRoute path="/admin/:organization/members" component={OrganizationMembers} exact />

            <PrivateRoute path="/admin/:organization/deals" component={Deals} exact />
            <PrivateRoute path="/admin/:organization/deal/new" component={DealNew} exact />
            <PrivateRoute
              path="/admin/:organization/deals/:id/edit"
              component={DealEditNew}
              exact
            />
            <PrivateRoute path="/investors" component={Investors} exact />

            {/** catchall * */}
            <PrivateRoute exact path="/" component={UserHome} />
            <Route path={['*', '/404']} component={NotFound} />
          </Switch>
        </div>
      </div>
    </AuthorizedApolloProvider>
  );
};

export default App;
