import React, { useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useParams, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

const CONFIRM_INVITE = gql`
  mutation ConfirmInvitation($accountId: String) {
    confirmInvitation(accountId: $accountId)
  }
`;

export default () => {
  const { accountId } = useParams();
  const history = useHistory();
  console.log('ACCOUNTID', accountId);

  const [confirmInvitation, { called }] = useMutation(CONFIRM_INVITE);
  useEffect(() => {
    if (!called) {
      confirmInvitation({
        onCompleted: history.push('/'),
        variables: { accountId },
      });
    }
  });
  return null;
};
