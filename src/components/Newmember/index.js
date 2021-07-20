import { useEffect } from 'react';
import { useParams, useHistory, gql } from 'react-router-dom';
import { useMutation } from '@apollo/client';

const CONFIRM_INVITE = gql`
  mutation ConfirmInvitation($accountId: String) {
    confirmInvitation(accountId: $accountId)
  }
`;

export default () => {
  const { accountId } = useParams();
  const history = useHistory();

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
