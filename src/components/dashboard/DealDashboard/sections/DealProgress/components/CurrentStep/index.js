/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { gql, useLazyQuery } from '@apollo/client';
import { Grid, Typography } from '@material-ui/core';
import allocationsIcon from '../../../../../../../assets/for-allocations-icon.svg';
import forYouIcon from '../../../../../../../assets/for-you-icon.svg';
import grayCheck from '../../../../../../../assets/gray-check.svg';
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

const defaultDesc =
  'An Allocations representative will be reaching out shortly to assist you in completing this step. If you have any questions, do not hesitate to contact support@allocations.com.';

const CurrentStep = ({ classes, phase, task, deal }) => {
  const [readyToSign, setReadyToSign] = useState(false);
  const [documentSignedStatus, setDocumentSignedStatus] = useState(false);
  const [investmentAgreement, setInvestmentAgreement] = useState({});
  const forFM = !task?.type?.includes('process');
  const isAgreementSigner = task?.title?.includes('Sign Investment Agreement');
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
    },
  );

  useEffect(() => {
    if (deal._id && isAgreementSigner) {
      getInvestmentAgreement();
    }
  }, [deal, isAgreementSigner]);

  return (
    <Grid container className={classes.currentStepBody}>
      <div className={classes.stepTitleRow}>
        <img alt="gray check" src={grayCheck} />
        <Typography>
          {phase && `${phase}:`} {task?.title}
        </Typography>
        <img
          alt={forFM ? 'for you icon' : 'allocations icon'}
          src={forFM ? forYouIcon : allocationsIcon}
        />
      </div>
      {isAgreementSigner && (
        <AgreementBox
          title={task.title}
          task={task}
          classes={classes}
          agreementLink={investmentAgreement}
          createDealLoading={loading}
          readyToSign={readyToSign}
          signingModal={signingModal}
          signed={documentSignedStatus}
          isSigned={() => setDocumentSignedStatus(true)}
        />
      )}
      <Typography style={{ fontSize: '12px', textAlign: 'left', width: '100%' }}>
        {forFM ? 'Something else happens' : defaultDesc}
      </Typography>
    </Grid>
  );
};

export default withStyles(styles)(CurrentStep);
