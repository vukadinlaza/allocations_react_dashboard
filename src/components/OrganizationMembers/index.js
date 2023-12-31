import React, { useState, useEffect } from 'react';
import { useMutation, useLazyQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Paper, Table, TableBody, TableCell, TextField, TableRow, Button } from '@material-ui/core';
import { Col, Row } from 'reactstrap';
import * as API from '../../api';
import Loader from '../utils/Loader';
import styles from './styles';

/** *
 *
 * shows the admin members of a fund, superadmins can add/rm members from any fund
 *
 * */

const SEND_ADMIN_INVITE = gql`
  mutation SendAdminInvite($slug: String!, $user_id: String!) {
    sendAdminInvite(slug: $slug, user_id: $user_id) {
      status
    }
  }
`;

const REVOKE_MEMBERSHIP = gql`
  mutation RevokeMembership($slug: String!, $user_id: String!) {
    revokeOrganizationMembership(slug: $slug, user_id: $user_id) {
      _id
    }
  }
`;

const ADD_MEMBERSHIP = gql`
  mutation AddMembership($slug: String!, $user_id: String!) {
    addOrganizationMembership(slug: $slug, user_id: $user_id) {
      _id
    }
  }
`;
function Member({ org, member, sendAdminInvite, revokeMembership, classes }) {
  const invite = org.adminInvites.filter((i) => i).find((i) => i.to === member.email);

  const inviteArea = invite ? (
    <Button
      size="small"
      className={classes.noOutline}
      endIcon={<FontAwesomeIcon icon="paper-plane" />}
    >
      Sent{' '}
    </Button>
  ) : (
    <Button
      color="secondary"
      size="small"
      className={classes.noOutline}
      variant="contained"
      onClick={() => sendAdminInvite({ variables: { user_id: member._id } })}
      endIcon={<FontAwesomeIcon icon="envelope" />}
    >
      Send
    </Button>
  );

  return (
    <TableRow>
      <TableCell>
        {member.name}{' '}
        {member.first_name && member.investor_type === 'entity'
          ? `[${member.first_name} ${member.last_name}]`
          : ''}
      </TableCell>
      <TableCell>{member.email}</TableCell>
      <TableCell>{inviteArea}</TableCell>
      <TableCell>
        <Button
          color="secondary"
          variant="contained"
          className={classes.noOutline}
          onClick={() => revokeMembership({ variables: { user_id: member._id } })}
        >
          Revoke
        </Button>
      </TableCell>
    </TableRow>
  );
}

function UserSearch({ refetch, classes }) {
  const { organization } = useParams();
  const [q, setQ] = useState('');
  const [records, setRecords] = useState([]);
  const [search, searchRes] = useLazyQuery(API.users.search);
  const [addMembership] = useMutation(ADD_MEMBERSHIP, {
    variables: { slug: organization },
    onCompleted: () => refetch() && setQ('') && setRecords([]),
  });
  console.log('first');
  useEffect(() => {
    search({ variables: { fields: ['email'], searchTerm: q } });
  }, [q]);

  useEffect(() => {
    if (searchRes.data && searchRes.data.searchUsers) {
      setRecords(q === '' ? [] : searchRes.data.searchUsers);
    }
  }, [searchRes.data]);

  return (
    <div>
      <TextField
        style={{ width: '100%' }}
        required
        value={q}
        label="Add Admin"
        variant="filled"
        onChange={(e) => setQ(e.target.value)}
      />
      <Paper>
        <Table>
          <TableBody>
            {records.map((record) => (
              <TableRow
                key={record._id}
                className={classes.assocOption}
                onClick={() => addMembership({ variables: { user_id: record._id } })}
              >
                <TableCell>
                  {record.name}{' '}
                  {record.first_name && record.investor_type === 'entity'
                    ? `[${record.first_name} ${record.last_name}]`
                    : ''}
                </TableCell>
                <TableCell>{record.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default function OrganizationMembers({ data, refetch }) {
  const classes = styles();
  const { organization } = useParams();
  const [revokeMembership] = useMutation(REVOKE_MEMBERSHIP, {
    variables: { slug: organization },
    onCompleted: refetch,
  });

  const [sendAdminInvite] = useMutation(SEND_ADMIN_INVITE, {
    variables: { slug: organization },
    onCompleted: refetch,
  });

  if (!data) return <Loader />;

  return (
    <div>
      <Row>
        <Col sm={{ size: 8, offset: 1 }}>
          <Paper style={{ margin: '10px 0px' }}>
            <UserSearch refetch={refetch} classes={classes} />
          </Paper>
          <Paper style={{ marginTop: '15px' }}>
            <Table>
              <TableBody>
                {data.organization?.members?.map((member) => (
                  <Member
                    key={member._id}
                    org={data.organization}
                    member={member}
                    sendAdminInvite={sendAdminInvite}
                    revokeMembership={revokeMembership}
                    classes={classes}
                  />
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Col>
      </Row>
    </div>
  );
}
