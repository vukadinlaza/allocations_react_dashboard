import React, { Suspense } from 'react';
import Loader from '../utils/Loader';

const TaxBanner = React.lazy(() => import('tax/Banner'));

export default function RemoteTaxBanner() {
  return (
    <Suspense fallback={<Loader />}>
      <TaxBanner to="/tax-activity" />
    </Suspense>
  );
}
