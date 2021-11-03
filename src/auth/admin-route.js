import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './useAuth';

import Loader from '../components/utils/Loader';

/** *
 *
 * Admin route is for superadmins ONLY, this is enforced by a whitelist
 * the whitelist protects routes from showing, but even if circumvented by changing the list
 * the backend protects the information
 *
 * */

export default function AdminRoute({ component, ...rest }) {
  const { userProfile, loading } = useAuth();

  if (loading)
    return (
      <div>
        <Loader />
      </div>
    );
  if (userProfile.admin) {
    return <Route {...rest} component={component} />;
  }
  return <Redirect to="/" />;
}
