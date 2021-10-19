import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Cohere from 'cohere-js';
import AdminRoute from './auth/admin-route';
import PrivateRoute from './components/PrivateRoute';
import Faq from './components/Faq';
import Deals from './components/Deals';
import Credit from './components/Credit';
import DealNew from './components/DealNew';
import DealEditNew from './components/DealEditNew';
import InvestorEdit from './components/InvestorEdit';
import InvestorNew from './components/InvestorNew';
import Identity from './components/Identity';
import Build from './components/Build';
import Sidebar from './components/Sidebar';
import UserHome from './components/UserHome';
import Investors from './components/Investors';
import InvitedDeals from './components/InvitedDeals';
import Investments from './components/Investments';
import InvestmentNew from './components/InvestmentNew';
import InvestmentEdit from './components/InvestmentEdit';
import UserInvestments from './components/UserInvestments';
import FreeSPVOnboarding from './components/FreeSPVOnboarding';
import Profile from './components/Profile/Profile';
import Marketplace from './components/Marketplace';
import OrganizationNew from './components/OrganizationNew';
import OrganizationMembers from './components/OrganizationMembers';
import DealDocuments from './components/DealDocuments';
import NewMember from './components/Newmember';
import DealTable from './components/DealsTable';
import NotFound from './components/NotFound';

// superadmin
import SuperAdminManager from './components/superadmin/Manager';
import SuperAdminOverview from './components/superadmin/Overview';
import User from './components/Settings/User';
import Investment from './components/Settings/Investment';
import InvestorInvestments from './components/Funds/sections/InvestorInvestments';

// admin
import FundManagerDashboard from './components/admin/FundManagerDashboard';
import Compliance from './components/admin/Compliance';
import MasterFiling from './components/admin/MasterFiling';

import AuthorizedApolloProvider from './apollo-client-comp';
import './App.scss';
import './utils/initFontAwesome';
import TeamMap from './components/TeamMap/TeamMap';
import DealNextSteps from './components/DealNextSteps/DealNextSteps';
import DealLandingPage from './components/DealOneClick/LandingPage/LandingPage';
import InvestmentPage from './components/DealOneClick/InvestmentPage/InvestmentPage';

// test
import BuildSPVForm from './components/NewBuild/BuildSPVForm/index';
import BuildFundForm from './components/NewBuild/BuildFundForm/index';

import Upgrade from './components/upgrade';
import PaymentForm from './components/billing';
import WireActivity from './components/WireActivity';
import TaxActivity from './components/TaxActivity';
import DealSetup from './components/DealSetup';

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
            {/* <PrivateRoute path="/demo" exact component={Demo} /> */}
            <PrivateRoute path="/credit" exact component={Credit} />
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/get-started" component={Build} />
            <PrivateRoute path="/marketplace" component={Marketplace} />
            <PrivateRoute path="/investments" component={UserInvestments} />
            <PrivateRoute path="/invited-deals" component={InvitedDeals} />
            <PrivateRoute path="/deal-setup" component={DealSetup} />
            <PrivateRoute path="/identity" component={Identity} />
            <PrivateRoute path="/dealdocs" component={DealDocuments} />
            <PrivateRoute path="/newMember/:accountId" component={NewMember} />
            <PrivateRoute path="/upgrade" component={Upgrade} />
            <PrivateRoute path="/billing" component={PaymentForm} />

            {/** Onboarding * */}
            <Route path="/getting-started" component={Faq} exact />
            <PrivateRoute path="/spv-onboarding" component={FreeSPVOnboarding} exact />

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
            <AdminRoute path="/investor/:id/investments" component={UserInvestments} />
            <AdminRoute path="/investors/new" component={InvestorNew} exact />
            <AdminRoute path="/investor/:id/edit" component={InvestorEdit} />
            <AdminRoute path="/admin/investment/new" component={InvestmentNew} exact />
            <AdminRoute
              path="/admin/:organization/investments/:id/edit"
              component={InvestmentEdit}
              exact
            />
            <AdminRoute path="/admin/organizations/new" component={OrganizationNew} exact />
            <AdminRoute path="/admin/employee-map" component={TeamMap} exact />

            {/** SuperAdmin * */}
            <AdminRoute path="/superadmin" component={SuperAdminOverview} exact />
            <AdminRoute path="/admin/:organization/manager" component={SuperAdminManager} exact />
            <AdminRoute path="/admin/users/:userId" component={User} exact />
            <AdminRoute
              path="/admin/users/:userId/investments"
              component={InvestorInvestments}
              exact
            />
            <AdminRoute path="/admin/investments/:investmentId" component={Investment} exact />

            {/** Whitelabel Routes * */}
            <PrivateRoute path="/admin/type/:type" component={DealTable} exact />
            <PrivateRoute path="/admin/type/:type" component={DealTable} exact />
            <PrivateRoute path="/wire-activity" component={WireActivity} exact />
            <PrivateRoute path="/tax-activity" component={TaxActivity} exact />
            <PrivateRoute path="/admin/:organization" component={FundManagerDashboard} exact />
            <AdminRoute path="/admin/:organization/members" component={OrganizationMembers} exact />

            <PrivateRoute path="/admin/:organization/deals" component={Deals} exact />
            <PrivateRoute path="/admin/:organization/deal/new" component={DealNew} exact />
            <PrivateRoute
              path="/admin/:organization/deals/:id/edit"
              component={DealEditNew}
              exact
            />

            <PrivateRoute path="/admin/:organization/investments" component={Investments} exact />
            <PrivateRoute path="/admin/:organization/compliance" component={Compliance} exact />
            <PrivateRoute
              path="/admin/:organization/master-filing"
              component={MasterFiling}
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
