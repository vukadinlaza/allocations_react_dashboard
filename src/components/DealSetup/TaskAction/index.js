import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { gql, useMutation, useLazyQuery, useQuery } from '@apollo/client';
import {
  DocumentUploadTask,
  TextTask,
  ReviewTask,
  taskTypes,
  KYCServiceTask,
  SignTask,
} from '../Tasks';
import styles from '../styles';

const ADD_DOC = gql`
  mutation addDealDocService($deal_id: String!, $task_id: String!, $doc: Upload!, $phase: String) {
    addDealDocService(deal_id: $deal_id, task_id: $task_id, doc: $doc, phase: $phase)
  }
`;
const COMPLETE_REVIEW = gql`
  mutation updateDealTask($deal_id: String!, $task_id: String!, $phase: String!) {
    updateDealTask(deal_id: $deal_id, task_id: $task_id, phase: $phase) {
      _id
    }
  }
`;
const UPDATE_DEAL_SERVICE = gql`
  mutation UpdateDealService(
    $deal_id: String!
    $task_id: String!
    $phase: String!
    $payload: Object!
  ) {
    updateDealService(deal_id: $deal_id, task_id: $task_id, phase: $phase, payload: $payload) {
      _id
    }
  }
`;
const DELETE_DOCUMENT = gql`
  mutation deleteDealDocument($document_id: String!, $task_id: String!, $phase_id: String!) {
    deleteDealDocument(document_id: $document_id, task_id: $task_id, phase_id: $phase_id)
  }
`;

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

const SERVICES_AGREEMENT_LINK = gql`
  query servicesAgreementLink($deal_id: String) {
    dataRequest: getServicesAgreementLink(deal_id: $deal_id) {
      dataRequestId: id
      tokenId: token_id
      tokenSecret: token_secret
    }
  }
`;

const TaskAction = ({
  task,
  deal,
  refetchDeal,
  phase,
  setTaskLoading,
  gettingTaskData,
  setGettingTaskData,
  classes,
}) => {
  const { _id: deal_id } = deal;
  const [updateDeal] = useMutation(UPDATE_DEAL_SERVICE, {
    onCompleted: () => {
      refetchDeal();
    },
  });
  const [getDocument, { data: documentData }] = useLazyQuery(GET_DOCUMENT, {
    fetchPolicy: 'network-only',
    onCompleted: () => {
      setGettingTaskData(false);
      setTaskLoading(false);
    },
  });
  const [updateReview] = useMutation(COMPLETE_REVIEW, {
    onCompleted: () => {
      setTaskLoading(false);
      refetchDeal();
    },
    onError: (error) => {
      setTaskLoading(false);
    },
  });
  const [addDoc] = useMutation(ADD_DOC, {
    onCompleted: () => {
      setTimeout(() => {
        // RefetchDeal gets triggered before the phase can be updated. TODO: Find better solution instead of setTimeout
        refetchDeal();
        getDocument({ variables: { task_id: task._id } });
      }, 3000);
    },
  });
  const [deleteDoc] = useMutation(DELETE_DOCUMENT, {
    onCompleted: () => {
      refetchDeal();
      getDocument({ variables: { task_id: task._id } });
    },
  });

  const { data: servicesAgreementLink } = useQuery(SERVICES_AGREEMENT_LINK, {
    variables: { deal_id },
  });

  const [taskData, setTaskData] = useState({ ...deal });

  const handleChange = (prop) => (e) => {
    e.persist();
    return setTaskData((prev) => ({ ...prev, [prop]: e.target.value }));
  };

  const handleUploadDeal = () => {
    updateDeal({
      variables: {
        deal_id,
        phase: phase.name,
        task_id: task._id,
        payload: taskData,
      },
    });
  };

  let action = null;
  console.log(
    { phase },
    phase.tasks.every((t) => t.complete),
  );
  if (taskTypes.text.includes(task.type)) {
    action = (
      <TextTask
        handleChange={handleChange}
        taskData={taskData}
        task={task}
        handleUploadDeal={handleUploadDeal}
      />
    );
  }
  if (taskTypes.docUpload.includes(task.type)) {
    action = (
      <DocumentUploadTask
        task={task}
        deal_id={deal_id}
        addDoc={addDoc}
        phase={phase}
        setTaskLoading={setTaskLoading}
        documentData={documentData?.getDealDocService}
        getDocument={getDocument}
        deleteDoc={deleteDoc}
        classes={classes}
        gettingTaskData={gettingTaskData}
        setGettingTaskData={setGettingTaskData}
      />
    );
  }

  if (taskTypes.review.includes(task.type)) {
    action = (
      <ReviewTask
        task={task}
        deal_id={deal_id}
        phase_name={phase.name}
        updateReview={updateReview}
        setTaskLoading={setTaskLoading}
        previousTasksCompleted={phase?.tasks
          ?.filter((t) => t.type !== 'admin-review')
          .every((t) => t.complete)}
      />
    );
  }

  if (taskTypes.automaticTasks.includes(task.type) && task.title.includes('KYC')) {
    action = <KYCServiceTask task={task} taskData={taskData} />;
  }

  if (taskTypes.userTask.includes(task.type)) {
    action = <SignTask {...(servicesAgreementLink?.dataRequest ?? {})} />;
  }

  return action;
};

export default withStyles(styles)(TaskAction);
