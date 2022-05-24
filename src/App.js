import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Cohere from 'cohere-js';
import { withLDProvider, useLDClient, useFlags } from 'launchdarkly-react-client-sdk';

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
import InvestmentNew from './components/InvestmentNew';
import ProfilePage from './components/Profile/ProfilePage';
import Profile from './components/Profile';
import OrganizationNew from './components/OrganizationNew';
import OrganizationMembers from './components/OrganizationMembers';
import DealsTable from './components/dashboard/FundManagerDashboard/FundManagerDealsTable/DealsTablePage';
import NotFound from './components/NotFound';
import SubmitTaxDocs from './components/SubmitTaxDocs';
import Demo from './components/Demo';
// admin

import DealNextSteps from './components/DealNextSteps/DealNextSteps';
import InvestmentPage from './components/DealOneClick/InvestmentPage';
import SuperAdminManager from './components/superadmin/Manager';
import DealOneClick from './components/DealOneClick';

// test
import Build from './components/Build';
import PostBuild from './components/PostBuild';

import './App.scss';
import './utils/initFontAwesome';
import { CurrentAccountProvider } from './state/current-organization';
import FreeSPVOnboarding from './components/FreeSPVOnboarding';
import Identity from './components/Identity';
import { useAuth } from './auth/useAuth';
import TempDealDashboard from './components/dashboard/TempDealDashboard';
import RemoteFundManagerDashboard from './components/RemoteFundManagerDashboard';
import RemoteTaxDashboard from './components/TaxDashboard';
import SidebarOld from './components/SidebarOld';
import RemoteTaxBanner from './components/RemoteTaxBanner';

Cohere.init('Ywm0QKbP1exHuFEdx62GynbW');

/** *
 *
 * App.js sets up the routing for all the components, wrapping
 * with auth where appropriate {AdminRoute, PrivateRoute}
 *
 * */

const SideBar = ({ isAuthenticated }) => {
  const { federatedSidebar } = useFlags();
  return (
    <div className="sidebar" style={{ display: !isAuthenticated && 'none' }}>
      {federatedSidebar ? <Sidebar /> : <SidebarOld />}
    </div>
  );
};

const MainApp = ({ isAuthenticated }) => {
  const { remoteFundManagerDashboard } = useFlags();
  return (
    <div className="mainRoute" style={{ justifyContent: !isAuthenticated && 'center' }}>
      <div style={{ maxHeight: '30%' }}>
        <div
          style={{
            backgroundColor: '#0144e4',
            width: '100%',
            padding: '.5rem',
            color: 'white',
            textAlign: 'center',
            marginBottom: '.25rem',
          }}
        >
          Monday, May 30th is a federal holiday in the United States in observance of Memorial Day.
          Banks in the United States will be closed. Please{' '}
          <a
            href="https://www.allocations.com/contact-us"
            style={{
              color: 'white',
              textDecoration: 'underline',
            }}
          >
            contact support
          </a>{' '}
          for any assistance.
        </div>
      </div>
      <RemoteTaxBanner />
      <Switch>
        {/* Allocations Admin Routes */}
        <AdminRoute path="/admin/:organization/manager" component={SuperAdminManager} exact />
        <AdminRoute path="/admin/:organization/members" component={OrganizationMembers} exact />
        <AdminRoute path="/admin/investment/new" component={InvestmentNew} exact />
        <AdminRoute path="/admin/organizations/new" component={OrganizationNew} exact />

        {/* Organization Admin */}
        <PrivateRoute
          path="/admin/:organization"
          component={remoteFundManagerDashboard ? RemoteFundManagerDashboard : FundManagerDashboard}
          exact
        />
        <PrivateRoute path="/admin/:organization/deals" component={Deals} exact />
        <PrivateRoute path="/admin/:organization/:deal_id" component={DealDashboard} exact />
        <PrivateRoute path="/admin/:organization/deal/new" component={DealNew} exact />
        <PrivateRoute path="/admin/:organization/deals/:id/edit" component={DealEditNew} exact />
        <PrivateRoute
          path="/admin/:organization/deals/:deal_id"
          component={TempDealDashboard}
          exact
        />

        {/* Investor */}
        <PrivateRoute path="/" exact component={InvestorDashboard} />
        <PrivateRoute path="/investor/:id/home" component={InvestorDashboard} />
        <PrivateRoute path="/submit-tax-documents" component={SubmitTaxDocs} />
        <PrivateRoute path="/tax-activity" component={RemoteTaxDashboard} />
        <PrivateRoute path="/demo" component={Demo} />
        <PrivateRoute path="/profile/:id" component={ProfilePage} />
        <PrivateRoute path="/profile" component={Profile} />

        {/** Onboarding * */}
        <Route path="/getting-started" component={Faq} exact />

        {/** Deals * */}
        {/* Public */}

        <Route path="/public/new-build" exact component={Build} />

        {/* Private  */}
        <PrivateRoute path="/new-build/deal" exact component={PostBuild} />
        <PrivateRoute path="/deals/:organization/:deal_slug" component={DealOneClick} exact />

        {/* Invest */}
        <PrivateRoute path="/invest/:deal_slug" component={InvestmentPage} exact />
        <PrivateRoute path="/invest/:organization/:deal_slug" component={InvestmentPage} exact />

        {/* Next Steps page */}
        <PrivateRoute path="/next-steps/:deal_slug" component={DealNextSteps} exact />
        <PrivateRoute path="/next-steps/:organization/:deal_slug" component={DealNextSteps} exact />

        {/** Whitelabel Routes * */}
        <PrivateRoute path="/organizations/:org_slug/deals" component={DealsTable} exact />
        <PrivateRoute path="/identity" component={Identity} />
        <PrivateRoute path="/spv-onboarding" component={FreeSPVOnboarding} exact />

        {/** catchall * */}
        <Route path={['*', '/404']} component={NotFound} />
      </Switch>
    </div>
  );
};

const LayOut = () => {
  const ldclient = useLDClient();
  const { isAuthenticated, userProfile } = useAuth();
  const launchDarklyUser = { key: userProfile?._id, email: userProfile?.email };
  if (launchDarklyUser.key && launchDarklyUser.email) {
    ldclient?.identify(launchDarklyUser, userProfile._id);
  }
  const unAuthenticatedStyle = {
    gridTemplateColumns: 'auto',
    gridTemplateAreas: `'mainRoute'`,
  };

  if (isAuthenticated) {
    window.DD_RUM.setUser({ email: userProfile.email });
    window.DD_RUM.startSessionReplayRecording();
  }

  return (
    <CurrentAccountProvider>
      <div className="App" style={!isAuthenticated ? { unAuthenticatedStyle } : {}}>
        <SideBar isAuthenticated={isAuthenticated} />
        <MainApp isAuthenticated={isAuthenticated} />
      </div>
    </CurrentAccountProvider>
  );
};

const FlagApp = () => {
  const Component = withLDProvider({
    clientSideID: process.env.REACT_APP_LAUNCH_DARKLY_ID,
  })(LayOut);

  return <Component />;
};

export default FlagApp;
