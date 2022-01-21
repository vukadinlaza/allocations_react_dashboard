import React, { useEffect, useState } from 'react';
import { CircularProgress, makeStyles, Checkbox } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import documentIcon from '../../../../../../../assets/document-icon.svg';
import documentGreenIcon from '../../../../../../../assets/document-green-icon.svg';
import documentGrayIcon from '../../../../../../../assets/document-grayed-icon.svg';
import redUploadIcon from '../../../../../../../assets/red-doc-upload.svg';
import greenCheckCircle from '../../../../../../../assets/green-circled-checkmark.svg';
import trashIcon from '../../../../../../../assets/trash.svg';
import warningIcon from '../../../../../../../assets/warning-red.svg';
import { phone } from '../../../../../../../utils/helpers';

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

const UPDATE_DEAL = gql`
  mutation updateDealBuildApi($payload: Object) {
    updateDealBuildApi(payload: $payload) {
      _id
      public_pitch_deck
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  uploadContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    [theme.breakpoints.down(phone)]: {
      flexDirection: 'column',
    },
  },
  blueCheck: {
    width: '26px',
    height: '26px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '50%',
    justifyContent: 'center',
    backgroundColor: '#0461ff',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    [theme.breakpoints.down(phone)]: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '8px',
    },
  },
  deleteDocButton: {
    cursor: 'pointer',
    backgroundColor: 'inherit',
    border: 'none',
    outline: 'none',
  },
  docErrorIconBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2CECC',
    borderRadius: '50%',
    width: '58px',
    height: '58px',
  },
  docIconBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECF3FF',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
  },
  docIcon: {
    height: '20px',
  },
  itemText: {
    font: 'normal normal normal 18px/20px Roboto',
    color: '#2A2B54',
    width: '160px',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: '0px',
    opacity: '1',
    [theme.breakpoints.down(phone)]: {
      font: 'normal normal normal 16px/20px Roboto',
      maxWidth: '180px',
    },
  },
  docUploadBox: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    marginBottom: '16px',
    paddingTop: '20px',
    borderRadius: '15px',
    width: '100%',
    maxWidth: '1352px',
    opacity: 1,
    [theme.breakpoints.down(phone)]: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '600px',
      padding: '23px',
      paddingBottom: '0px',
    },
  },
  uploadDocLoader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#ECF3FF 0% 0% no-repeat padding-box',
    border: '2px dashed #0461FF !important',
    borderRadius: '10px',
    width: '228px',
    height: '184px',
    margin: '10px',
  },
  uploadDocItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    background: '#fff 0% 0% no-repeat padding-box',
    border: '1px dashed #CBD5E1 !important',
    borderRadius: '10px',
    opacity: 1,
    width: '228px',
    height: '184px',
    margin: '10px',
  },
  uploadedDocItem: {
    background: '#fff 0% 0% no-repeat padding-box',
    border: '2px solid #10B981 !important',
  },
  uploadErrorLabel: {
    display: 'flex',
    justifyContent: 'space-evenly',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    color: '#8E9394',
  },
  uploadErrorItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    background: '#fff 0% 0% no-repeat padding-box',
    border: '2px solid #EBEBEB !important',
    borderRadius: '10px',
    opacity: 1,
    width: '228px',
    height: '184px',
    margin: '10px',
  },
  uploadIcon: {
    color: 'blue',
    height: '13.5px',
    transparentheight: '35px',
    [theme.breakpoints.down(phone)]: {
      marginRight: '20px',
      width: '30px',
    },
  },
  uploadIconLabel: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '143px',
    height: '24px',
    borderRadius: '12px',
    whiteSpace: 'nowrap',
    backgroundColor: '#FEE2E2',
    cursor: 'pointer',
    color: '#B91C1C',
    fontWeight: '500',
  },
  greenCheckCircle: {
    height: '13px',
    width: '13px',
    border: '1px solid #047857',
  },
  checkBoxContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
    marginLeft: '10px',
  },
  pitchDeckCheckbox: {
    paddingLeft: '0px',
    height: '24px',
    width: '24px',
    borderRadius: '4px',
  },
  pitchDeckColorSecondary: {
    color: '#39C522',
  },
}));

const uploadTaskMap = {
  'Upload Term Sheet': {
    text: 'Portfolio Company Term Sheet',
    position: 1,
    fileType: 'application/pdf',
    fileTypeText: 'PDF',
  },
  'Upload Company Deck': {
    text: 'Pitch Deck (Optional)',
    position: 2,
    fileType: 'application/pdf',
    fileTypeText: 'PDF',
  },
  'Upload Company Logo': {
    text: 'Portfolio Company Logo (Optional)',
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

function PitchDeckCheckBox({ deal, classes }) {
  const [updateDeal] = useMutation(UPDATE_DEAL, {
    onError: console.error,
  });

  return (
    <div className={classes.checkBoxContainer}>
      <Checkbox
        color="default"
        size="medium"
        name="public_pitch_deck"
        checked={deal?.metadata?.public_pitch_deck}
        classes={{
          root: classes.pitchDeckCheckbox,
          checked: classes.pitchDeckColorSecondary,
        }}
        onChange={(e) => {
          updateDeal({
            variables: {
              payload: {
                deal_id: deal?._id,
                public_pitch_deck: e.target.checked,
              },
            },
          });
        }}
      />
      <Typography style={{ fontWeight: 'bold' }}>
        Allow the Pitch Deck to be shown publicly on the Deal Page?
      </Typography>
    </div>
  );
}

const DocUploader = ({ document, filesUploaded, setFilesUploaded, phase, classes }) => {
  const [error, setError] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [addDoc, { _, loading: addDocLoading, error: addDocError }] = useMutation(ADD_DOC, {
    onCompleted: ({ addDealDocService: uploadResponse }) => {
      if (uploadResponse?.success) toast.success('Success! Your document has been added');
    },
    // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
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

  const truncFile = (file) => {
    let fileName = file;

    if (file.length > 25) {
      const split = file.split('.');
      fileName = `${split[0].slice(0, 25)}...${split[1]}`;
    }

    return fileName;
  };

  if (addDocLoading || deleteDocLoading) {
    return (
      <div className={classes.uploadDocLoader}>
        <CircularProgress />
      </div>
    );
  }
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
                      deal_id: phase?.deal_id,
                      phase: phase._id,
                    },
                  }).then(({ data }) => {
                    const { name } = target.files[0];
                    if (data.addDealDocService) {
                      setFilesUploaded((prev) => {
                        const newFilesUploaded = {
                          ...prev,
                          [document.title]: {
                            complete: true,
                            document: { name, _id: data.addDealDocService._id },
                          },
                        };
                        localStorage.setItem(
                          'buildFilesUploaded',
                          JSON.stringify(newFilesUploaded),
                        );
                        return newFilesUploaded;
                      });
                    }
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
        <img
          src={!complete ? documentIcon : documentGreenIcon}
          alt="document icon"
          className={classes.docIcon}
        />
      </div>
      <Typography className={classes.itemText}>
        {complete
          ? truncFile(filesUploaded[document.title]?.document?.name)
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
                  phase_id: phase?._id,
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
      <div style={{ opacity: '1', textAlign: 'center' }}>
        <label
          htmlFor={`${document._id}`}
          className={classes.uploadIconLabel}
          style={complete ? { backgroundColor: '#D1FAE5', color: '#047857' } : null}
        >
          <img
            src={complete ? greenCheckCircle : redUploadIcon}
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
                    deal_id: phase?.deal_id,
                    phase: phase?.name,
                  },
                }).then(({ data }) => {
                  if (data.addDealDocService) {
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
                  }
                });
              }
            }}
          />
        </form>
      </div>
    </div>
  );
};

export default function UploadDocs({ deal, phase }) {
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

  const [filesUploaded, setFilesUploaded] = useState(docUploadMap[deal?.type]);

  const uploadTasks = phase?.tasks
    .filter((task) => task.type === 'fm-document-upload')
    .sort((a, b) => uploadTaskMap[a.title]?.position - uploadTaskMap[b.title]?.position);

  useEffect(() => {
    if (localStorage.getItem('buildFilesUploaded')) {
      setFilesUploaded(JSON.parse(localStorage.getItem('buildFilesUploaded')));
    }
  }, []);
  return (
    <div>
      <div className={classes.uploadContainer}>
        {uploadTasks?.map((task) => (
          <DocUploader
            key={task._id}
            document={task}
            classes={classes}
            filesUploaded={filesUploaded}
            setFilesUploaded={setFilesUploaded}
            phase={phase}
            phaseId={phase._id}
          />
        ))}
        {deal?.type === 'spv' && filesUploaded['Upload Company Deck']?.complete && (
          <PitchDeckCheckBox deal={deal} classes={classes} />
        )}
      </div>
    </div>
  );
}
