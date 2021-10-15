import React, { useState } from 'react';
import { Button, Paper } from '@material-ui/core';
import { gql, useQuery } from '@apollo/client';
import Typography from '@material-ui/core/Typography';
import CheckCircle from '../../../../../assets/check_circle_black_24dp.svg';
import Loader from '../../../../../assets/loading.svg';
import buildDoc from '../../../../../assets/buildDoc.svg';
import useStyles from '../../../BuildStyles';

const SERVICE_AGREEMENT_LINK = gql`
  query serviceAgreementLink($deal_id: String) {
    serviceAgreementLink: getServiceAgreementLink(deal_id: $deal_id) {
      dataRequestId: id
      tokenId: token_id
      tokenSecret: token_secret
    }
  }
`;

const signingModal = (serviceAgreementLink) => {
  // eslint-disable-next-line no-undef
  DocSpring.createVisualForm({
    ...serviceAgreementLink,
    domainVerification: false,
  });
};

export default function SignDocsForm({ page, setPage, deal }) {
  const classes = useStyles();
  const [iconsChecked, setIconsChecked] = useState({});
  const { data } = useQuery(SERVICE_AGREEMENT_LINK, { variables: { deal_id: deal?._id } });

  return (
    <>
      <Paper className={classes.paper}>
        <Typography variant="h6" gutterBottom className={classes.sectionHeaderText}>
          Sign your agreements
        </Typography>
        <Typography variant="h6" gutterBottom className={classes.subtitle}>
          Please sign the appropriate agreements to consent to us to start creating your deals on
          your behalf
        </Typography>
        <Paper
          className={`${iconsChecked.one ? classes.selected : ''} ${classes.item}`}
          style={{ cursor: data ? 'pointer' : 'progress' }}
          onClick={() => (data ? signingModal(data.serviceAgreementLink) : null)}
        >
          <img src={buildDoc} alt="document icon" className={classes.documentIcon} />
          <Typography className={classes.itemText}>Service Agreement</Typography>
          <img
            src={data ? CheckCircle : Loader}
            className={classes.checkCircle}
            alt="checkbox"
            style={{ opacity: iconsChecked.one ? '1' : '' }}
          />
        </Paper>
        <Button
          onClick={() => {
            setPage(page + 1);
          }}
          className={classes.continueButton}
        >
          Continue
        </Button>
        <Typography
          className={classes.previousButton}
          onClick={() => {
            setPage(page - 1);
          }}
        >
          Previous
        </Typography>
      </Paper>
    </>
  );
}
