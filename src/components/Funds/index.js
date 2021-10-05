import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Table, TableBody, TableCell, TableRow, Paper } from '@material-ui/core';
import { useAuth } from '../../auth/useAuth';
import './style.scss';

import Typography from '@material-ui/core/Typography';
import Loader from '../utils/Loader';

/** *
 *
 * Table view of Funds that a user is an admin on
 *
 * */

export default function Funds() {
  const { userProfile } = useAuth();
  const history = useHistory();
  const location = useLocation();
  console.log(location);

  if (!userProfile.email)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <>
      {/* <div className="small-header text-left">Funds Admin &nbsp;&nbsp;</div> */}
      {/* {userProfile.admin &&
      <Button onClick={() => history.push("/admin/organizations/new")}
              color="primary">
        CREATE FUND MANAGER
      </Button>} */}

      <Paper>
        <Typography variant="h6" style={{ paddingLeft: '16px', paddingTop: '16px' }} gutterBottom>
          {location.pathname.includes('spv') ? 'SPVs' : 'Funds'} Admin
        </Typography>
        <Typography variant="subtitle2" style={{ paddingLeft: '16px', paddingBottom: '16px' }}>
          Below is a list of all the funds you have access to manage.
        </Typography>
        <Table>
          <TableBody>
            {(userProfile.organizations_admin || []).map((org) => (
              <TableRow key={org._id} className="admin-link">
                <TableCell>
                  {/* funds-table */}
                  {org.name} Admin
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => history.push(`/admin/${org.slug}`)}
                    variant="contained"
                    size="small"
                    color="primary"
                  >
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}
