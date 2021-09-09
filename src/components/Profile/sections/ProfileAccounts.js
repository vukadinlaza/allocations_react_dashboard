import React, { useState } from 'react';
import {
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Fab,
} from '@material-ui/core';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import AddAccountModal from '../addAccountModal';

const ProfileAccounts = ({
  classes,
  acctUsers,
  data,
  removeUser,
  refetchAccountUsers,
  userProfile,
}) => {
  const [showAddAccountModal, setAddAccountModal] = useState();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} container justifyContent="flex-end">
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            startIcon={<AddCircleRoundedIcon />}
            onClick={() => setAddAccountModal(true)}
            style={{ width: '200px' }}
          >
            Add new
          </Button>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Paper className="account-paper">
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
                    <Fab
                      size="small"
                      aria-label="Delete"
                      disabled={data?.rootAdmin !== userProfile._id || data.rootAdmin === row._id}
                      style={
                        data?.rootAdmin !== userProfile._id || data.rootAdmin === row._id
                          ? { backgroundColor: 'grey', color: 'white' }
                          : { backgroundColor: 'red', color: 'white' }
                      }
                      onClick={() => {
                        removeUser({
                          onCompleted: refetchAccountUsers(),
                          variables: { userId: row._id, accountId: data?.accountId },
                          notifyOnNetworkStatusChange: true,
                          fetchPolicy: 'no-cache',
                        });
                      }}
                    >
                      <CloseRoundedIcon />
                    </Fab>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>

      <AddAccountModal
        showAddAccountModal={showAddAccountModal}
        setAddAccountModal={setAddAccountModal}
      />
    </Grid>
  );
};

export default ProfileAccounts;
