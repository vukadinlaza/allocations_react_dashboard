import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useParams, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Tooltip } from '@material-ui/core';
import StorefrontIcon from '@material-ui/icons/Storefront';
import DashboardIcon from '@material-ui/icons/Dashboard';
import EditIcon from '@material-ui/icons/Edit';
import ServerTable from '../../utils/ServerTable';
import { nWithCommas } from '../../../utils/numbers';
import { titleCase } from '../../../utils/helpers';

const styles = (theme) => ({
  button: {
    color: 'white',
    fontSize: '16px',
  },
  buttonLink: {
    borderRadius: '100%',
    backgroundColor: '#0462FF',
    padding: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '-6px 0',
    width: '32px',
    height: '32px',
  },
  links: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '110px',
  },
});

const tableVariables = {
  gqlQuery: `
    query FundAdminTables($filter: Object, $pagination: PaginationInput!) {
      fundAdminTables(filter: $filter, pagination: $pagination) {
        count
        deals {
          _id
          company_name
          deal_lead
          AUM
          status
          slug
          dealParams{
            signDeadline
            wireDeadline
          }
          dealOnboarding {
            _id
          }
          organization {
            _id
            slug
          }
        }
      }
    }`,
  headers: [
    { value: 'company_name', label: 'NAME', isFilter: true, isSortable: true },
    { value: 'deal_lead', label: 'FUND MANAGER', isFilter: true, isSortable: true },
    { value: 'AUM', label: 'AUM', type: 'amount', isSortable: true },
    {
      value: 'dealParams',
      label: 'CLOSE DATE',
      type: 'wireDeadline',
      nestedKey: 'wireDeadline',
      sortField: 'dealParams',
      isSortable: true,
    },
    // {drawdown}
    {
      value: 'dealOnboarding',
      label: 'PROCESS STREET STATUS',
      type: 'onboarding',
      isSortable: true,
    },
    { value: 'status', label: 'DEAL STATUS', type: 'status', isFilter: true, isSortable: true },
    { value: 'links', label: 'LINKS', type: 'links', keyNotInData: true, align: 'center' },
  ],
  resolverName: 'fundAdminTables',
  dataVariable: 'deals',
  defaultSortField: 'AUM',
};

const Deals = ({ classes, filter, tableName }) => {
  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'managers':
        return row[headerValue];
      case 'amount':
        return `$${nWithCommas(row[headerValue])}`;
      case 'wireDeadline':
        return row[headerValue]?.wireDeadline
          ? moment(row[headerValue].wireDeadline).format('MM/DD/YYYY')
          : '';
      case 'onboarding':
        return row[headerValue] ? 'Complete' : 'Pending';
      case 'status':
        return titleCase(row[headerValue]);
      case 'links':
        return (
          <div className={classes.links}>
            <Tooltip title="Edit">
              <a
                href={`/admin/${row.organization.slug}/deals/${row._id}/edit`}
                className={classes.buttonLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <EditIcon className={classes.button} />
              </a>
            </Tooltip>
            <Tooltip title="Deal Page">
              <a
                href={`/deals/${row.organization.slug}/${row.slug}`}
                className={classes.buttonLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <StorefrontIcon className={classes.button} />
              </a>
            </Tooltip>
            <Tooltip title="Dashboard">
              <a
                href={`/admin/${row.organization.slug}`}
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

  tableVariables.tableName = tableName;

  return (
    <div>
      <ServerTable
        tableVariables={tableVariables}
        getCellContent={getCellContent}
        queryVariables={filter}
        defaultSortOrder={-1}
      />
    </div>
  );
};

export default withStyles(styles)(withRouter(Deals));
