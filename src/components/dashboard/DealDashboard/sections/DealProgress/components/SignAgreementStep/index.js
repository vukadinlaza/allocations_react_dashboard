/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { withStyles } from '@material-ui/core/styles';
import styles from '../../../../styles.ts';
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
  const [getInvestmentAgreement, { loading, error, data }] = useLazyQuery(
    GET_INVESTMENT_AGREEMENT,
    {
      variables: {
        deal_id: deal?._id,
      },
      onCompleted: (res) => {
        console.log(res, 'res');
        setReadyToSign(true);
        setInvestmentAgreement({
          dataRequestId: res.getFmSignatureLink.id,
          tokenSecret: res.getFmSignatureLink.token_secret,
          tokenId: res.getFmSignatureLink.token_id,
        });
      },
      onError: (err) => console.log(err),
    },
  );

  const newTitle = task?.title?.split(' ');
  newTitle.shift();

  useEffect(() => {
    if (deal._id) {
      getInvestmentAgreement();
    }
  }, [deal]);

  return (
    <AgreementBox
      title={newTitle.join(' ')}
      task={task}
      classes={classes}
      agreementLink={investmentAgreement}
      createDealLoading={loading}
      readyToSign={readyToSign}
      signingModal={signingModal}
      signed={documentSignedStatus}
      isSigned={() => setDocumentSignedStatus(true)}
    />
  );
};

export default withStyles(styles)(SignAgreementStep);
