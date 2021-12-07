import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import documentIcon from '../../../../../assets/document-icon.svg';
import documentGreenIcon from '../../../../../assets/document-green-icon.svg';
import documentGrayIcon from '../../../../../assets/document-grayed-icon.svg';
import uploadIcon from '../../../../../assets/upload-icon.svg';
import greenCheckIcon from '../../../../../assets/check.svg';
import trashIcon from '../../../../../assets/trash.svg';
import warningIcon from '../../../../../assets/warning-red.svg';
import useStyles from '../../../BuildStyles';
import { PitchDeckCheckBox } from '../../FormFields';

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
    fileType: 'application/pdf',
    fileTypeText: 'PDF',
  },
  'Upload Company Deck': {
    text: 'Pitch Deck',
    position: 2,
    fileType: 'application/pdf',
    fileTypeText: 'PDF',
  },
  'Upload Company Logo': {
    text: 'Portfolio Company Logo',
    position: 3,
    fileType: 'image/jpeg, image/jpg, image/png',
    fileTypeText: 'JPEG or PNG',
  },
  'Upload Fund Logo': {
    text: 'Fund Logo',
    position: 1,
    fileType: 'image/jpeg, image/jpg, image/png',
    fileTypeText: 'JPEG or PNG',
  },
};

const DocUploader = ({ document, filesUploaded, setFilesUploaded, deal, phaseId, classes }) => {
  const [error, setError] = useState(false);

  const [addDoc, { _, loading: addDocLoading, error: addDocError }] = useMutation(ADD_DOC, {
    onCompleted: ({ addDealDocService: uploadResponse }) => {
      if (uploadResponse?.success) toast.success('Success! Your document has been added');
    },
    onError: console.error,
  });
  const [deleteDoc, { loading: deleteDocLoading, error: deleteDocError }] = useMutation(
    DELETE_DOC,
    {
      onCompleted: ({ deleteDealDocument: deleteResponse }) => {
        if (!deleteResponse?.acknowledged) {
          setError(true);
          return;
        }
        toast.success('Success! Your document has been deleted');
      },
      onError: console.error,
    },
  );

  const { complete } = filesUploaded[document.title];
  const acceptedFiles = uploadTaskMap[document.title]?.fileType;

  const validateFileType = (target) => {
    const uploadTask = uploadTaskMap[document?.title];
    if (!acceptedFiles.includes(target.files[0]?.type)) {
      toast.error(`Please upload a ${uploadTask?.fileTypeText} file for the ${uploadTask?.text}`);
      return false;
    }
    return true;
  };

  if (addDocLoading || deleteDocLoading)
    return (
      <div className={classes.uploadDocLoader}>
        <CircularProgress />
      </div>
    );
  if (error || addDocError || deleteDocError) {
    return (
      <div className={`${classes.uploadErrorItem}`}>
        <div className={classes.docErrorIconBox}>
          <img src={warningIcon} alt="warning icon" />
        </div>
        <Typography className={classes.itemText}>&nbsp;Something went wrong...</Typography>
        <div className={classes.uploadIcon} style={{ opacity: '1', textAlign: 'center' }}>
          <div style={{ display: 'flex' }}>
            <img
              src={documentGrayIcon}
              className={classes.uploadIcon}
              style={{ opacity: '1', cursor: 'pointer', marginRight: '0.25em' }}
              alt="checkbox"
            />
            <span htmlFor={`${document._id}`} className={classes.uploadErrorLabel}>
              &nbsp;Upload document
            </span>
          </div>
          <form>
            <input
              id={`${document._id}`}
              className={classes.uploadIcon}
              type="file"
              style={{ display: 'none' }}
              accept={acceptedFiles}
              multiple
              onChange={({ target }) => {
                if (target.validity.valid) {
                  if (!validateFileType(target)) return;
                  setError(false);
                  addDoc({
                    variables: {
                      doc: target.files[0],
                      task_id: document?._id,
                      deal_id: deal?._id,
                      phase: phaseId,
                    },
                  }).then(({ data }) => {
                    const { name } = target.files[0];
                    setFilesUploaded((prev) => {
                      const newFilesUploaded = {
                        ...prev,
                        [document.title]: {
                          complete: true,
                          document: { name, _id: data.addDealDocService._id },
                        },
                      };
                      localStorage.setItem('buildFilesUploaded', JSON.stringify(newFilesUploaded));
                      return newFilesUploaded;
                    });
                  });
                }
              }}
            />
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className={`${classes.uploadDocItem} ${!complete ? '' : classes.uploadedDocItem}`}>
      <div className={classes.docIconBox} style={{ backgroundColor: complete && '#CBECC7' }}>
        <img src={!complete ? documentIcon : documentGreenIcon} alt="document icon" />
      </div>
      <Typography className={classes.itemText}>
        {complete
          ? _.truncate(filesUploaded[document.title]?.document?.name, { length: 25 })
          : uploadTaskMap[document.title].text}
        &nbsp;
        {complete && (
          <button
            className={classes.deleteDocButton}
            type="button"
            onClick={() => {
              deleteDoc({
                variables: {
                  document_id: filesUploaded[document.title]?.document?._id,
                  task_id: document._id,
                  phase_id: phaseId,
                },
              }).then(() => {
                setFilesUploaded((prev) => {
                  const newFilesUploaded = {
                    ...prev,
                    [document.title]: { complete: false, document: { name: null, _id: null } },
                  };
                  localStorage.setItem('buildFilesUploaded', JSON.stringify(newFilesUploaded));
                  return newFilesUploaded;
                });
              });
            }}
          >
            <img src={trashIcon} className={classes.deleteDocButton} alt="trash can icon" />
          </button>
        )}
      </Typography>
      <div className={classes.uploadIcon} style={{ opacity: '1', textAlign: 'center' }}>
        <label
          htmlFor={`${document._id}`}
          className={classes.uploadIconLabel}
          style={{ color: complete && '#39c522' }}
        >
          <img
            src={complete ? greenCheckIcon : uploadIcon}
            className={classes.uploadIcon}
            style={{ opacity: '1', cursor: 'pointer' }}
            alt={complete ? 'green check icon' : 'upload icon'}
          />
          &nbsp;{!complete ? 'Upload document' : 'Document uploaded'}
        </label>
        <form>
          <input
            id={`${document._id}`}
            className={classes.uploadIcon}
            type="file"
            style={{ display: 'none' }}
            accept={acceptedFiles}
            multiple
            onChange={({ target }) => {
              if (target.validity.valid) {
                if (!validateFileType(target)) return;
                addDoc({
                  variables: {
                    doc: target.files[0],
                    task_id: document?._id,
                    deal_id: deal?._id,
                    phase: 'build',
                  },
                }).then(({ data }) => {
                  const { name } = target.files[0];
                  setFilesUploaded((prev) => {
                    const newFilesUploaded = {
                      ...prev,
                      [document.title]: {
                        complete: true,
                        document: { name, _id: data.addDealDocService._id },
                      },
                    };
                    localStorage.setItem('buildFilesUploaded', JSON.stringify(newFilesUploaded));
                    return newFilesUploaded;
                  });
                });
              }
            }}
          />
        </form>
      </div>
    </div>
  );
};

export default function UploadDocs({
  dealType,
  deal,
  buildData,
  setBuildData,
  classes: checkBoxClasses,
}) {
  const classes = useStyles();

  const docUploadMap = {
    spv: {
      'Upload Company Logo': {
        complete: false,
        document: {
          name: null,
          _id: null,
        },
      },
      'Upload Company Deck': {
        complete: false,
        document: {
          name: null,
          _id: null,
        },
      },
      'Upload Term Sheet': {
        complete: false,
        document: {
          name: null,
          _id: null,
        },
      },
    },
    fund: {
      'Upload Fund Logo': {
        complete: false,
        document: {
          name: null,
          _id: null,
        },
      },
    },
  };

  const [filesUploaded, setFilesUploaded] = useState(docUploadMap[dealType]);

  const currentPhase = deal?.phases.find((phase) => phase.name === 'build');
  const uploadTasks = currentPhase?.tasks
    .filter((task) => task.type === 'fm-document-upload' && task.title !== 'Upload ID')
    .sort((a, b) => uploadTaskMap[a.title]?.position - uploadTaskMap[b.title]?.position);

  useEffect(() => {
    if (localStorage.getItem('buildFilesUploaded')) {
      setFilesUploaded(JSON.parse(localStorage.getItem('buildFilesUploaded')));
    }
  }, []);
  return (
    <main>
      <section className={classes.docUploadBox}>
        <div className={classes.uploadContainer}>
          {uploadTasks?.map((task) => (
            <DocUploader
              key={task._id}
              document={task}
              classes={classes}
              filesUploaded={filesUploaded}
              setFilesUploaded={setFilesUploaded}
              deal={deal}
              phaseId={currentPhase._id}
            />
          ))}
        </div>
      </section>
      {deal?.type === 'spv' && filesUploaded['Upload Company Deck']?.complete && (
        <PitchDeckCheckBox
          buildData={buildData}
          setBuildData={setBuildData}
          classes={checkBoxClasses}
        />
      )}
    </main>
  );
}
