import React, { useEffect } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { FormControl, Grid, Typography } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import moment from 'moment';
import { DocumentBox, UploadBox } from '../../../../common/common';
import Loader from '../../../../utils/Loader';

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

const ADD_DOC = gql`
  mutation addDealDocService($deal_id: String!, $task_id: String!, $doc: Upload!, $phase: String) {
    addDealDocService(deal_id: $deal_id, task_id: $task_id, doc: $doc, phase: $phase)
  }
`;

const DELETE_DOCUMENT = gql`
  mutation deleteDealDocument($document_id: String!, $task_id: String!, $phase_id: String!) {
    deleteDealDocument(document_id: $document_id, task_id: $task_id, phase_id: $phase_id)
  }
`;

const DeleteDocument = ({ documentData, task, phase, classes, deleteDocument }) => (
  <div style={{ position: 'relative', marginTop: '10px', width: '100%' }}>
    <CancelIcon
      className={classes.cancelIcon}
      onClick={() => {
        deleteDocument({
          variables: {
            document_id: documentData._id,
            task_id: task._id,
            phase_id: phase._id,
          },
        });
      }}
    />
    <DocumentBox doc={documentData} docPath={documentData.title} minWidth="0" />
  </div>
);

const UploadDocument = ({ deal, phase, task, addDocument }) => (
  <FormControl required disabled variant="outlined" style={{ width: '100%', padding: '10px 0' }}>
    <UploadBox>
      <input
        type="file"
        style={{ display: 'none' }}
        accept="application/pdf"
        multiple
        onChange={({ target }) => {
          if (target.validity.valid) {
            addDocument({
              variables: {
                doc: target.files[0],
                task_id: task._id,
                deal_id: deal._id,
                phase: phase.name,
              },
            });
          }
        }}
      />
    </UploadBox>
  </FormControl>
);

const DisplayDocument = ({
  documentData,
  deal,
  phase,
  task,
  classes,
  addDocument,
  deleteDocument,
}) => {
  if (documentData?.link) {
    return (
      <DeleteDocument
        documentData={documentData}
        task={task}
        phase={phase}
        classes={classes}
        deleteDocument={deleteDocument}
      />
    );
  }

  return <UploadDocument deal={deal} phase={phase} task={task} addDocument={addDocument} />;
};

export default function DocumentUploadTask({ deal, phase, task, classes, setSnackbarData }) {
  const [getDocument, { data }] = useLazyQuery(GET_DOCUMENT, {
    fetchPolicy: 'network-only',
    onError: (error) => {
      setSnackbarData({
        type: 'error',
        message: error.toString(),
      });
    },
  });

  const [addDocument, { loading: addDocumentLoading }] = useMutation(ADD_DOC, {
    onCompleted: () => {
      setSnackbarData({
        type: 'success',
        message: 'Success! Task updated.',
      });
    },
  });

  const [deleteDocument] = useMutation(DELETE_DOCUMENT, {
    onCompleted: () => {
      setSnackbarData({
        type: 'success',
        message: 'Success! Document deleted.',
      });
      getDocument({ variables: { task_id: task._id } });
    },
  });

  useEffect(() => {
    if (task.complete) getDocument({ variables: { task_id: task._id } });
  }, [task._id, task.complete, addDocumentLoading]);

  if (addDocumentLoading) return <Loader />;

  return (
    <Grid
      container
      direction="column"
      alignItems="flex-start"
      justify="center"
      className={classes.taskContainer}
    >
      <Typography className={classes.subTaskTitle}>{` ${task.title}`}</Typography>
      <Grid
        item
        sm={12}
        lg={12}
        style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}
      >
        <DisplayDocument
          documentData={data?.getDealDocService}
          deal={deal}
          phase={phase}
          task={task}
          classes={classes}
          addDocument={addDocument}
          deleteDocument={deleteDocument}
        />
      </Grid>
      <Grid item sm={12} lg={12}>
        <Typography className={classes.taskLastUpdated}>
          Last updated on
          {` ${moment(task.updated_at).format('MM/DD/YY')}`}
        </Typography>
      </Grid>
    </Grid>
  );
}
