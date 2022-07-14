import React, { Suspense } from 'react';
import { useHistory } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';

const RemoteBuild = React.lazy(() => import('build/Build'));

export default function Build() {
  const { userProfile } = useAuth();
  const history = useHistory();

  const handleCreate = (deal) => {
    history.push(`/admin/${deal.organization_slug}/deals/${deal._id}`);
  };

  return (
    <>
      <Suspense fallback={<Loader />}>
        <RemoteBuild
          user={userProfile}
          onCreate={(deal) => {
            handleCreate(deal);
          }}
        />
      </Suspense>
    </>
  );
}
