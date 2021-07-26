import React, { useState, useEffect } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ServerTable from '../../utils/ServerTable';
import { nWithCommas } from '../../../utils/numbers';

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
    cursor: 'pointer',
		"&:hover": {
			backgroundColor: '#3f85f9'
		}
  },
});

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
    { value: 'investmentAmount', label: 'INVESTMENT AMOUNT', type: 'investmentAmount', keyNotInData: true },
    { value: 'investments', label: 'TOTAL INVESTMENTS', type: 'count', align: 'center', alignHeader: true },
    { value: 'viewInvestments', label: 'VIEW INVESTMENTS', keyNotInData: true, type: 'viewInvestments', align: 'center', alignHeader: true },
    { value: 'viewProfile', label: 'VIEW PROFILE', keyNotInData: true, type: 'viewProfile', align: 'center', alignHeader: true },
    { value: 'viewDashboard', label: 'VIEW DASHBOARD', keyNotInData: true, type: 'viewDashboard', align: 'center', alignHeader: true },
  ],
  resolverName: 'allUsers',
  dataVariable: 'users',
  defaultSortField: 'first_name'
};


const Investors = ({ classes, history }) => {

  const handleShowInvestments = (userId) => {
    history.push(`/admin/users/${userId}/investments`)
  }

  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'investmentAmount':
        return row['investments']?.length? 
                  `$${nWithCommas(row['investments']
                  .map(i => i.amount)
                  .reduce((acc, n) => acc + n ))}`
                  : 0
                  
      case 'count':
        return row[headerValue].length;

      case 'viewInvestments':
        return  <a 
                  href={`/admin/users/${row._id}/investments`} 
                  className={classes.buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  >
                  <PlayArrowIcon className={classes.button} />
                </a>
        
      case 'viewProfile':
        return (
          <a 
            href={`/admin/users/${row._id}`} 
            className={classes.buttonLink}
            target="_blank"
            rel="noopener noreferrer"
            >
            <PlayArrowIcon className={classes.button} />
          </a>
        );
      case 'viewDashboard':
        return (
          <a 
            href={`/investor/${row._id}/home`} 
            className={classes.buttonLink}
            target="_blank"
            rel="noopener noreferrer"
            >
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
        tableVariables={investorVariables}
        getCellContent={getCellContent}
      />
    </div>
  )
};

export default withStyles(styles)(withRouter(Investors));
