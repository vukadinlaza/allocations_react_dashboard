import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { useAuth } from "../../../auth/useAuth"
import { useParams, Link } from 'react-router-dom'
import { Paper, Table, TableBody, TableCell, TableRow, TableHead, TextField, Button, LinearProgress, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core'
import { Col, Row } from 'reactstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from '../../utils/Loader'
import "./style.scss"

const ORG_COMPLIANCE = gql`
  query OrgCompliance($slug: String!) {
    organization(slug: $slug) {
      _id
      name
      slug
      complianceTasks {
        _id
        completed
        status
        task
      }
    }
  }
`

const CREATE_TASK = gql`
  mutation CreateTask($slug: String!, $complianceTask: ComplianceTaskInput!) {
    createComplianceTask(slug: $slug, complianceTask: $complianceTask) {
      _id
    }
  }
`

const UPDATE_TASK = gql`
  mutation UpdateTask($slug: String!, $complianceTask: ComplianceTaskInput!) {
    updateComplianceTask(slug: $slug, complianceTask: $complianceTask) {
      _id
    }
  }
`

const DELETE_TASK = gql`
  mutation DeleteTask($_id: String!) {
    deleteComplianceTask(_id: $_id)
  }
`

export default function Compliance ({ data, error, refetch }) {
  if (!data || !data.organization) return <Loader />

  return (
    <Row>
      <Col sm={{size: 8, offset: 1}}>
        <Paper className="Compliance" style={{padding: "25px"}}>
          <CreateTask refetch={refetch} />
          <Paper style={{marginTop: "15px"}}>
            <Table>
              <TableBody>
                {data.organization.complianceTasks.map(task => (
                  <Task key={task._id} task={task} />
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Paper>
      </Col>
    </Row>
  )
}

function CreateTask ({ refetch }) {
  const [task, setTask] = useState("")
  const { organization: slug } = useParams()
  const [createTask] = useMutation(CREATE_TASK, {
    variables: { slug },
    onCompleted: refetch
  })

  return (
    <div>
      <TextField variant="outlined" 
        label="New Compliance Task" 
        value={task} 
        onChange={e => setTask(e.target.value)} 
        style={{width: "80%"}} />
      <Button style={{width: "10%", marginLeft: "2%"}} color="primary" variant="contained" onClick={() => createTask({ variables: { complianceTask: { task, status: "not_started" } }})}>
        ADD
      </Button>
    </div>
  )
}

const prettyStatus = (status) => status.split('_').join(' ') 
const statuses = [
  "not_started",
  "waiting",
  "in_progress",
  "done"
]

function Task ({ task, refetch }) {
  const [status, setStatus] = useState("")
  const { organization } = useParams()
  const [updateTask] = useMutation(UPDATE_TASK, {
    variables: { slug: organization },
    onCompleted: refetch
  })

  const [deleteTask] = useMutation(DELETE_TASK, { 
    onCompleted: refetch 
  })

  useEffect(() => {
    if (task) setStatus(task.status)
  }, [task])

  return (
    <TableRow>
      <TableCell style={{fontSize: "1.1em"}}>{task.task}</TableCell>
      <TableCell>
        <FormControl variant="outlined" size="small" style={{width: "100%"}}>
          <InputLabel>
            Status
          </InputLabel>
          <Select value={status}
            onChange={e => {
              updateTask({ variables: { complianceTask: { status: e.target.value, _id: task._id }}})
              setStatus(e.target.value)
            }}
          >
            {statuses.map(_status => (
              <MenuItem key={_status} value={_status}>{_.startCase(_status)}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </TableCell>
      <TableCell>
        <Button variant="contained" color="secondary" size="small" onClick={() => deleteTask({ variables: { _id: task._id } })}>
          DELETE
        </Button>
      </TableCell>
    </TableRow>
  )
}