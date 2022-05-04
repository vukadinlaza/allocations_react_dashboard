import React, { Suspense } from 'react';
import { useParams } from 'react-router';
import Loader from '../utils/Loader';

const AddOrgAdmin = React.lazy(() => import('build/AddOrgAdmin'));

const RemoteAddOrgAdmin = () => {
  const { organization } = useParams();
  return (
    <Suspense fallback={<Loader />}>
      <AddOrgAdmin orgSlug={organization} />
    </Suspense>
  );
};

export default RemoteAddOrgAdmin;
