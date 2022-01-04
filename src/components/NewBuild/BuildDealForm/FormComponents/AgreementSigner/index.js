/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Paper } from '@material-ui/core';
import { gql, useLazyQuery } from '@apollo/client';
import Typography from '@material-ui/core/Typography';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import bluePenIcon from '../../../../../assets/sign-agreement-blue-pen.svg';
import useStyles from '../../../BuildStyles';
import { useCurrentOrganization } from '../../../../../state/current-organization';

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
  isSigned,
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
      onClick={() => (readyToSign && !signed ? signingModal(agreementLink, isSigned) : null)}
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
  const currentOrg = useCurrentOrganization();
  const { deal, documents } = dealData;
  const [documentsSignedStatus, setDocumentsSignedStatus] = useState({});

  useEffect(() => {
    if (documents) {
      setDocumentsSignedStatus(
        documents?.reduce((acc, document) => {
          acc[document.task.title] = false;
          return acc;
        }, {}),
      );
    }
  }, [documents]);

  const allSigned = documents ? Object.values(documentsSignedStatus).every(Boolean) : false;

  const signingModal = (agreementLink, isSigned) => {
    DocSpring.createVisualForm({
      ...agreementLink,
      domainVerification: false,
      onSubmit: () => {
        localStorage.removeItem('buildData');
        localStorage.removeItem('buildDeal');
        localStorage.removeItem('buildFilesUploaded');
        isSigned();
        // eslint-disable-next-line no-undef
        DocSpring.closeModal();
      },
    });
  };

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

        {!documents && (
          <div
            style={{
              display: 'flex',
              margin: 'auto',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              width: '300px',
            }}
          >
            <CircularProgress /> <Typography> Loading your agreements... </Typography>
          </div>
        )}

        {documents?.map(({ task, ...documentData }) => (
          <AgreementBox
            title={task.title.slice(4)}
            agreementLink={documentData}
            signingModal={signingModal}
            task={task}
            readyToSign={!!documentData && !error && !createDealLoading}
            signed={documentsSignedStatus[task.title]}
            isSigned={() =>
              setDocumentsSignedStatus((prev) => ({
                ...prev,
                [task.title]: true,
              }))
            }
            createDealLoading={createDealLoading}
            error={error}
            classes={classes}
          />
        ))}

        <div className={classes.buttonBox}>
          <Button
            disabled={!allSigned}
            onClick={() => {
              toast.success('Success! Your submission was submitted.');
              history.push(`/admin/${currentOrg.slug}/${deal._id}`);
            }}
            style={{ backgroundColor: !allSigned && '#EBEBEB' }}
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
