import React, { Suspense } from 'react';
import { useParams } from 'react-router';
import Loader from '../utils/Loader';

const ManageMigrationLazy = React.lazy(() => import('build/ManageMigration'));
export default function ManageMigration() {
  const params = useParams();
  return (
    <Suspense fallback={<Loader />}>
      <ManageMigrationLazy id={params.migration_id} />
    </Suspense>
  );
}
