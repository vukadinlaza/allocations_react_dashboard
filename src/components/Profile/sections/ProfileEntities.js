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
import { capitalize } from 'lodash';
import SettingsIcon from '@material-ui/icons/Settings';
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
    <div>
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
              <TableRow key={row?._id}>
                <TableCell component="th" scope="row">
                  {capitalize(row.investor_type)}
                </TableCell>
                <TableCell align="center">{getName(row)}</TableCell>
                <TableCell align="center">{row.email}</TableCell>
                <TableCell align="center">{row.country}</TableCell>
                <TableCell align="center">
                  <SettingsIcon
                    color={row?.isPrimaryEntity ? 'disabled' : 'primary'}
                    style={{ cursor: row?.isPrimaryEntity ? 'not-allowed' : 'pointer' }}
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

      <AddEntityModal
        showEntityModal={showEntityModal}
        setShowEntityModal={setShowEntityModal}
        accountId={data?.accountId}
        refetchAccountEntities={refetchAccountEntities}
        createEntity={createEntity}
        updateEntity={updateEntity}
        deleteEntity={deleteEntity}
      />
    </div>
  );
};

export default ProfileEntities;
