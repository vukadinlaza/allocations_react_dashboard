import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useMutation, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import { Col, Row } from 'reactstrap';
import { useSimpleReducer } from '../../../utils/hooks';
import Loader from '../../utils/Loader';
import './style.scss';

const CREATE_TASK = gql`
  mutation CreateTask($slug: String!, $complianceTask: ComplianceTaskInput!) {
    createComplianceTask(slug: $slug, complianceTask: $complianceTask) {
      _id
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($slug: String!, $complianceTask: ComplianceTaskInput!) {
    updateComplianceTask(slug: $slug, complianceTask: $complianceTask) {
      _id
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($_id: String!) {
    deleteComplianceTask(_id: $_id)
  }
`;

export default function Compliance({ data, refetch }) {
  if (!data || !data.organization) return <Loader />;

  const { organization } = data;
  return (
    <Row>
      <Col sm={{ size: 8, offset: 1 }}>
        <Paper className="Compliance" style={{ padding: '25px' }}>
          <CreateTask refetch={refetch} templates={organization.documentTemplates} />
          <Paper style={{ marginTop: '15px' }}>
            <Table>
              <TableBody>
                {data.organization.complianceTasks.map((task) => (
                  <Task key={task._id} task={task} />
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Paper>
      </Col>
    </Row>
  );
}

function CreateTask({ refetch, templates }) {
  const [task, setTask] = useSimpleReducer({
    task: '',
    is_signature: 'false',
    signature_template: '',
  });
  const { organization: slug } = useParams();
  const [createTask] = useMutation(CREATE_TASK, {
    variables: { slug },
    onCompleted: refetch,
  });

  return (
    <Paper style={{ padding: '10px' }}>
      <TextField
        label="New Compliance Task"
        value={task.task}
        onChange={(e) => setTask({ task: e.target.value })}
        style={{ width: '100%', marginBottom: '20px' }}
      />
      <FormControl size="small" style={{ width: '30%' }}>
        <InputLabel>Signature?</InputLabel>
        <Select
          value={task.is_signature}
          onChange={(e) => setTask({ is_signature: e.target.value })}
        >
          <MenuItem value="true">Yes</MenuItem>
          <MenuItem value="false">No</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" style={{ width: '65%', marginLeft: '5%' }}>
        <InputLabel>Template</InputLabel>
        <Select
          disabled={task.is_signature === 'false'}
          value={task.signature_template}
          onChange={(e) => setTask({ signature_template: e.target.value })}
        >
          {(templates || []).map((template) => (
            <MenuItem key={template._id} value={template._id}>
              {template.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        style={{ marginTop: '10px' }}
        color="primary"
        variant="contained"
        onClick={() =>
          createTask({
            variables: {
              complianceTask: {
                ...task,
                is_signature: task.is_signature === 'true',
                status: 'not_started',
              },
            },
          })
        }
      >
        ADD
      </Button>
    </Paper>
  );
}

const statuses = ['not_started', 'waiting', 'in_progress', 'done'];

function Task({ task, refetch }) {
  const [status, setStatus] = useState('');
  const { organization } = useParams();
  const [updateTask] = useMutation(UPDATE_TASK, {
    variables: { slug: organization },
    onCompleted: refetch,
  });

  const [deleteTask] = useMutation(DELETE_TASK, {
    onCompleted: refetch,
  });

  useEffect(() => {
    if (task) setStatus(task.status);
  }, [task]);

  return (
    <TableRow>
      <TableCell style={{ fontSize: '1.1em' }}>{task.task}</TableCell>
      <TableCell>
        <FormControl size="small" style={{ width: '100%' }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => {
              updateTask({
                variables: { complianceTask: { status: e.target.value, _id: task._id } },
              });
              setStatus(e.target.value);
            }}
          >
            {statuses.map((_status) => (
              <MenuItem key={_status} value={_status}>
                {_.startCase(_status)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </TableCell>
      <TableCell>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => deleteTask({ variables: { _id: task._id } })}
        >
          DELETE
        </Button>
      </TableCell>
    </TableRow>
  );
}
