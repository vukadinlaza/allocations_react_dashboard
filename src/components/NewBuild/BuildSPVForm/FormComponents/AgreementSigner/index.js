import React, { useEffect, useState } from 'react';
import { Button, Paper } from '@material-ui/core';
import { gql, useQuery } from '@apollo/client';
import Typography from '@material-ui/core/Typography';
import bluePenIcon from '../../../../../assets/sign-agreement-blue-pen.svg';
import useStyles from '../../../BuildStyles';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';

const SERVICE_AGREEMENT_LINK = gql`
  query serviceAgreementLink($deal_id: String) {
    serviceAgreementLink: getServiceAgreementLink(deal_id: $deal_id) {
      dataRequestId: id
      tokenId: token_id
      tokenSecret: token_secret
    }
  }
`;

export default function SignDocsForm({ page, setPage, deal }) {
  const history = useHistory();
  const [signed, setSigned] = useState(false);

  const signingModal = (serviceAgreementLink) => {
    // eslint-disable-next-line no-undef
    DocSpring.createVisualForm({
      ...serviceAgreementLink,
      domainVerification: false,
      onSubmit: () => setSigned(true),
    });
  };

  const { data, loading, error, refetch } = useQuery(SERVICE_AGREEMENT_LINK, {
    variables: { deal_id: deal?._id },
  });

  useEffect(() => {
    if (!data?.serviceAgreementLink) refetch({ variables: { deal_id: deal?._id } });
  }, [deal?._id, loading, error]);

  const classes = useStyles();

  return (
    <>
      <Paper className={classes.signContainer}>
        <div>
          <Typography variant="h6" gutterBottom className={classes.sectionHeaderText}>
            Sign your agreements
          </Typography>
          <Typography variant="h6" gutterBottom className={classes.subtitle}>
            Please sign the appropriate agreements to consent us to start creating your deals on
            your behalf
          </Typography>
        </div>
        <Paper
          className={signed ? classes.agreementSignedBox : classes.agreementUnsignedBox}
          style={{ cursor: data && !error ? 'pointer' : 'progress' }}
          onClick={() => (data && !error ? signingModal(data.serviceAgreementLink) : null)}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={bluePenIcon} alt="document icon" />
            <Typography className={classes.itemText} style={{ width: '200px' }}>
              Service Agreement
            </Typography>
          </div>

          <Typography className={signed ? classes.signed : classes.notSigned}>
            {signed ? '• Signed' : '• Not Signed'}
          </Typography>
        </Paper>

        <div className={classes.buttonBox}>
          <Button
            onClick={() => {
              if (!signed) {
                toast.error('Please sign the Service Agreement before continuing');
                return;
              }
              toast.success('Success! Your submission was submitted.');
              localStorage.removeItem('buildData');
              localStorage.removeItem('buildDeal');
              localStorage.removeItem('buildFilesUploaded');
              if (deal?._id) history.push(`/deal-setup?id=${deal._id}`);
            }}
            className={classes.continueButton}
          >
            Complete
          </Button>
          <Typography
            className={classes.previousButton}
            onClick={() => {
              setPage(page - 1);
            }}
          >
            Previous
          </Typography>
        </div>
      </Paper>
    </>
  );
}
