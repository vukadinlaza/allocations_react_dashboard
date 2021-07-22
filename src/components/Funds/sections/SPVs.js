import React, { useState, useEffect } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { InputAdornment, TextField, Typography } from '@material-ui/core';
import moment from 'moment';
import ServerTable from '../../utils/ServerTable';
import { nWithCommas } from '../../../utils/numbers';

const styles = (theme) => ({});

const tableVariables = {
  gqlQuery: `
    query FundAdminTables($filter: Object, $pagination: PaginationInput!) {
      fundAdminTables(filter: $filter, pagination: $pagination) {
        _id
        company_name
        deal_lead
        AUM
        dealParams {
          wireDeadline
        }
        dealOnboarding {
          _id
        }
        status
      }
    }`,
  headers: [
    { value: 'company_name', label: 'Deal Name', isFilter: true },
    { value: 'deal_lead', label: 'Fund Manager', isFilter: true },
    { value: 'AUM', label: 'AUM', type: 'Number' },
    {
      value: 'dealParams',
      label: 'Close Date',
      type: 'Date',
    },
    { value: 'dealOnboarding', label: 'Process Street' },
    { value: 'status', label: 'Deal Status', isFilter: true },
  ],
  dataVariable: 'fundAdminTables',
  defaultSortField: 'company_name',
};

const SPVs = ({ classes, history }) => {
  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'Date':
        return moment(row[headerValue].wireDeadline).format('MM/DD/YYYY');
      case 'Number':
        return `$${nWithCommas(row[headerValue])}`;
      default:
        return <div />;
    }
  };
  return (
    <div>
      <ServerTable tableVariables={tableVariables} getCellContent={getCellContent} />
    </div>
  );
};

export default withStyles(styles)(withRouter(SPVs));
