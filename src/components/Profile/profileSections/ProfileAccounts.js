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
import { makeStyles } from '@material-ui/core/styles';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import AddAccountModal from '../profileModals/addAccountModal';

const useStyles = makeStyles((theme) => ({
  checkCircle: {
    color: theme.palette.primary.main,
  },
  tableHeaderText: {
    color: '#2A2B54 !important',
  },
  row: {
    background: theme.palette.row,
    '&:hover': {
      background: theme.palette.rowHover,
    },
  },
  rowText: {
    color: '#2A2B54 !important',
  },
  table: {
    boxShadow: '0px 3px 6px #00000029',
    border: '1px solid #8493A640 !important',
    borderRadius: '10px',
    overflowX: 'auto',
    width: '100%',
  },
}));

const ProfileAccounts = ({ acctUsers, data, removeUser, refetchAccountUsers, userProfile }) => {
  const classes = useStyles();
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
        <Paper className={classes.table}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left" className={classes.tableHeaderText}>
                  Name
                </TableCell>
                <TableCell align="center" className={classes.tableHeaderText}>
                  Email{' '}
                </TableCell>
                <TableCell align="center" className={classes.tableHeaderText}>
                  Account
                </TableCell>
                <TableCell align="center" className={classes.tableHeaderText}>
                  Delete
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {acctUsers.map((row) => (
                <TableRow key={row.name} className={classes.row}>
                  <TableCell component="th" scope="row" className={classes.rowText}>
                    {row.name}
                  </TableCell>
                  <TableCell align="center" className={classes.rowText}>
                    {row.email}
                  </TableCell>
                  <TableCell align="center" className={classes.rowText}>
                    {row._id}
                  </TableCell>
                  <TableCell align="center" className={classes.rowText}>
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
