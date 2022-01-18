/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Paper } from '@material-ui/core';
import { gql, useLazyQuery } from '@apollo/client';
import Typography from '@material-ui/core/Typography';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import docIcon from '../../../../../assets/buildDoc.svg';
import bluePenIcon from '../../../../../assets/sign-agreement-blue-pen.svg';
import check from '../../../../../assets/check-mark-blue.svg';
import useStyles from '../../../BuildStyles';
import { useCurrentOrganization } from '../../../../../state/current-organization';
import { useViewport } from '../../../../../utils/hooks';
import { phone } from '../../../../../utils/helpers';

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

export const AgreementBox = ({
  title,
  task,
  agreementLink,
  readyToSign,
  signingModal,
  signed,
  isSigned,
  timeoutLoading = false,
  createDealLoading,
  error,
  classes,
}) => {
  const { width } = useViewport();
  const [getSignedDocument, { data: signedDocUrl, loading: signedDocLoading }] = useLazyQuery(
    GET_DOCUMENT,
    { variables: { task_id: task?._id }, fetchPolicy: 'network-only' },
  );

  useEffect(() => {
    if (signed && task?._id) getSignedDocument();
  }, [signed]);

  const loading = createDealLoading || signedDocLoading || timeoutLoading;

  const handleAgreementClick = () => {
    if (readyToSign && !signed) signingModal(agreementLink, isSigned);
    if (signed && signedDocUrl?.getDealDocService?.link)
      window.open(signedDocUrl?.getDealDocService?.link, '_blank');
  };

  return (
    <Paper
      className={signed ? classes.agreementSignedBox : classes.agreementUnsignedBox}
      style={{
        cursor: !loading && 'pointer',
        pointerEvents: !readyToSign && 'none',
      }}
      onClick={!loading && handleAgreementClick}
    >
      <div>
        {loading || error ? (
          <CircularProgress />
        ) : width > phone ? (
          <div className={classes.serviceAgreementIconBox}>
            <img src={bluePenIcon} alt="document icon" />
          </div>
        ) : (
          <div className={classes.serviceAgreementIconBox}>
            <img src={docIcon} alt="document icon" />
          </div>
        )}
      </div>
      <Typography className={classes.itemText}>{title}</Typography>

      {width > phone ? (
        <Typography className={signed ? classes.signed : classes.notSigned}>
          {signed ? '• Signed' : '• Not Signed'}
        </Typography>
      ) : signed ? (
        <div className={classes.blueCheck}>
          <img src={check} alt="check mark" />
        </div>
      ) : null}
    </Paper>
  );
};

export default function SignDocsForm({ dealData = {}, createDealLoading, error, page, setPage }) {
  const history = useHistory();
  const currentOrg = useCurrentOrganization();
  const { deal, documents } = dealData;
  const [documentsSignedStatus, setDocumentsSignedStatus] = useState({});
  const [timeoutLoading, setTimeoutLoading] = useState({});

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

        {documents?.map(({ task, ...documentData }) => {
          return (
            <AgreementBox
              title={task.title.slice(4)}
              agreementLink={documentData}
              signingModal={signingModal}
              task={task}
              readyToSign={!!documentData && !error && !createDealLoading}
              signed={documentsSignedStatus[task.title]}
              isSigned={() => {
                setTimeoutLoading((prev) => ({
                  ...prev,
                  [task.title]: true,
                }));
                setDocumentsSignedStatus((prev) => ({
                  ...prev,
                  [task.title]: true,
                }));
                setTimeout(() => {
                  setTimeoutLoading((prev) => ({
                    ...prev,
                    [task.title]: false,
                  }));
                }, 2500);
              }}
              timeoutLoading={timeoutLoading[task.title]}
              createDealLoading={createDealLoading}
              error={error}
              classes={classes}
            />
          );
        })}

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
