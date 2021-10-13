import React, { useEffect, useState } from 'react';
import { Button, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import buildDoc from '../../../../../assets/buildDoc.svg';
import buildUpload from '../../../../../assets/buildUpload.svg';
import CheckCircle from '../../../../../assets/check_circle_black_24dp.svg';
import useStyles from '../../../BuildStyles';

const ADD_DOC = gql`
  mutation addDealDocService($deal_id: String!, $task_id: String!, $doc: Upload!, $phase: String) {
    addDealDocService(deal_id: $deal_id, task_id: $task_id, doc: $doc, phase: $phase)
  }
`;

const DocUploader = ({
  document,
  filesUploaded,
  setFilesUploaded,
  deal,
  // no change
  classes,
  addDoc,
}) => {
  // const { data, refetch: refetchDeal } = useQuery(DEAL, {
  //   variables: { deal_id: deal?._id },
  // });

  // useEffect(() => {
  //   if (filesUploaded[document.title].complete) {
  //     addDoc({
  //       variables: {
  //         doc: filesUploaded[document.title]?.document,
  //         task_id: document?._id,
  //         deal_id: deal?._id,
  //         phase: 'build',
  //       },
  //     });
  //     localStorage.setItem('buildFilesUploaded', JSON.stringify(filesUploaded));
  //   }
  // }, [filesUploaded]);

  return (
    <Paper
      className={`${classes.item} ${
        !filesUploaded[document.title].complete ? '' : classes.selected
      }`}
    >
      <img src={buildDoc} alt="document icon" className={classes.documentIcon} />
      <Typography className={classes.itemText}>{document.title}</Typography>
      {!filesUploaded[document.title].complete ? (
        <div className={classes.uploadIcon} style={{ opacity: '1' }}>
          <label htmlFor="doc-upload" style={{ margin: '0' }}>
            <img
              src={buildUpload}
              className={classes.uploadIcon}
              style={{ opacity: '1', cursor: 'pointer' }}
              alt="checkbox"
            />
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
      ) : (
        <img
          src={CheckCircle}
          className={classes.checkCircle}
          alt="checkbox"
          style={{ opacity: '1' }}
        />
      )}
    </Paper>
  );
};

export default function UploadDocs({ page, setPage, deal }) {
  const classes = useStyles();
  const currentPhase = deal.phases.find((phase) => phase.name === 'build');
  const uploadTasks = currentPhase.tasks.filter((task) => task.type === 'fm-document-upload');

  const [filesUploaded, setFilesUploaded] = useState({
    'Upload Company Logo': {
      complete: false,
      document: null,
    },
    'Upload ID': {
      complete: false,
      document: null,
    },
    'Upload Company Deck': {
      complete: false,
      document: null,
    },
    'Upload Term Sheet': {
      complete: false,
      document: null,
    },
  });
  const history = useHistory();
  const [addDoc] = useMutation(ADD_DOC, {
    onCompleted: () => {
      toast.success('Success! Your document has been added');
    },
  });
  useEffect(() => {
    if (localStorage.getItem('buildFilesUploaded')) {
      setFilesUploaded(JSON.parse(localStorage.getItem('buildFilesUploaded')));
    }
  }, []);
  return (
    <>
      <Paper className={classes.paper}>
        <Typography variant="h6" gutterBottom className={classes.sectionHeaderText}>
          Upload your documents{' '}
        </Typography>
        <Typography variant="h6" gutterBottom className={classes.subtitle}>
          Please upload the appropriate documents so we have them on file for you. When uploading
          multiple files, please compress them into one zip folder.
        </Typography>
        {uploadTasks.map((task) => (
          <DocUploader
            key={task._id}
            document={task}
            classes={classes}
            filesUploaded={filesUploaded}
            setFilesUploaded={setFilesUploaded}
            addDoc={addDoc}
            deal={deal}
          />
        ))}

        <Button
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
