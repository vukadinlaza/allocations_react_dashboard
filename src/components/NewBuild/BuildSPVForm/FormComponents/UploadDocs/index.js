import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import documentIcon from '../../../../../assets/document-icon.svg';
import documentGreenIcon from '../../../../../assets/document-green-icon.svg';
import documentGrayIcon from '../../../../../assets/document-grayed-icon.svg';
import uploadIcon from '../../../../../assets/upload-icon.svg';
import greenCheckIcon from '../../../../../assets/check.svg';
import trashIcon from '../../../../../assets/trash.svg';
import warningIcon from '../../../../../assets/warning-red.svg';
import useStyles from '../../../BuildStyles';

const ADD_DOC = gql`
  mutation addDealDocService($deal_id: String!, $task_id: String!, $doc: Upload!, $phase: String) {
    addDealDocService(deal_id: $deal_id, task_id: $task_id, doc: $doc, phase: $phase)
  }
`;

const DELETE_DOC = gql`
  mutation deleteDealDocument($document_id: String!, $task_id: String!, $phase_id: String!) {
    deleteDealDocument(document_id: $document_id, task_id: $task_id, phase_id: $phase_id)
  }
`;

const uploadTaskMap = {
  'Upload Term Sheet': {
    text: 'Portfolio Company Term Sheet',
    position: 1,
  },
  'Upload Company Deck': {
    text: 'Pitch Deck',
    position: 2,
  },
  'Upload Company Logo': {
    text: 'Portfolio Company Logo',
    position: 3,
  },
};

const DocUploader = ({ document, filesUploaded, setFilesUploaded, deal, classes }) => {
  const [docId, setDocId] = useState(null);

  const [addDoc, { data, loading: addDocLoading, error: addDocError }] = useMutation(ADD_DOC, {
    onCompleted: ({ addDealDocService: uploadResponse }) => {
      toast.success('Success! Your document has been added');
      setDocId(uploadResponse._id);
    },
  });
  const [deleteDoc, { loading: deleteDocLoading, error: deleteDocError }] = useMutation(
    DELETE_DOC,
    {
      onCompleted: () => {
        toast.success('Success! Your document has been deleted');
        setFilesUploaded((prev) => {
          return {
            ...prev,
            [document.title]: { complete: false, document: null },
          };
        });
      },
    },
  );

  const { complete } = filesUploaded[document.title];

  if (addDocLoading || deleteDocLoading)
    return (
      <div className={classes.uploadDocLoader}>
        <CircularProgress />
      </div>
    );
  if (addDocError || deleteDocError)
    return (
      <div className={`${classes.uploadErrorItem}`}>
        <div className={classes.docErrorIconBox}>
          <img src={warningIcon} alt="warning icon" />
        </div>
        <Typography className={classes.itemText}>&nbsp;Something went wrong...</Typography>
        {
          <div className={classes.uploadIcon} style={{ opacity: '1', textAlign: 'center' }}>
            <label htmlFor="doc-upload" className={classes.uploadErrorLabel}>
              <img
                src={documentGrayIcon}
                className={classes.uploadIcon}
                style={{ opacity: '1', cursor: 'pointer' }}
                alt="checkbox"
              />
              &nbsp;Upload document
            </label>
            <form>
              <input
                id="doc-upload"
                className={classes.uploadIcon}
                type="file"
                style={{ display: 'none' }}
                accept="application/pdf"
                multiple
                onChange={({ target }) => {
                  if (target.validity.valid) {
                    setFilesUploaded((prev) => {
                      return {
                        ...prev,
                        [document.title]: { complete: true, document: target.files[0] },
                      };
                    });
                    addDoc({
                      variables: {
                        doc: target.files[0],
                        task_id: document?._id,
                        deal_id: deal?._id,
                        phase: 'build',
                      },
                    });
                    localStorage.setItem('buildFilesUploaded', JSON.stringify(filesUploaded));
                  }
                }}
              />
            </form>
          </div>
        }
      </div>
    );
  return (
    <div className={`${classes.uploadDocItem} ${!complete ? '' : classes.uploadedDocItem}`}>
      <div className={classes.docIconBox} style={{ backgroundColor: complete && '#CBECC7' }}>
        <img src={!complete ? documentIcon : documentGreenIcon} alt="document icon" />
      </div>
      <Typography className={classes.itemText}>
        {complete
          ? filesUploaded[document.title].document.name
          : uploadTaskMap[document.title].text}
        &nbsp;
        {complete && (
          <button
            className={classes.deleteDocButton}
            type="button"
            onClick={() => {
              deleteDoc({
                variables: {
                  document_id: docId,
                  task_id: document._id,
                  phase_id: 'build',
                },
              });
            }}
          >
            <img src={trashIcon} className={classes.deleteDocButton} alt="trash can icon" />
          </button>
        )}
      </Typography>
      {
        <div className={classes.uploadIcon} style={{ opacity: '1', textAlign: 'center' }}>
          <label
            htmlFor="doc-upload"
            className={classes.uploadIconLabel}
            style={{ color: complete && '#39c522' }}
          >
            <img
              src={complete ? greenCheckIcon : uploadIcon}
              className={classes.uploadIcon}
              style={{ opacity: '1', cursor: 'pointer' }}
              alt="checkbox"
            />
            &nbsp;{!complete ? 'Upload document' : 'Document uploaded'}
          </label>
          <form>
            <input
              id="doc-upload"
              className={classes.uploadIcon}
              type="file"
              style={{ display: 'none' }}
              accept="application/pdf"
              multiple
              onChange={({ target }) => {
                if (target.validity.valid) {
                  addDoc({
                    variables: {
                      doc: target.files[0],
                      task_id: document?._id,
                      deal_id: deal?._id,
                      phase: 'build',
                    },
                  }).then(() => {
                    setFilesUploaded((prev) => {
                      return {
                        ...prev,
                        [document.title]: { complete: true, document: target.files[0] },
                      };
                    });
                  });
                  localStorage.setItem('buildFilesUploaded', JSON.stringify(filesUploaded));
                }
              }}
            />
          </form>
        </div>
      }
    </div>
  );
};

