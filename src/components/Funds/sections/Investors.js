import React from 'react';
import { withRouter } from 'react-router-dom';
import { Tooltip } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import ServerTable from '../../utils/ServerTable';
import { nWithCommas } from '../../../utils/numbers';

const investorVariables = {
  gqlQuery: `
    query AllUsers($pagination: PaginationInput!) {
      allUsers(pagination: $pagination) {
        count
        users {
          _id
          first_name
          last_name
          email
          entity_name
          investments{
            _id
            amount
          }
        }
      }
    }`,
  headers: [
    { value: 'first_name', label: 'FIRST NAME', isFilter: true, isSortable: true },
    { value: 'last_name', label: 'LAST NAME', isFilter: true, isSortable: true },
    { value: 'email', label: 'EMAIL', isFilter: true, isSortable: true },
    {
      value: 'investmentAmount',
      label: 'TOTAL AUM',
      type: 'investmentAmount',
      keyNotInData: true,
      isSortable: true,
    },
    {
      value: 'investments',
      label: 'TOTAL INVESTMENTS',
      type: 'count',
      align: 'center',
      alignHeader: true,
      isSortable: true,
    },
    {
      value: 'links',
      label: 'LINKS',
      keyNotInData: true,
      type: 'links',
      align: 'center',
      alignHeader: true,
    },
  ],
  resolverName: 'allUsers',
  dataVariable: 'users',
  defaultSortField: 'investmentAmount',
};

const Investors = ({ classes, history }) => {
  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'investmentAmount':
        return row.investments?.length
          ? `$${nWithCommas(
              row.investments.map((i) => i.amount).reduce((acc, n) => Number(acc) + Number(n)),
            )}`
          : 0;

      case 'count':
        return row[headerValue].length;

      case 'links':
        return (
          <div className={classes.links}>
            <Tooltip title="Investments">
              <a
                href={`/admin/users/${row._id}/investments`}
                className={classes.buttonLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <TrendingUpIcon className={classes.button} />
              </a>
            </Tooltip>
            <Tooltip title="Profile">
              <a
                href={`/admin/users/${row._id}`}
                className={classes.buttonLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AccountCircleIcon className={classes.button} />
              </a>
            </Tooltip>
            <Tooltip title="Dashboard">
              <a
                href={`/investor/${row._id}/home`}
                className={classes.buttonLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DashboardIcon className={classes.button} />
              </a>
            </Tooltip>
          </div>
        );
      default:
        return <div />;
    }
  };

  return (
    <div>
      <ServerTable
        tableVariables={investorVariables}
        getCellContent={getCellContent}
        defaultSortOrder={-1}
      />
    </div>
  );
};

export default withRouter(Investors);
