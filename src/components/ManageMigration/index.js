import React, { Suspense } from 'react';
import { useHistory, useParams } from 'react-router';
import Loader from '../utils/Loader';

const ManageMigrationLazy = React.lazy(() => import('build/ManageMigration'));
export default function ManageMigration() {
  const params = useParams();
  const history = useHistory();
  return (
    <Suspense fallback={<Loader />}>
      <ManageMigrationLazy id={params.migration_id} redirect={(path) => history.push(path)} />
    </Suspense>
  );
}