export default function UploadDocs({ deal }) {
  const classes = useStyles();

  const [filesUploaded, setFilesUploaded] = useState({
    'Upload Company Logo': {
      complete: false,
      document: null,
    },
    // 'Upload ID': {
    //   complete: false,
    //   document: null,
    // },
    'Upload Company Deck': {
      complete: false,
      document: null,
    },
    'Upload Term Sheet': {
      complete: false,
      document: null,
    },
  });

  const currentPhase = deal?.phases.find((phase) => phase.name === 'build');
  const uploadTasks = currentPhase?.tasks
    .filter((task) => task.type === 'fm-document-upload' && task.title !== 'Upload ID')
    .sort((a, b) => uploadTaskMap[a.title]?.position - uploadTaskMap[b.title]?.position);

  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem('buildFilesUploaded')) {
      setFilesUploaded(JSON.parse(localStorage.getItem('buildFilesUploaded')));
    }
  }, []);
  return (
    <>
      <main className={classes.docUploadBox}>
        <section className={classes.uploadContainer}>
          {uploadTasks?.map((task) => (
            <DocUploader
              key={task._id}
              document={task}
              classes={classes}
              filesUploaded={filesUploaded}
              setFilesUploaded={setFilesUploaded}
              deal={deal}
            />
          ))}
        </section>
        {/* <Button
          className={classes.finishButton}
          onClick={() => {
            toast.success('Success! Your submission was submitted.');
            localStorage.removeItem('buildData');
            localStorage.removeItem('buildDeal');
            localStorage.removeItem('buildFilesUploaded');
            if (deal?._id) history.push(`/deal-setup?id=${deal._id}`);
          }}
        >
          Finish
        </Button> */}
        {/* <Typography
          className={classes.previousButton}
          onClick={() => {
            setPage(page - 1);
          }}
        >
          Previous
        </Typography> */}
      </main>
    </>
  );
}
