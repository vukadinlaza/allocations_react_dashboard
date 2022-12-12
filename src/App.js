import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Cohere from 'cohere-js';
import { withLDProvider, useLDClient, useFlags } from 'launchdarkly-react-client-sdk';

import FundManagerDashboard from './components/dashboard/FundManagerDashboard';
import InvestorDashboard from './components/dashboard/InvestorDashboard';

import AdminRoute from './auth/admin-route';
import PrivateRoute from './components/PrivateRoute';
import Faq from './components/Faq';
import Deals from './components/AllDeals';
import DealEditNew from './components/DealEditNew';
import Sidebar from './components/Sidebar';
import ProfilePage from './components/Profile/ProfilePage';
import Profile from './components/Profile';
import OrganizationNew from './components/OrganizationNew';
import OrganizationMembers from './components/OrganizationMembers';
import NotFound from './components/NotFound';
import SubmitTaxDocs from './components/SubmitTaxDocs';
import Demo from './components/Demo';
// admin

import DealNextSteps from './components/DealNextSteps/DealNextSteps';
import SuperAdminManager from './components/superadmin/Manager';
import DealOneClick from './components/DealOneClick';

// test
import RemotePostBuild from './components/RemotePostBuild';

import './utils/initFontAwesome';
import { CurrentAccountProvider } from './state/current-organization';
import Identity from './components/Identity';
import { useAuth } from './auth/useAuth';
import DealDashboard from './components/dashboard/DealDashboard';
import RemoteFundManagerDashboard from './components/RemoteFundManagerDashboard';
import RemoteTaxDashboard from './components/TaxDashboard';
import SidebarOld from './components/SidebarOld';
import RemoteAddOrgAdmin from './components/RemoteAddOrgAdmin';

import RemoteTaxBanner from './components/RemoteTaxBanner';
import InvestFlow from './components/InvestFlow';
import useStyles from './styles';
import HolidayBanner from './components/HolidayBanner';
import InvestmentNew from './components/InvestmentNew';
import RemoteBuildV2 from './components/RemoteBuildV2';
import RemoteNewLead from './components/RemoteNewLead';
import RemoteBuildProduct from './components/RemoteBuildProduct';
import RemoteManagePassport from './components/RemoteManagePassport';
import AssureMigrations from './components/AssureMigrations';
import MigrationsSubscription from './components/AssureMigrations/SubscriptionPage';
import Stripe from './components/AssureMigrations/Stripe';
import Migrations from './components/Migrations';
import ManageMigration from './components/ManageMigration';

Cohere.init('Ywm0QKbP1exHuFEdx62GynbW');

/** *
 *
 * App.js sets up the routing for all the components, wrapping
 * with auth where appropriate {AdminRoute, PrivateRoute}
 *
 * */

const SideBar = ({ isAuthenticated }) => {
  const { federatedSidebar } = useFlags();
  const styles = useStyles({ isAuthenticated });
  return <div className={styles.sidebar}>{federatedSidebar ? <Sidebar /> : <SidebarOld />}</div>;
};

const MainApp = ({ isAuthenticated }) => {
  const { remoteFundManagerDashboard, holidayBannerContent } = useFlags();
  const styles = useStyles({ isAuthenticated });

  return (
    <div className={styles.mainRoute}>
      {holidayBannerContent && <HolidayBanner />}
      <RemoteTaxBanner />
      <Switch>
        {/* Allocations Admin Routes */}
        <AdminRoute
          path="/admin/:organization/manager"
          component={remoteFundManagerDashboard ? RemoteAddOrgAdmin : SuperAdminManager}
          exact
        />
        <AdminRoute path="/admin/:organization/members" component={OrganizationMembers} exact />
        <AdminRoute path="/admin/organizations/new" component={OrganizationNew} exact />
        <AdminRoute path="/admin/investment/new" component={InvestmentNew} exact />

        <AdminRoute path="/admin/organization-onboarding" exact component={RemoteBuildV2} />
        <AdminRoute path="/admin/stripe" component={Stripe} exact />
        {/* Organization Admin */}
        <PrivateRoute
          path="/admin/:organization"
          component={remoteFundManagerDashboard ? RemoteFundManagerDashboard : FundManagerDashboard}
          exact
        />
        <PrivateRoute path="/admin/:organization/deals" component={Deals} exact />
        <PrivateRoute path="/admin/:organization/deals/:id/edit" component={DealEditNew} exact />
        <PrivateRoute path="/admin/:organization/deals/:deal_id" component={DealDashboard} exact />

        {/* Investor */}
        <PrivateRoute path="/" exact component={InvestorDashboard} />
        <PrivateRoute path="/investor/:id/home" component={InvestorDashboard} />
        <PrivateRoute path="/submit-tax-documents" component={SubmitTaxDocs} />
        <PrivateRoute path="/tax-activity" component={RemoteTaxDashboard} />
        <PrivateRoute path="/demo" component={Demo} />
        <PrivateRoute path="/profile/:id" component={ProfilePage} />
        <PrivateRoute path="/profile" component={Profile} />
        <PrivateRoute path="/migrations" component={Migrations} exact />
        <PrivateRoute path="/migrations/:migration_id" component={ManageMigration} exact />

        {/** Onboarding * */}
        <Route path="/getting-started" component={Faq} exact />
        <Route path="/public/getting-started" component={RemoteNewLead} exact />
        <Route path="/public/assure-migrations" component={AssureMigrations} exact>
          <Redirect to="/migrations" />
        </Route>
        <Route
          path="/public/assure-migrations/subscription"
          component={MigrationsSubscription}
          exact
        />

        {/** Deals * */}
        {/* Public */}

        <PrivateRoute path="/build" component={RemoteBuildProduct} exact />

        {/* Private  */}
        <PrivateRoute path="/new-build/deal" exact component={RemotePostBuild} />
        <PrivateRoute path="/deals/:organization/:deal_slug" component={DealOneClick} exact />
        <PrivateRoute path="/deals/:deal_slug" component={DealOneClick} exact />

        {/* Invest */}
        <PrivateRoute path="/invest/:deal_id" component={InvestFlow} exact />
        <PrivateRoute path="/invest/:deal_id/:investment_id" component={InvestFlow} exact />

        {/* Next Steps page */}
        <PrivateRoute path="/next-steps/:deal_slug" component={DealNextSteps} exact />
        <PrivateRoute path="/next-steps/:organization/:deal_slug" component={DealNextSteps} exact />

        {/** Whitelabel Routes * */}
        <PrivateRoute path="/identity" component={Identity} />

        <PrivateRoute path="/passports/manage" component={RemoteManagePassport} />
        {/* Redirects */}
        <Redirect from="/public/new-build" to="/public/getting-started" />

        {/** catchall * */}
        <Route path={['*', '/404']} component={NotFound} />
      </Switch>
    </div>
  );
};

const LayOut = () => {
  const ldclient = useLDClient();
  const { isAuthenticated, userProfile } = useAuth();
  const styles = useStyles({ isAuthenticated });
  const launchDarklyUser = { key: userProfile?._id, email: userProfile?.email };
  if (launchDarklyUser.key && launchDarklyUser.email) {
    ldclient?.identify(launchDarklyUser, userProfile._id);
  }

  if (isAuthenticated) {
    window.DD_RUM.setUser({ email: userProfile.email });
    window.DD_RUM.startSessionReplayRecording();
  }

  return (
    <CurrentAccountProvider>
      <div className={styles.app}>
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
