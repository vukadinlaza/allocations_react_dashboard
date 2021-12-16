import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Paper } from '@material-ui/core';
import { gql, useLazyQuery } from '@apollo/client';
import Typography from '@material-ui/core/Typography';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import bluePenIcon from '../../../../../assets/sign-agreement-blue-pen.svg';
import useStyles from '../../../BuildStyles';

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

const AgreementBox = ({
  loading,
  error,
  readyToSign,
  signingModal,
  agreementLink,
  signed,
  setSigned,
  classes,
  title,
}) => {
  return (
    <Paper
      className={signed ? classes.agreementSignedBox : classes.agreementUnsignedBox}
      style={{
        cursor: readyToSign && !signed && 'pointer',
        pointerEvents: !readyToSign && 'none',
      }}
      onClick={() => readyToSign && signingModal(agreementLink, setSigned)}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {loading || error ? (
          <CircularProgress />
        ) : (
          <div className={classes.serviceAgreementIconBox}>
            <img src={bluePenIcon} alt="document icon" />
          </div>
        )}

        <Typography className={classes.itemText} style={{ width: '200px' }}>
          {/* {!updatedDeal ? (
                'Building your deal...'
              ) : agreementLinkLoading ? (
                'Almost done...'
              ) : serviceAgreementDocUrl?.getDealDocService?.link ? (
                <a
                  href={serviceAgreementDocUrl?.getDealDocService?.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  Service Agreement
                </a>
              ) : (
                'Service Agreement'
              )} */}
          {loading ? 'Loading...' : title}
        </Typography>
      </div>

      <Typography className={signed ? classes.signed : classes.notSigned}>
        {signed ? '• Signed' : '• Not Signed'}
      </Typography>
    </Paper>
  );
};

export default function SignDocsForm({
  dealIdAndDocumentData = {},
  createDealLoading,
  error,
  page,
  setPage,
}) {
  const history = useHistory();
  const { deal, documents } = dealIdAndDocumentData;
  const [serviceAgreementLink, advisoryAgreementLink] = documents || [];

  const [serviceAgreementSigned, setServiceAgreementSigned] = useState(false);
  const [advisoryAgreementSigned, setAdvisoryAgreementSigned] = useState(false);

  const allSigned = serviceAgreementSigned && advisoryAgreementSigned;

  const signingModal = (agreementLink, setSigned) => {
    // eslint-disable-next-line no-undef
    DocSpring.createVisualForm({
      ...agreementLink,
      domainVerification: false,
      onSubmit: () => {
        localStorage.removeItem('buildData');
        localStorage.removeItem('buildDeal');
        localStorage.removeItem('buildFilesUploaded');
        setSigned(true);
      },
    });
  };

  // const phase = updatedDeal?.setBuildInfo?.phases.find((phase) => phase.name === 'build');
  // const task = phase?.tasks?.find((task) => task.title === 'Sign Service Agreement');

  // const [getSignedServiceAgreement, { data: serviceAgreementDocUrl, loading: signedDocLoading }] =
  //   useLazyQuery(GET_DOCUMENT, { variables: { task_id: task?._id }, fetchPolicy: 'network-only' });

  // useEffect(() => {
  //   if (signed) getSignedServiceAgreement();
  // }, [signed]);

  const classes = useStyles();
  // const loading = updatedDealLoading || agreementLinkLoading || signedDocLoading;
  const loading = createDealLoading;

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

        <AgreementBox
          title="Service Agreement"
          agreementLink={serviceAgreementLink}
          signingModal={signingModal}
          readyToSign={!!serviceAgreementLink && !error && !loading}
          signed={serviceAgreementSigned}
          setSigned={setServiceAgreementSigned}
          loading={loading}
          error={error}
          classes={classes}
        />

        <AgreementBox
          title="Advisory Agreement"
          agreementLink={advisoryAgreementLink}
          signingModal={signingModal}
          readyToSign={!!advisoryAgreementLink && !error && !loading}
          signed={advisoryAgreementSigned}
          setSigned={setAdvisoryAgreementSigned}
          loading={loading}
          error={error}
          classes={classes}
        />

        <div className={classes.buttonBox}>
          <Button
            onClick={() => {
              if (!allSigned) {
                toast.error('Please sign all Agreements before continuing');
                return;
              }
              toast.success('Success! Your submission was submitted.');
              history.push(`/deal-setup?id=${deal._id}`);
            }}
            className={classes.continueButton}
          >
            Complete
          </Button>
          {!allSigned && (
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
