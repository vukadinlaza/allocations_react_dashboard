import React, { useEffect, useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Typography, Paper, Grid, Button, Table, TableBody, TableHead, TableCell, TableRow } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { capitalize } from 'lodash';
import { toast } from 'react-toastify';
import SettingsIcon from '@material-ui/icons/Settings';
import InvestorEditForm from '../forms/InvestorEdit';
import { useAuth } from '../../auth/useAuth';
import Loader from '../utils/Loader';
import AddAccountModal from './addAccountModal';
import AddEntityModal from './addEntityModal';
import './style.scss';

/** *
 *
 * investor profile / edit
 *
 * */

const GET_INVESTOR = gql`
  query GetInvestor($email: String, $_id: String) {
    investor(email: $email, _id: $_id) {
      _id
      first_name
      last_name
      entity_name
      country
      investor_type
      signer_full_name
      accredited_investor_status
      email
      account {
        _id
      }
      accredidation_doc {
        link
        path
      }
      passport {
        link
        path
      }
    }
  }
`;
const GET_ACCOUNT_USERS = gql`
  query data {
    accountUsers {
      _id
      first_name
      last_name
      name
      email
    }
    rootAdmin
    accountId
  }
`;
const REMOVE_ACCT_USER = gql`
  mutation RemoveAcctUser($accountId: String, $userId: String!) {
    removeAcctUser(accountId: $accountId, userId: $userId)
  }
`;
const CREATE_ENTITY = gql`
  mutation createEntity($payload: Object) {
    createEntity(payload: $payload)
  }
`;

const REMOVE_ACCT_ENTITY = gql`
  mutation DeleteEntity($accountId: String, $entityId: String!) {
    deleteEntity(accountId: $accountId, entityId: $entityId)
  }
`;

const UPDATE_ENTITY = gql`
  mutation UpdateEntity($payload: EntityInput!) {
    updateEntity(payload: $payload) {
      _id
      first_name
      last_name
      country
      entity_name
      investor_type
      signer_full_name
      accredited_investor_status
      email
      passport {
        link
        path
      }
    }
  }
`;

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function Profile() {
  const [investor, setInvestor] = useState(null);
  const [showAddAccountModal, setAddAccountModal] = useState();
  const [showEntityModal, setShowEntityModal] = useState();
  const [formStatus, setFormStatus] = useState('edit');
  const { userProfile, refetch: refetchUser } = useAuth(GET_INVESTOR);
  const { data, refetch: refetchAccountUsers } = useQuery(GET_ACCOUNT_USERS);
  const [createEntity, { data: createEntityRes }] = useMutation(CREATE_ENTITY);
  const [deleteEntity, { data: deleteEntityRes }] = useMutation(REMOVE_ACCT_ENTITY);
  const [updateEntity, { data: updateEntityRes }] = useMutation(UPDATE_ENTITY);
  const { data: accountEntities, refetch: refetchAccountEntities } = useQuery(GET_ACCOUNT_ENTITIES, {
    variables: { accountId: userProfile?.account?._id },
  });

  const [removeUser, { data: removeRes }] = useMutation(REMOVE_ACCT_USER);
  const classes = useStyles();

  useEffect(() => {
    if (userProfile) {
      setInvestor(userProfile);
    }
  }, [userProfile]);
  useEffect(() => {
    if (removeRes) {
      refetchAccountUsers();
    }
  }, [refetchAccountUsers, removeRes]);

  useEffect(() => {
    if (formStatus === 'complete') {
      refetchAccountUsers();
      refetchUser();
    }
  }, [formStatus, refetchAccountUsers, refetchUser]);
  useEffect(() => {
    if (createEntityRes || deleteEntityRes || updateEntityRes) {
      refetchAccountEntities();
    }
  }, [createEntityRes, refetchAccountEntities, deleteEntityRes, updateEntityRes]);

  const icon = formStatus === 'loading' ? 'circle-notch' : formStatus === 'complete' ? 'check' : null;
  if (!userProfile.email || !userProfile?.account)
    return (
      <div>
        <Loader />
      </div>
    );
  const acctUsers = data?.accountUsers || [];
  return (
    <>
      <InvestorEditForm
        investor={investor}
        userProfile={userProfile}
        icon={icon}
        setInvestor={setInvestor}
        setFormStatus={setFormStatus}
        actionText="Save Profile"
      />
      <AccountUsers
        classes={classes}
        acctUsers={acctUsers}
        userProfile={userProfile}
        data={data}
        setAddAccountModal={setAddAccountModal}
        removeUser={removeUser}
        refetchAccountUsers={refetchAccountUsers}
      />
      <AccountEntities
        classes={classes}
        acctUsers={acctUsers}
        userProfile={userProfile}
        data={data}
        setShowEntityModal={setShowEntityModal}
        deleteEntity={deleteEntity}
        refetchAccountUsers={refetchAccountUsers}
        accountEntities={accountEntities}
      />
      <AddAccountModal showAddAccountModal={showAddAccountModal} setAddAccountModal={setAddAccountModal} />
      <AddEntityModal
        showEntityModal={showEntityModal}
        setShowEntityModal={setShowEntityModal}
        accountId={data?.accountId}
        refetchAccountEntities={refetchAccountEntities}
        createEntity={createEntity}
        updateEntity={updateEntity}
        deleteEntity={deleteEntity}
      />
    </>
  );
}

