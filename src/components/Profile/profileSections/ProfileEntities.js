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
import { capitalize } from 'lodash';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import EditIcon from '@material-ui/icons/Edit';
import AddEntityModal from '../addEntityModal';

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
  },
}));

const ProfileEntities = ({
  data,
  deleteEntity,
  refetchAccountEntities,
  createEntity,
  updateEntity,
  accountEntities,
}) => {
  const classes = useStyles();
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
        <Paper elevation={10} className={classes.table}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left" className={classes.tableHeaderText}>
                  TYPE
                </TableCell>
                <TableCell align="center" className={classes.tableHeaderText}>
                  NAME
                </TableCell>
                <TableCell align="center" className={classes.tableHeaderText}>
                  EMAIL
                </TableCell>
                <TableCell align="center" className={classes.tableHeaderText}>
                  COUNTRY
                </TableCell>
                <TableCell align="center" className={classes.tableHeaderText}>
                  EDIT
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {accountEntities?.getEntities.map((row) => (
                <TableRow key={row?._id} className={classes.row}>
                  <TableCell component="th" scope="row" className={classes.rowText}>
                    {capitalize(row.investor_type)}
                  </TableCell>
                  <TableCell align="center" className={classes.rowText}>
                    {getName(row)}
                  </TableCell>
                  <TableCell align="center" className={classes.rowText}>
                    {row.email}
                  </TableCell>
                  <TableCell align="center" className={classes.rowText}>
                    {row.country}
                  </TableCell>
                  <TableCell align="center">
                    <Fab
                      size="small"
                      color="primary"
                      style={{ cursor: row?.isPrimaryEntity ? 'not-allowed' : 'pointer' }}
                      disabled={row.isPrimaryEntity}
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
