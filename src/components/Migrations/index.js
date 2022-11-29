import React, { Suspense } from 'react';
import { useHistory } from 'react-router';
import Loader from '../utils/Loader';

const MigrationsLazy = React.lazy(() => import('build/MigrationsHome'));
export default function Migrations() {
  const history = useHistory();
  return (
    <Suspense fallback={<Loader />}>
      <MigrationsLazy redirect={(id) => history.push(`/migrations/${id}`)} />
    </Suspense>
  );
}
