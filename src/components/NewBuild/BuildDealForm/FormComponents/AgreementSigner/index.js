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
  title,
  task,
  agreementLink,
  readyToSign,
  signingModal,
  signed,
  setSigned,
  createDealLoading,
  error,
  classes,
}) => {
  const [getSignedDocument, { data: signedDocUrl, loading: signedDocLoading }] = useLazyQuery(
    GET_DOCUMENT,
    { variables: { task_id: task?._id }, fetchPolicy: 'network-only' },
  );

  useEffect(() => {
    if (signed && task?._id) getSignedDocument();
  }, [signed]);

  const loading = createDealLoading || signedDocLoading;

  return (
    <Paper
      className={signed ? classes.agreementSignedBox : classes.agreementUnsignedBox}
      style={{
        cursor: readyToSign && !signed && 'pointer',
        pointerEvents: !readyToSign && 'none',
      }}
      onClick={() => (readyToSign && !signed ? signingModal(agreementLink, setSigned) : null)}
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
          {signed && signedDocUrl?.getDealDocService?.link ? (
            <a href={signedDocUrl?.getDealDocService?.link} target="_blank" rel="noreferrer">
              {title}
            </a>
          ) : (
            !loading && title
          )}
        </Typography>
      </div>

      <Typography className={signed ? classes.signed : classes.notSigned}>
        {signed ? '• Signed' : '• Not Signed'}
      </Typography>
    </Paper>
  );
};

export default function SignDocsForm({ dealData = {}, createDealLoading, error, page, setPage }) {
  const history = useHistory();
  const { deal, documents, phases } = dealData;
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

  const phase = phases?.find((phase) => phase.name === 'build');
  const serviceAgreementTask = phase?.tasks?.find(
    (task) => task.title === 'Sign Service Agreement',
  );

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

        <AgreementBox
          title="Service Agreement"
          agreementLink={serviceAgreementLink}
          signingModal={signingModal}
          task={serviceAgreementTask}
          readyToSign={!!serviceAgreementLink && !error && !createDealLoading}
          signed={serviceAgreementSigned}
          setSigned={setServiceAgreementSigned}
          createDealLoading={createDealLoading}
          error={error}
          classes={classes}
        />

        <AgreementBox
          title="Advisory Agreement"
          agreementLink={advisoryAgreementLink}
          signingModal={signingModal}
          readyToSign={!!advisoryAgreementLink && !error && !createDealLoading}
          signed={advisoryAgreementSigned}
          setSigned={setAdvisoryAgreementSigned}
          createDealLoading={createDealLoading}
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
