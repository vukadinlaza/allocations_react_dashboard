import React from "react";
import { Route, Redirect } from "react-router-dom"
import { useAuth } from "useAuth";
import {gql} from 'apollo-boost'

import Loader from '../components/utils/Loader'

/***
 *
 * Admin route is for superadmins ONLY, this is enforced by a whitelist
 * the whitelist protects routes from showing, but even if circumvented by changing the list
 * the backend protects the information
 *
 **/

const GET_INVESTOR = gql`
  {
    investor {
      _id
      name
      admin
      organizations_admin {
        _id
        slug
        name
        logo
      }
    }
  }
`

export default function AdminRoute ({ component, ...rest }) {
  const {userProfile} = useAuth(GET_INVESTOR);

  if (!userProfile) return <Loader />

  if (userProfile && userProfile.admin) {
    return <Route {...rest} component={component} />
  } else {
    return <Redirect to="/" />
  }
}
