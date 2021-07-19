import React from 'react';
import _ from 'lodash';
import { useQuery } from '@apollo/client';
import { gql } from 'apollo-boost';
import { useParams } from 'react-router-dom';
import { Paper, Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { Col, Row } from 'reactstrap';
import Loader from '../../utils/Loader';
import './style.scss';

/** *
 *
 * list of outstanding compliance tasks
 *
 * */

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
`;

export default function Compliance() {
  const { organization } = useParams();
  const { data } = useQuery(ORG_COMPLIANCE, { variables: { slug: organization } });

  if (!data || !data.organization) return <Loader />;

  return (
    <Row>
      <Col sm={{ size: 6, offset: 3 }}>
        <Paper className="Compliance" style={{ padding: '25px' }}>
          <h4 style={{ paddingBottom: '15px', textAlign: 'center' }}>{data.organization.name} Compliance</h4>
          <Paper>
            {data.organization.complianceTasks.length === 0 && (
              <div style={{ padding: '10px', textAlign: 'center' }}>You Dont Have Any current Compliance Tasks!</div>
            )}
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

const prettyStatus = (status) => (status || 'not_started').split('_').join(' ');
function Task({ task }) {
  return (
    <TableRow>
      <TableCell>{task.task}</TableCell>
      <TableCell>
        <span className="task-status" data-status={task.status}>
          {prettyStatus(task.status)}
        </span>
      </TableCell>
    </TableRow>
  );
}
