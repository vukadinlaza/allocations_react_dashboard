import React, { useEffect, useState } from 'react';
import { Button, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useQuery, gql, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import buildDoc from '../../../../../assets/buildDoc.svg';
import buildUpload from '../../../../../assets/buildUpload.svg';
import CheckCircle from '../../../../../assets/check_circle_black_24dp.svg';
import useStyles from '../../../BuildStyles';
import { set } from 'lodash';

const ADD_DOC = gql`
  mutation addDealDocService($deal_id: String!, $task_id: String!, $doc: Upload!, $phase: String) {
    addDealDocService(deal_id: $deal_id, task_id: $task_id, doc: $doc, phase: $phase) {
      _id
    }
  }
`;
const COMPLETE_REVIEW = gql`
  mutation updateDealTask($deal_id: String!, $task_id: String!, $phase: String!) {
    updateDealTask(deal_id: $deal_id, task_id: $task_id, phase: $phase) {
      _id
    }
  }
`;

const DocUploader = ({
  document,
  filesUploaded,
  setFilesUploaded,
  deal,
  classes,
  addDoc,
  updateTask,
}) => {
  useEffect(() => {
    if (filesUploaded[document.slug].complete) {
      console.log('doc being added ');
      addDoc({
        variables: {
          doc: filesUploaded[document.slug]?.document,
          // title: `s-${document.name}`,
          task_id: document?.task_id,
          deal_id: deal?._id,
          phase: 'build',
        },
      });
      updateTask({
        variables: { deal_id: deal?._id, task_id: document?.task_id, phase: 'build' },
      });
    }
  }, [filesUploaded]);

  return (
    <Paper
      className={`${classes.item} ${
        !filesUploaded[document.slug].complete ? '' : classes.selected
      }`}
    >
      <img src={buildDoc} alt="document icon" className={classes.documentIcon} />
      <Typography className={classes.itemText}>{document.name}</Typography>
      {!filesUploaded[document.slug].complete ? (
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
                      [document.slug]: { complete: true, document: target.files[0] },
                    };
                  });
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
  const documents = [
    {
      task_id: '61554d10457d945d44ee8f5b',
      name: 'Portfolio Company Term Sheet',
      slug: 'portfolio-company-term-sheet',
    },
    { task_id: '61554d10457d945d44ee8f58', name: 'Pitch Deck', slug: 'pitch-deck' },
    {
      task_id: '61554d10457d945d44ee8f5a',
      name: "Driver's License/Passport",
      slug: 'license-or-passport',
    },
    {
      task_id: '61554d10457d945d44ee8f59',
      name: 'Portfolio Company Logo',
      slug: 'portfolio-company-logo',
    },
  ];
  const [filesUploaded, setFilesUploaded] = useState({
    'portfolio-company-logo': {
      complete: false,
      document: null,
    },
    'license-or-passport': {
      complete: false,
      document: null,
    },
    'pitch-deck': {
      complete: false,
      document: null,
    },
    'portfolio-company-term-sheet': {
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
  const [updateTask] = useMutation(COMPLETE_REVIEW, {
    onCompleted: () => {
      toast.success('Success! Phase reviewed.');
    },
  });
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
        {documents.map((document) => (
          <DocUploader
            key={document.name}
            document={document}
            classes={classes}
            filesUploaded={filesUploaded}
            setFilesUploaded={setFilesUploaded}
            addDoc={addDoc}
            deal={deal}
            updateTask={updateTask}
          />
        ))}

        <Button
          className={classes.finishButton}
          onClick={() => {
            toast.success('Success! Your submission was submitted.');
            if (deal?.metadata) history.push(`/deal-setup?id=${deal.metadata._id}`);
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
