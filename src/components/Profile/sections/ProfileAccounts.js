import React, { useState } from 'react';
import {
  Typography,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from '@material-ui/core';
import AddAccountModal from '../addAccountModal';

const ProfileAccounts = ({
  classes,
  acctUsers,
  userProfile,
  data,
  removeUser,
  refetchAccountUsers,
}) => {
  const [showAddAccountModal, setAddAccountModal] = useState();

  return (
    <div>
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

      <AddAccountModal
        showAddAccountModal={showAddAccountModal}
        setAddAccountModal={setAddAccountModal}
      />
    </div>
  );
};

export default ProfileAccounts;
