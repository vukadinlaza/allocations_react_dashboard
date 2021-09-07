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
import { capitalize } from 'lodash';
import SettingsIcon from '@material-ui/icons/Settings';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import EditIcon from '@material-ui/icons/Edit';
import AddEntityModal from '../addEntityModal';

const ProfileEntities = ({
  classes,
  data,
  deleteEntity,
  refetchAccountEntities,
  createEntity,
  updateEntity,
  accountEntities,
}) => {
  const [showEntityModal, setShowEntityModal] = useState();

  const getName = (investor) => {
    if (investor.investor_type === 'entity') {
      return investor.entity_name;
    }
    return investor.signer_full_name;
  };

  if (!accountEntities?.getEntities) return null;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} container justifyContent="flex-end">
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            startIcon={<AddCircleRoundedIcon />}
            onClick={() => setShowEntityModal(true)}
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
                <TableCell align="left">Type</TableCell>
                <TableCell align="center">Name </TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Country</TableCell>
                <TableCell align="center">Edit</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {accountEntities?.getEntities.map((row) => (
                <TableRow key={row?._id}>
                  <TableCell component="th" scope="row">
                    {capitalize(row.investor_type)}
                  </TableCell>
                  <TableCell align="center">{getName(row)}</TableCell>
                  <TableCell align="center">{row.email}</TableCell>
                  <TableCell align="center">{row.country}</TableCell>
                  <TableCell align="center">
                    <Fab
                      size="small"
                      color={row?.isPrimaryEntity ? 'disabled' : 'primary'}
                      style={{ cursor: row?.isPrimaryEntity ? 'not-allowed' : 'pointer' }}
                      onClick={() => {
                        if (row.isPrimaryEntity) {
                          return;
                        }
                        setShowEntityModal(row);
                      }}
                      aria-label="add"
                    >
                      <EditIcon />
                    </Fab>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>

      <AddEntityModal
        showEntityModal={showEntityModal}
        setShowEntityModal={setShowEntityModal}
        accountId={data?.accountId}
        refetchAccountEntities={refetchAccountEntities}
        createEntity={createEntity}
        updateEntity={updateEntity}
        deleteEntity={deleteEntity}
      />
    </Grid>
  );
};

export default ProfileEntities;
