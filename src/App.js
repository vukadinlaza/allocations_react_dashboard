import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Cohere from 'cohere-js';
import AdminRoute from './auth/admin-route';
import PrivateRoute from './components/PrivateRoute';
import Faq from './components/Faq';
import Deal from './components/Deal';
import Deals from './components/Deals';
import Credit from './components/Credit';
import DealNew from './components/DealNew';
import DealEdit from './components/DealEdit';
import InvestorEdit from './components/InvestorEdit';
import InvestorNew from './components/InvestorNew';
import Indentity from './components/Identity';
import Funds from './components/Funds';
import Sidebar from './components/Sidebar';
import UserHome from './components/UserHome';
import Invest from './components/Invest';
import Investors from './components/Investors';
import InvitedDeals from './components/InvitedDeals';
import Investments from './components/Investments';
import InvestmentNew from './components/InvestmentNew';
import InvestmentEdit from './components/InvestmentEdit';
import UserInvestments from './components/UserInvestments';
import FreeSPVOnboarding from './components/FreeSPVOnboarding';
import Profile from './components/Profile';
import Marketplace from './components/Marketplace';
import OrganizationNew from './components/OrganizationNew';
import OrganizationMembers from './components/OrganizationMembers';
import ThankYou from './components/ThankYou/index';
import DealDocuments from './components/DealDocuments';

// superadmin
import SuperAdminManager from './components/superadmin/Manager';
import SuperAdminOverview from './components/superadmin/Overview';

// admin
import AdminHome from './components/admin/AdminHome';
import Compliance from './components/admin/Compliance';
import MasterFiling from './components/admin/MasterFiling';

// allocationsX
import AllocationsX from './allocationsX/Home';
import DealExchange from './allocationsX/DealExchange';
import AdminExchangeOverview from './allocationsX/AdminOverview';
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
      <Sidebar>
        <Switch>
          <Route path="/cb/thankyou" component={ThankYou} exact />

          <PrivateRoute path="/" exact component={UserHome} />
          <PrivateRoute path="/invest" exact component={Invest} />
          <PrivateRoute path="/credit" exact component={Credit} />
          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute path="/marketplace" component={Marketplace} />
          <PrivateRoute path="/investments" component={UserInvestments} />
          <PrivateRoute path="/invited-deals" component={InvitedDeals} />
          <PrivateRoute path="/identity" component={Indentity} />
          <PrivateRoute path="/dealdocs" component={DealDocuments} />

          {/** Onboarding * */}
          <Route path="/getting-started" component={Faq} exact />
          <PrivateRoute path="/spv-onboarding" component={FreeSPVOnboarding} exact />

          {/** Deals * */}
          <Redirect from="/public/:organization/deals/:deal_slug" to="/deals/:deal_slug" />
          <PrivateRoute path="/deals/:deal_slug" component={Deal} exact />
          <PrivateRoute path="/deals/:organization/:deal_slug" component={Deal} exact />

          {/** AllocationsX * */}
          <PrivateRoute path="/exchange" component={AllocationsX} exact />
          <PrivateRoute path="/exchange/:deal" component={DealExchange} exact />
          <AdminRoute path="/admin/:organization/exchange" component={AdminExchangeOverview} exact />

          <PrivateRoute path="/investor/:id/home" component={UserHome} />
          <AdminRoute path="/investor/:id/investments" component={UserInvestments} />
          <AdminRoute path="/investors/new" component={InvestorNew} exact />
          <AdminRoute path="/investor/:id/edit" component={InvestorEdit} />
          <AdminRoute path="/admin/investment/new" component={InvestmentNew} exact />
          <AdminRoute path="/admin/:organization/investments/:id/edit" component={InvestmentEdit} exact />
          <AdminRoute path="/admin/organizations/new" component={OrganizationNew} exact />

          {/** SuperAdmin * */}
          <AdminRoute path="/superadmin" component={SuperAdminOverview} exact />
          <AdminRoute path="/admin/:organization/manager" component={SuperAdminManager} exact />

          {/** Whitelabel Routes * */}
          <PrivateRoute path="/admin/funds" component={Funds} exact />
          <PrivateRoute path="/admin/:organization" component={AdminHome} exact />
          <AdminRoute path="/admin/:organization/members" component={OrganizationMembers} exact />

          <PrivateRoute path="/admin/:organization/deals" component={Deals} exact />
          <PrivateRoute path="/admin/:organization/deal/new" component={DealNew} exact />
          <PrivateRoute path="/admin/:organization/deals/:id/edit" component={DealEdit} exact />

          <PrivateRoute path="/admin/:organization/investments" component={Investments} exact />
          <PrivateRoute path="/admin/:organization/compliance" component={Compliance} exact />
          <PrivateRoute path="/admin/:organization/master-filing" component={MasterFiling} exact />
          <AdminRoute path="/admin/:organization/investors" component={Investors} exact />

          {/** catchall * */}
          <PrivateRoute path="/" component={UserHome} />
        </Switch>
      </Sidebar>
    </AuthorizedApolloProvider>
  );
};

export default App;
