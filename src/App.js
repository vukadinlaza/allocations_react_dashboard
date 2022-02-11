import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Cohere from 'cohere-js';
import { withLDProvider } from 'launchdarkly-react-client-sdk';

import DealDashboard from './components/dashboard/DealDashboard/index';
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
import ProfilePage from './components/Profile/ProfilePage';
import Profile from './components/Profile';
import OrganizationNew from './components/OrganizationNew';
import OrganizationMembers from './components/OrganizationMembers';
import DealsTable from './components/dashboard/FundManagerDashboard/FundManagerDealsTable/DealsTablePage';
import NotFound from './components/NotFound';
import Prospect from './components/Prospect/Prospect';
import ProspectDealPage from './components/Prospect/ProspectDealPage/ProspectDealPage';
import SubmitTaxDocs from './components/SubmitTaxDocs';
import Demo from './components/Demo';
// admin

import DealNextSteps from './components/DealNextSteps/DealNextSteps';
import InvestmentPage from './components/DealOneClick/InvestmentPage';
import SuperAdminManager from './components/superadmin/Manager';
import DealOneClick from './components/DealOneClick';

// test
import BuildDealForm from './components/NewBuild/BuildDealForm/index';

import './App.scss';
import './utils/initFontAwesome';
import { CurrentAccountProvider } from './state/current-organization';
import FreeSPVOnboarding from './components/FreeSPVOnboarding';
import Identity from './components/Identity';
import { useAuth } from './auth/useAuth';
import { useViewport } from './utils/hooks';

Cohere.init('Ywm0QKbP1exHuFEdx62GynbW');

/** *
 *
 * App.js sets up the routing for all the components, wrapping
 * with auth where appropriate {AdminRoute, PrivateRoute}
 *
 * */

const App = () => {
  const { isAuthenticated } = useAuth();
  const { width } = useViewport();

  const widthStyle = width > 960 ? 'greaterThan960Px' : 'lessThan960Px';

  const authenticatedStyle = {
    greaterThan960Px: {
      gridTemplateColumns: 'minmax(250px, 10%) auto',
      gridTemplateAreas: `'sidebar mainRoute'`,
    },
    lessThan960Px: {
      gridTemplateColumns: '100%',
      gridTemplateRows: 'minmax(65px, 6%) auto',
      gridTemplateAreas: `
        'sidebar'
        'mainRoute'
        `,
    },
  };

  const unAuthenticatedStyle = {
    gridTemplateColumns: 'auto',
    gridTemplateAreas: `'mainRoute'`,
  };

  return (
    <CurrentAccountProvider>
      <div
        className="App"
        style={isAuthenticated ? authenticatedStyle[widthStyle] : unAuthenticatedStyle}
      >
        <div className="sidebar" style={{ display: !isAuthenticated && 'none' }}>
          <Sidebar />
        </div>
        <div className="mainRoute" style={{ justifyContent: !isAuthenticated && 'center' }}>
          <Switch>
            <PrivateRoute path="/admin/:organization" component={FundManagerDashboard} exact />
            <PrivateRoute path="/admin/:organization/deals" component={Deals} exact />
            <AdminRoute path="/admin/:organization/manager" component={SuperAdminManager} exact />
            <AdminRoute path="/admin/investment/new" component={InvestmentNew} exact />
            <PrivateRoute path="/admin/:organization/:deal_id" component={DealDashboard} exact />
            <PrivateRoute path="/" exact component={InvestorDashboard} />
            <PrivateRoute path="/investor/:id/home" component={InvestorDashboard} />

            <PrivateRoute path="/submit-tax-documents" component={SubmitTaxDocs} />
            <PrivateRoute path="/demo" component={Demo} />

            <PrivateRoute path="/profile/:id" component={ProfilePage} />
            <PrivateRoute path="/profile" component={Profile} />

            {/** Onboarding * */}
            <Route path="/getting-started" component={Faq} exact />

            {/** Deals * */}
            {/* PUBLIC Landing Page */}

            <Route path="/public/new-build/:type?" exact component={BuildDealForm} />
            <Route path="/public/:organization/:deal_slug" component={DealOneClick} exact />
            <Route path="/public/:deal_slug" component={DealOneClick} exact />

            {/* Private Landing Page */}
            <PrivateRoute path="/deals/:deal_slug" component={DealOneClick} exact />
            <PrivateRoute path="/deals/:organization/:deal_slug" component={DealOneClick} exact />

            {/* prospect deals */}
            <PrivateRoute path="/prospects" component={Prospect} exact />
            <PrivateRoute
              path="/prospects/:organization/:deal_slug"
              component={ProspectDealPage}
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

            <AdminRoute path="/admin/organizations/new" component={OrganizationNew} exact />

            {/** Whitelabel Routes * */}
            <PrivateRoute path="/organizations/:org_slug/deals" component={DealsTable} exact />
            <AdminRoute path="/admin/:organization/members" component={OrganizationMembers} exact />

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
  );
};

const FlagApp = () => {
  const Component = withLDProvider({
    clientSideID: process.env.REACT_APP_LAUNCH_DARKLY_ID,
  })(App);

  return <Component />;
};

export default FlagApp;
