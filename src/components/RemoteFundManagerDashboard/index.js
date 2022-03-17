import React, { Suspense } from 'react';
import { Redirect, useHistory, useParams } from 'react-router';
import Loader from '../utils/Loader';

const ManagerDashboard = React.lazy(() => import('build/FundManagerDashboard'));

export default function RemoteFundManagerDashboard() {
  const history = useHistory();
  const { organization } = useParams();

  return (
    <Suspense fallback={<Loader />}>
      <ManagerDashboard
        orgSlug={organization}
        pushToDealPage={(deal_id) => history.push(`/admin/${organization}/deals/${deal_id}`)}
        pushToCreateNewDealPage={() => history.push(`/admin/${organization}/deal/new`)}
        pushToAddNewOrgAdminPage={() => history.push(`/admin/${organization}/manager`)}
        redirectTo404={() => <Redirect to="/404" />}
      />
    </Suspense>
  );
}
