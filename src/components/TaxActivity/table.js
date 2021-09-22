import React, { useEffect, useState } from 'react';
import { TextField, InputAdornment, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';
import AllocationsTable from '../utils/AllocationsTable';
import MoreMenu from '../utils/MoreMenu';
import { openInNewTab } from '../../utils/helpers';
import styles from '../UserHome/styles';
import { nWithCommas } from '../../utils/numbers';

const headers = [
  {
    label: 'NAME',
    value: 'name',
    type: 'name',
    isSortable: true,
    align: 'center',
    alignHeader: true,
  },
  {
    label: 'PORTFOLIO COMPANY',
    value: 'portfolioCompany',
    type: 'portfolioCompany',
    isSortable: true,
    align: 'center',
    alignHeader: true,
  },
  {
    label: 'TAX YEAR',
    value: 'taxYear',
    type: 'taxYear',
    isSortable: true,
    align: 'left',
    alignHeader: true,
  },
  {
    label: 'INVESTMENT DATE',
    value: 'investmentDate',
    type: 'investmentDate',
    isSortable: true,
    align: 'left',
    alignHeader: true,
  },
  {
    label: 'TAX DEADLINE',
    value: 'taxDeadline',
    type: 'taxDeadline',
    isSortable: true,
    align: 'center',
    alignHeader: true,
  },
  {
    label: 'EXTENSION DEADLINE',
    value: 'extensionDeadline',
    type: 'extensionDeadline',
    isSortable: true,
    align: 'center',
    alignHeader: true,
  },
  {
    label: 'STATUS',
    value: 'status',
    type: 'status',
    isSortable: true,
    align: 'center',
  },
];

const getStatusColors = (status) => {
  switch (status) {
    case 'Outbound Wire':
      return { backgroundColor: '#C9EEC8', color: '#58CE46' };
    case 'Will not file':
      return { backgroundColor: 'rgb(222, 223, 224, .40)', color: '#c5c6c9' };
    case 'Ready':
      return { backgroundColor: 'rgb(4, 97, 255, .25)', color: '#0461FF' };
    default:
      return { backgroundColor: 'rgba(0,0,0,0)', color: 'red' };
  }
};

const UserDocuments = ({ classes, data, type }) => {
  const [userDocuments, setUserDocuments] = useState(data);
  const [searchTerm, setSearchTerm] = useState('');

  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'name':
        return row.name;
      case 'portfolioCompany':
        return row.portfolioCompany;
      case 'taxYear':
        return row.taxYear;
      case 'investmentDate':
        return row.investmentDate;
      case 'taxDeadline':
        return row.taxDeadline;
      case 'extensionDeadline':
        return row.extensionDeadline;

      case 'status':
        return (
          <div
            className={classes.statusContainer}
            style={{
              color: getStatusColors(row.status).color,
              backgroundColor: getStatusColors(row.status).backgroundColor,
              width: '90%',
            }}
          >
            {row[headerValue]}
          </div>
        );
      default:
        return <div />;
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const dataCopy = userDocuments.filter((doc) =>
    `${doc.toFrom} ${doc.account}`.toUpperCase().includes(searchTerm.toUpperCase()),
  );

  return (
    <div className={classes.tableContainer}>
      <div className={classes.searchContainer}>
        <TextField
          label="Search"
          placeholder="Search"
          id="search-field"
          fullWidth
          onChange={handleSearch}
          value={searchTerm || ''}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} />
              </InputAdornment>
            ),
          }}
          style={{ margin: '0 1em' }}
        />
      </div>
      <AllocationsTable data={dataCopy} headers={headers} getCellContent={getCellContent} />
    </div>
  );
};

export default withStyles(styles)(UserDocuments);
