import React, { useEffect, useState } from 'react';
import { gql } from 'apollo-boost';
import { pick } from 'lodash';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { Button, Typography } from '@material-ui/core';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';
import { PassportUploader } from '../forms/InvestorEdit/index';

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

const UPDATE_USER = gql`
  mutation UpdateUser($investor: UserInput!) {
    updateUser(input: $investor) {
      _id
      first_name
      last_name
      country
      entity_name
      investor_type
      signer_full_name
      accredited_investor_status
      email
      passport {
        link
        path
      }
    }
  }
`;

const IdentityUpload = () => {
  const [investor, setInvestor] = useState(null);
  const [updateInvestor] = useMutation(UPDATE_USER);
  const { userProfile, refetch } = useAuth(GET_INVESTOR);

  useEffect(() => {
    if (userProfile) {
      setInvestor(userProfile);
    }
  }, [userProfile]);

  const submit = () => {
    return updateInvestor({
      variables: {
        investor: pick(investor, ['_id', 'email', 'passport']),
      },
      onCompleted: toast.success('Success'),
    });
  };

  if (!userProfile.email)
    return (
      <div>
        <Loader />
      </div>
    );
  return (
    <>
      <Typography variant="h6">After uploading your file please press submit</Typography>
      <PassportUploader investor={investor} setInvestor={setInvestor} />
      <Button variant="contained" style={{ marginTop: 16 }} onClick={submit} color="primary">
        Submit
      </Button>
    </>
  );
};

export default IdentityUpload;
