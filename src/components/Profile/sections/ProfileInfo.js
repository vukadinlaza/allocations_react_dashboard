import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useAuth } from '../../../auth/useAuth';
import Loader from '../../utils/Loader';

const GET_INVESTOR = gql`
  query GetInvestor($email: String, $_id: String) {
    investor(email: $email, _id: $_id) {
      _id
      first_name
      last_name
      entity_name
      country
      investor_type
      signer_full_name
      accredited_investor_status
      email
      account {
        _id
      }
      accredidation_doc {
        link
        path
      }
      passport {
        link
        path
      }
    }
  }
`;

const ProfileInfo = () => {
  const [investor, setInvestor] = useState(null);
  const [formStatus, setFormStatus] = useState('edit');
  const { userProfile, refetch: refetchUser } = useAuth(GET_INVESTOR);

  console.log('Investor==>', investor);

  useEffect(() => {
    if (userProfile) {
      setInvestor(userProfile);
    }
  }, [userProfile]);

  if (!userProfile.email || !userProfile?.account)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <div className="Profile">
      <h1>Working on profile!</h1>
    </div>
  );
};

export default ProfileInfo;
