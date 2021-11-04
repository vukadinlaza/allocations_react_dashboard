import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Cohere from 'cohere-js';
import { withLDProvider } from 'launchdarkly-react-client-sdk';

import FundManagerDashboard from './components/dashboard/FundManagerDashboard';
import InvestorDashboard from './components/dashboard/InvestorDashboard';

import AdminRoute from './auth/admin-route';
import PrivateRoute from './components/PrivateRoute';
import Faq from './components/Faq';
import Deals from './components/AllDeals';
import DealNew from './components/DealNew';
import DealEditNew from './components/DealEditNew';
import Sidebar from './components/Sidebar';
import Investors from './components/Investors';
import InvestmentNew from './components/InvestmentNew';
import Profile from './components/Profile/Profile';
import OrganizationNew from './components/OrganizationNew';
import OrganizationMembers from './components/OrganizationMembers';
import DealTable from './components/deals/fund-manager/DealsTablePage';
import NotFound from './components/NotFound';
import SubmitTaxDocs from './components/SubmitTaxDocs';
import Demo from './components/Demo';
// admin

import DealNextSteps from './components/DealNextSteps/DealNextSteps';
import DealLandingPage from './components/DealOneClick/LandingPage/LandingPage';
import InvestmentPage from './components/DealOneClick/InvestmentPage/InvestmentPage';
import SuperAdminManager from './components/superadmin/Manager';

// test
import BuildSPVForm from './components/NewBuild/BuildSPVForm/index';

import DealSetup from './components/deals/fund-manager/Setup';
// import DealSetup from './components/DealSetup';

import AuthorizedApolloProvider from './apollo-client-comp';
import './App.scss';
import './utils/initFontAwesome';
import { CurrentAccountProvider } from './state/current-organization';
import FreeSPVOnboarding from './components/FreeSPVOnboarding';
import Identity from './components/Identity';

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
      <CurrentAccountProvider>
        <div className="App">
          <div className="sidebar">
            <Sidebar />
          </div>
          <div className="mainRoute">
            <Switch>
              <PrivateRoute path="/admin/:organization" component={FundManagerDashboard} exact />
              <PrivateRoute path="/" exact component={InvestorDashboard} />
              <PrivateRoute path="/investor/:id/home" component={InvestorDashboard} />

              <PrivateRoute path="/submit-tax-documents" component={SubmitTaxDocs} />
              <PrivateRoute path="/demo" component={Demo} />

              <PrivateRoute path="/new-build-spv" exact component={BuildSPVForm} />
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

              <AdminRoute path="/admin/investment/new" component={InvestmentNew} exact />
              <AdminRoute path="/admin/organizations/new" component={OrganizationNew} exact />

              {/** Whitelabel Routes * */}
              <PrivateRoute path="/organizations/:org_slug/deals" component={DealTable} exact />
              <AdminRoute
                path="/admin/:organization/members"
                component={OrganizationMembers}
                exact
              />

              <AdminRoute path="/admin/:organization/manager" component={SuperAdminManager} exact />

              <PrivateRoute path="/admin/:organization/deals" component={Deals} exact />
              <PrivateRoute path="/admin/:organization/deal/new" component={DealNew} exact />
              <PrivateRoute
                path="/admin/:organization/deals/:id/edit"
                component={DealEditNew}
                exact
              />
              <PrivateRoute path="/investors" component={Investors} exact />

              <PrivateRoute path="/identity" component={Identity} />
              <PrivateRoute path="/spv-onboarding" component={FreeSPVOnboarding} exact />

              {/** catchall * */}
              <Route path={['*', '/404']} component={NotFound} />
            </Switch>
          </div>
        </div>
      </CurrentAccountProvider>
    </AuthorizedApolloProvider>
  );
};

const FlagApp = () => {
  const Component = withLDProvider({
    clientSideID: process.env.REACT_APP_LAUNCH_DARKLY_ID,
  })(App);

  return <Component />;
};

export default FlagApp;
