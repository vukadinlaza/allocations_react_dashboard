import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useParams, withRouter } from 'react-router-dom';
import { Tooltip } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ServerTable from '../../utils/ServerTable';
import { nWithCommas } from '../../../utils/numbers';
import { titleCase } from '../../../utils/helpers';

const tableVariables = {
  gqlQuery: `
    query PagOrganization($pagination: PaginationInput!) {
      pagOrganizations(pagination: $pagination) {
        count
        organizations {
          _id
          name
          slug
          totalAUM
          totalPrivateFunds
          totalFunds
          totalSPVs
          totalFundAUM
          totalSPVAUM
          totalInvestors
        }
      }
    }`,
  headers: [
    { value: 'name', label: 'NAME', isFilter: true, isSortable: true },
    {
      value: 'totalAUM',
      label: 'TOTAL AUM',
      isSortable: true,
      type: 'amount',
      keyNotInData: true,
      align: 'right',
      alignHeader: true,
    },
    {
      value: 'totalPrivateFunds',
      label: 'TOTAL PRIVATE FUNDS',
      isSortable: true,
      type: 'count',
      keyNotInData: true,
      align: 'right',
      alignHeader: true,
    },
    {
      value: 'totalFunds',
      label: 'TOTAL FUNDS',
      isSortable: true,
      type: 'count',
      keyNotInData: true,
      align: 'right',
      alignHeader: true,
    },
    {
      value: 'totalFundAUM',
      label: 'TOTAL FUND AUM',
      isSortable: true,
      type: 'amount',
      keyNotInData: true,
      align: 'right',
      alignHeader: true,
    },
    {
      value: 'totalSPVs',
      label: 'TOTAL SPVS',
      isSortable: true,
      type: 'count',
      keyNotInData: true,
      align: 'right',
      alignHeader: true,
    },
    {
      value: 'totalSPVAUM',
      label: 'TOTAL SPV AUM',
      isSortable: true,
      type: 'amount',
      keyNotInData: true,
      align: 'right',
      alignHeader: true,
    },
    {
      value: 'totalInvestors',
      label: 'TOTAL INVESTORS',
      isSortable: true,
      type: 'count',
      keyNotInData: true,
      align: 'right',
      alignHeader: true,
    },
    { value: 'slug', label: 'LINKS', isSortable: true, type: 'dashboard' },
  ],
  resolverName: 'pagOrganizations',
  dataVariable: 'organizations',
  defaultSortField: 'totalAUM',
};

const FundManagers = ({ classes, filter, tableName }) => {
  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'amount':
        return `$${nWithCommas(row[headerValue])}`;
      case 'count':
        return `${nWithCommas(row[headerValue])}`;
      case 'dashboard':
        return (
          <Tooltip title="Dashboard">
            <a
              href={`/admin/${row[headerValue]}`}
              className={classes.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <DashboardIcon className={classes.button} />
            </a>
          </Tooltip>
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

export default withRouter(FundManagers);
