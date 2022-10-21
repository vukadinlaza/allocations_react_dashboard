import React, { Suspense } from 'react';
import Loader from '../utils/Loader';

const CreatePassport = React.lazy(() => import('invest/CreatePassport'));

export default function RemoteCreatePassport() {
  return (
    <Suspense fallback={<Loader />}>
      <CreatePassport />
    </Suspense>
  );
}