const AccountUsers = ({
  classes,
  acctUsers,
  userProfile,
  data,
  setAddAccountModal,
  removeUser,
  refetchAccountUsers,
}) => {
  return (
    <Paper className="account-paper">
      <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" gutterBottom>
          Accounts
        </Typography>
        <Button color="primary" variant="contained" onClick={() => setAddAccountModal(true)}>
          Add new
        </Button>
      </Grid>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="center">Email </TableCell>
            <TableCell align="center">Account</TableCell>
            <TableCell align="center">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {acctUsers.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="center">{row.email}</TableCell>
              <TableCell align="center">{row._id}</TableCell>
              <TableCell align="center">
                {' '}
                <Button
                  color="primary"
                  variant="contained"
                  disabled={data?.rootAdmin !== userProfile._id || data.rootAdmin === row._id}
                  onClick={() => {
                    removeUser({
                      onCompleted: refetchAccountUsers(),
                      variables: { userId: row._id, accountId: data?.accountId },
                      notifyOnNetworkStatusChange: true,
                      fetchPolicy: 'no-cache',
                    });
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

const GET_ACCOUNT_ENTITIES = gql`
  query data($accountId: String) {
    getEntities(accountId: $accountId) {
      _id
      first_name
      last_name
      name
      email
      entity_name
      investor_type
      signer_full_name
      country
      isPrimaryEntity
    }
  }
`;

const AccountEntities = ({
  classes,
  userProfile,
  data,
  setShowEntityModal,
  deleteEntity,
  refetchAccountUsers,
  accountEntities,
}) => {
  const getName = (investor) => {
    if (investor.investor_type === 'entity') {
      return investor.entity_name;
    }
    return investor.signer_full_name;
  };

  if (!accountEntities?.getEntities) return null;
  return (
    <Paper className="account-paper">
      <Grid style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" gutterBottom>
          Entities
        </Typography>
        <Button color="primary" variant="contained" onClick={() => setShowEntityModal(true)}>
          Add new
        </Button>
      </Grid>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Type</TableCell>
            <TableCell align="center">Name </TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Country</TableCell>
            <TableCell align="center" />
          </TableRow>
        </TableHead>
        <TableBody>
          {accountEntities?.getEntities.map((row) => (
            <TableRow key={row._id}>
              <TableCell component="th" scope="row">
                {capitalize(row.investor_type)}
              </TableCell>
              <TableCell align="center">{getName(row)}</TableCell>
              <TableCell align="center">{row.email}</TableCell>
              <TableCell align="center">{row.country}</TableCell>
              <TableCell align="center">
                <SettingsIcon
                  color={row.isPrimaryEntity ? 'disabled' : 'primary'}
                  style={{ cursor: row.isPrimaryEntity ? 'not-allowed' : 'pointer' }}
                  onClick={() => {
                    if (row.isPrimaryEntity) {
                      return;
                    }
                    setShowEntityModal(row);
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};
