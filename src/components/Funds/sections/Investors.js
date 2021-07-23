import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useParams, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
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
});

const tableVariables = {
  gqlQuery: `
    query AllUsers($pagination: PaginationInput!) {
      allUsers(pagination: $pagination) {
        _id
        first_name
        last_name
        email
        entity_name
        investments{
          _id
        }
      }
    }`,
  headers: [
    { value: 'first_name', label: 'First Name', isFilter: true, isSortable: true },
    { value: 'last_name', label: 'Last Name', isFilter: true, isSortable: true },
    { value: 'email', label: 'Email', isFilter: true, isSortable: true },
    { value: 'investmentAmount', label: 'Investments', type: 'investmentAmount', keyNotInData: true },
    { value: 'investments', label: 'Investments', type: 'count', align: 'center', alignHeader: true },
    { value: 'dashboard', label: 'Dashboard', keyNotInData: true, type: 'link', align: 'center', alignHeader: true },
  ],
  dataVariable: 'allUsers',
  defaultSortField: 'first_name'
};

const Investors = ({ classes, filter, tableName }) => {

  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'investmentAmount':
        return nWithCommas(row['investments'].map(i => i.amount).reduce((acc, n) => acc + n ));
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
      case 'edit':
        return (
          <a
            href={`/admin/${row.organization.slug}/deals/${row._id}/edit`}
            className={classes.buttonLink}
          >
            <EditIcon className={classes.button} />
          </a>
        );
      case 'dealPage':
        return (
          <a href={`/deals/${row.organization.slug}/${row.slug}`} className={classes.buttonLink}>
            <PlayArrowIcon className={classes.button} />
          </a>
        );
      case 'dashboard':
        return (
          <a href={`/admin/${row.organization.slug}`} className={classes.buttonLink}>
            <PlayArrowIcon className={classes.button} />
          </a>
        );
      default:
        return <div />;
    }
  };

  return (
    <div>
      <ServerTable
        tableVariables={tableVariables}
        getCellContent={getCellContent}
      />
    </div>
  );
};

export default withStyles(styles)(withRouter(Investors));
