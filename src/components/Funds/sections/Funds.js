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
    color: "white",
    fontSize: "16px"
  },
  buttonLink: {
    borderRadius: "100%",
    backgroundColor: "#0462FF",
    padding: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "-6px 0",
    width: "32px",
    height: "32px"
  }
});

const tableVariables = {
  gqlQuery: `
    query FundAdminTables($filter: Object, $pagination: PaginationInput!) {
      fundAdminTables(filter: $filter, pagination: $pagination) {
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
    }`,
  headers: [
    { value: 'company_name', label: 'Name', isFilter: true },
    { value: 'deal_lead', label: 'Fund Manager(s)', isFilter: true },
    { value: 'AUM', label: 'AUM', type: 'amount' },
    { value: 'dealParams', label: 'Close Date', type: 'wireDeadline' },
    // {drawdown}
    { value: 'dealOnboarding', label: 'Process Street Status', type: 'onboarding' },
    { value: 'status', label: 'Status', type: 'status', isFilter: true },
    { value: 'edit', label: 'Edit Deal', type: 'edit', keyNotInData: true, align: 'center'},
    { value: 'dealPage', label: 'Deal Page', type: 'dealPage', keyNotInData: true, align: 'center'},
    { value: 'dashboard', label: 'View Dashboard', type: 'dashboard', keyNotInData: true, align: 'center'},
  ],
  dataVariable: 'fundAdminTables',
  defaultSortField: "company_name"
}

const Funds = ({ classes, history }) => {
  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'managers':
        return row[headerValue]
      case 'amount':
        return `$${nWithCommas(row[headerValue])}`
      case 'wireDeadline':
        return row[headerValue]?.wireDeadline? 
                  moment(row[headerValue].wireDeadline).format('MM/DD/YYYY'):
                  ''
      case 'onboarding': 
        return row[headerValue]? 'Complete' : 'Pending'
      case 'status':
        return titleCase(row[headerValue]);
      case 'edit':
        return <a 
                href={`/admin/${row.organization.slug}/deals/${row._id}/edit`} 
                className={classes.buttonLink}
                >
                  <EditIcon className={classes.button}/>
               </a>;
      case 'dealPage':
        return <a 
                href={`/deals/${row.organization.slug}/${row.slug}`} 
                className={classes.buttonLink}
                >
                  <PlayArrowIcon className={classes.button}/>
               </a>;
      case 'dashboard':
        return <a 
                href={`/admin/${row.organization.slug}`} 
                className={classes.buttonLink}
                >
                  <PlayArrowIcon className={classes.button}/>
               </a>;
      default:
        return <div></div>
    }
  }

  return (
    <div>
      <ServerTable
        tableVariables={tableVariables}
        getCellContent={getCellContent}
        queryVariables={{filter: 'fund'}}
      />
    </div>
  );
};

export default withStyles(styles)(withRouter(Funds));
