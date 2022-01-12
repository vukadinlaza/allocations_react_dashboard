import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { gql, useLazyQuery } from '@apollo/client';
import { Grid, Typography } from '@material-ui/core';
import allocationsIcon from '../../../../../../../assets/allocations_bar_logo.svg';
import grayCheck from '../../../../../../../assets/gray-check.svg';
import profile from '../../../../../../../assets/profile-icon.svg';
import styles from '../../../../styles.ts';
import { AgreementBox } from '../../../../../../NewBuild/BuildDealForm/FormComponents/AgreementSigner';

const GET_INVESTMENT_AGREEMENT = gql`
  query GetServicesAgreementLink($deal_id: String) {
    getServicesAgreementLink(deal_id: $deal_id) {
      id
      link
    }
  }
`;

const defaultDesc =
  'An Allocations representative will be reaching out shortly to assist you in completing this step. If you have any questions, do not hesitate to contact support@allocations.com.';

const CurrentStep = ({ classes, phase, task, deal }) => {
  const forFM = !task?.type?.includes('process');
  const isAgreementSigner = task?.title?.includes('Sign');
  const [getDocument, { loading, error, data }] = useLazyQuery(GET_INVESTMENT_AGREEMENT, {
    variables: {
      deal_id: deal?._id,
    },
  });

  useEffect(() => {
    if (deal?._id) getDocument();
    console.log(deal, 'deal data');
    console.log(data, 'DATA');
  }, [task]);

  return (
    <Grid container className={classes.currentStepBody}>
      <div className={classes.stepTitleRow}>
        <img alt="gray check" src={grayCheck} />
        <Typography>
          {phase && `${phase}:`} {task?.title}
        </Typography>
        <div className={forFM ? classes.badgeGray : classes.badgeBlue}>
          <img alt="icon" src={forFM ? profile : allocationsIcon} style={{ height: '12px' }} />
          <span>{forFM ? 'For You' : 'For Allocations'}</span>
        </div>
      </div>
      {isAgreementSigner && <AgreementBox title={task.title} task={task} classes={classes} />}
      <Typography style={{ fontSize: '12px', textAlign: 'left', width: '100%' }}>
        {forFM ? 'Something else happens' : defaultDesc}
      </Typography>
    </Grid>
  );
};

export default withStyles(styles)(CurrentStep);
