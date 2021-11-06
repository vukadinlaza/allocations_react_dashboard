import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Paper } from '@material-ui/core';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
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
const GET_DOCUMENT = gql`
  query getDealDocService($task_id: String) {
    getDealDocService(task_id: $task_id) {
      _id
      title
      link
      createdAt
    }
  }
`;

export default function SignDocsForm({ page, setPage, deal, updatedDeal, updatedDealLoading }) {
  const history = useHistory();
  const [signed, setSigned] = useState(false);

  const signingModal = (serviceAgreementLink) => {
    // eslint-disable-next-line no-undef
    DocSpring.createVisualForm({
      ...serviceAgreementLink,
      domainVerification: false,
      onSubmit: () => {
        localStorage.removeItem('buildData');
        localStorage.removeItem('buildDeal');
        localStorage.removeItem('buildFilesUploaded');
        setSigned(true);
      },
    });
  };

  const [getServiceAgreementLink, { data, loading: agreementLinkLoading, error }] = useLazyQuery(
    SERVICE_AGREEMENT_LINK,
    {
      variables: { deal_id: deal?._id },
      fetchPolicy: 'network-only',
    },
  );

  const phase = updatedDeal?.setBuildInfo?.phases.find((phase) => phase.name === 'build');
  const task = phase?.tasks?.find((task) => task.title === 'Sign Service Agreement');

  const [getSignedServiceAgreement, { data: serviceAgreementDocUrl, loading: signedDocLoading }] =
    useLazyQuery(GET_DOCUMENT, { variables: { task_id: task?._id }, fetchPolicy: 'network-only' });

  useEffect(() => {
    if (updatedDeal) getServiceAgreementLink();
  }, [updatedDeal, error]);

  useEffect(() => {
    if (signed) getSignedServiceAgreement();
  }, [signed]);

  const classes = useStyles();
  const loading = updatedDealLoading || agreementLinkLoading || signedDocLoading;
  const readyToSign = data && !error && !loading;

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
          style={{ cursor: readyToSign && 'pointer', pointerEvents: !readyToSign && 'none' }}
          onClick={() => (readyToSign ? !signed && signingModal(data.serviceAgreementLink) : null)}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {!data || loading || error ? (
              <CircularProgress />
            ) : (
              <div className={classes.serviceAgreementIconBox}>
                <img src={bluePenIcon} alt="document icon" />
              </div>
            )}

            <Typography className={classes.itemText} style={{ width: '200px' }}>
              {!updatedDeal ? (
                'Building your deal...'
              ) : agreementLinkLoading ? (
                'Almost done...'
              ) : serviceAgreementDocUrl?.getDealDocService?.link ? (
                <a href={serviceAgreementDocUrl?.getDealDocService?.link} target="_blank">
                  Service Agreement
                </a>
              ) : (
                'Service Agreement'
              )}
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
              history.push(`/deal-setup?id=${deal._id}`);
            }}
            className={classes.continueButton}
          >
            Complete
          </Button>
          {!signed && (
            <Typography
              className={classes.previousButton}
              onClick={() => {
                setPage(page - 1);
              }}
            >
              Previous
            </Typography>
          )}
        </div>
      </Paper>
    </>
  );
}
