import React, { useEffect, useState } from 'react'
import HelloSign from 'hellosign-embedded'
import { useParams, useHistory } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import { Row, Col } from 'reactstrap'
import { Paper, Table, TableBody, TableCell, TableRow, TableHead, Button, LinearProgress } from '@material-ui/core'

const helloSign = new HelloSign({ clientId: 'eda2d58dfbeed4f5eaf8d94a545f7dc5' })
const testMode = process.env.NODE_ENV !== "production"

const UPDATE_TASK = gql`
  mutation UpdateTask($slug: String!, $complianceTask: ComplianceTaskInput!) {
    updateComplianceTask(slug: $slug, complianceTask: $complianceTask) {
      _id
    }
  }
`

export default function NextSteps ({ org, refetch }) {
  const history = useHistory()
  const { organization } = useParams()
  const [requests, setRequests] = useState([])
  const [url, setUrl] = useState(null)
  const [showDoc, setShowDoc] = useState(false)
  const [updateTask] = useMutation(UPDATE_TASK, {
    variables: { slug: organization },
    onCompleted: refetch
  })

  const openDoc = ({ __typename, ...req }) => {
    helloSign.on('sign', ({ signature_id }) => {
      // mark as done
      updateTask({ variables: { complianceTask: { ...req, status: "done" } } })
    })
    helloSign.open(req.signature_url, { testMode })
  }

  useEffect(() => {
    // only show signatures for now
    setRequests((org.complianceTasks || []).filter(task => task.is_signature && task.status !== "done"))
  }, [org])

  if (requests.length === 0) return null

  return (
    <Row>
      <Col sm={{size: 8, offset: 2}}>
        <Paper className="NextSteps" style={{marginBottom: "20px", padding: "10px 20px"}}>
          <div className="deals-title">
            🚨 Next Steps &nbsp;
            <span className="deals-length">{requests.length}</span>
            <Button variant="contained" size="small" style={{marginLeft: "15px", marginTop: "-4px"}} onClick={() => history.push(`/admin/${organization}/compliance`)}>ALL</Button>
          </div>
          <Paper style={{paddingTop: "10px"}}>
            <Table>
              <TableBody>
                {requests.map(req => (
                  <TableRow key={req._id}>
                    <TableCell style={{fontSize: "1em"}}>{req.task}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="secondary" onClick={() => openDoc(req)}>Sign</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Paper>
      </Col>
    </Row>
  )
}