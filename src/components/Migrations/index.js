import React, { Suspense } from 'react';
import Loader from '../utils/Loader';

const MigrationsLazy = React.lazy(() => import('build/MigrationsHome'));
export default function Migrations() {
  return (
    <Suspense fallback={<Loader />}>
      <MigrationsLazy />{' '}
    </Suspense>
  );
}
