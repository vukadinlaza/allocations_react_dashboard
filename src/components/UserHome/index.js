import React from 'react';
import { gql } from '@apollo/client';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import NewHome from './newHome';
import Loader from '../utils/Loader';
import './style.scss';

const GET_INVESTOR = gql`
  query GetInvestor($email: String, $_id: String) {
    investor(email: $email, _id: $_id) {
      _id
      name
      first_name
      last_name
      entity_name
      country
      signer_full_name
      accredited_investor_status
      investor_type
      email
      organizations
      admin
      organizations_admin {
        _id
        slug
        name
        logo
      }
      investments {
        _id
        amount
        status
        deal {
          _id
          slug
          company_name
          company_description
          date_closed
          status
          organization {
            _id
            slug
          }
        }
      }
      invitedDeals {
        _id
        slug
        company_name
        company_description
        date_closed
        status
        organization {
          _id
          slug
        }
      }
    }
  }
`;

export default function UserHome(props) {
  const { userProfile, error } = useAuth(GET_INVESTOR);

  if (error) {
    if (error.message === 'GraphQL error: permission denied' && userProfile && userProfile.email) {
      return <Redirect to="/signup" />;
    }
  }

  if (!userProfile.email)
    return (
      <div>
        <Loader />
      </div>
    );

  return <NewHome />;
}
