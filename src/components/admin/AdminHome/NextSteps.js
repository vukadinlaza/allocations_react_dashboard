import React, { useEffect, useState } from 'react'
import HelloSign from 'hellosign-embedded'
import { useParams } from 'react-router-dom'

import { Row, Col } from 'reactstrap'
import { Paper, Table, TableBody, TableCell, TableRow, TableHead, Button, LinearProgress } from '@material-ui/core'

const helloSign = new HelloSign({ clientId: 'eda2d58dfbeed4f5eaf8d94a545f7dc5' })

export default function NextSteps ({ org }) {
  const { organization } = useParams()
  const [requests, setRequests] = useState(null)
  const [url, setUrl] = useState(null)
  const [showDoc, setShowDoc] = useState(false)

  const openDoc = (url) => {
    helloSign.on('sign', ({ signature_id }) => {
      // mark as done
    })
    helloSign.open(url, { testMode: true })
  }

  useEffect(() => {
    setRequests(org.signingRequests)
  }, [org])

  if (!requests) return null

  return (
    <Row>
      <Col sm={{size: 8, offset: 2}}>
        <Paper className="NextSteps" style={{marginBottom: "20px", padding: "10px"}}>
          <div className="deals-title">🚨 Next Steps &nbsp;<span className="deals-length">{requests.length}</span></div>
          <Table>
            <TableBody>
              {requests.map(req => (
                <TableRow key={req._id}>
                  <TableCell>{req.title}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => openDoc(req.url)}>Sign</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Col>
    </Row>
  )
}