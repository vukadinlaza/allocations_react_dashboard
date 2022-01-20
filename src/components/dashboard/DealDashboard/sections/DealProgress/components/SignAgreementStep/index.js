/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styles from '../../../../styles';
import { AgreementBox } from '../../../../../../NewBuild/BuildDealForm/FormComponents/AgreementSigner';

const GET_INVESTMENT_AGREEMENT = gql`
  query GetFmSignatureLink($deal_id: String) {
    getFmSignatureLink(deal_id: $deal_id) {
      id
      token_id
      token_secret
      link
    }
  }
`;
const signingModal = (agreementLink, isSigned) => {
  DocSpring.createVisualForm({
    ...agreementLink,
    domainVerification: false,
    onSubmit: () => {
      localStorage.removeItem('buildData');
      localStorage.removeItem('buildDeal');
      localStorage.removeItem('buildFilesUploaded');
      isSigned();
      DocSpring.closeModal();
    },
  });
};

const SignAgreementStep = ({ classes, task, deal }) => {
  const [readyToSign, setReadyToSign] = useState(false);
  const [documentSignedStatus, setDocumentSignedStatus] = useState(false);
  const [investmentAgreement, setInvestmentAgreement] = useState({});
  const { data, loading, error, startPolling, stopPolling } = useQuery(GET_INVESTMENT_AGREEMENT, {
    variables: {
      deal_id: deal?._id,
    },
  });

  const newTitle = task?.title?.split(' ');
  newTitle.shift();

  useEffect(() => {
    if (deal._id) {
      startPolling(5000);
    }
    if (data) {
      setInvestmentAgreement({
        dataRequestId: data.getFmSignatureLink.id,
        tokenId: data.getFmSignatureLink.token_id,
        tokenSecret: data.getFmSignatureLink.token_secret,
      });
      setReadyToSign(true);
      stopPolling();
    }
  }, [data]);

  return (
    <>
      {documentSignedStatus ? (
        <CircularProgress />
      ) : (
        <AgreementBox
          title={newTitle.join(' ')}
          task={task}
          classes={classes}
          error={error}
          agreementLink={investmentAgreement}
          createDealLoading={loading}
          readyToSign={readyToSign}
          signingModal={signingModal}
          signed={documentSignedStatus}
          isSigned={() => setDocumentSignedStatus(true)}
        />
      )}
    </>
  );
};

export default withStyles(styles)(SignAgreementStep);
