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
    label: 'DATE',
    value: 'date',
    type: 'date',
    isSortable: true,
    align: 'left',
    alignHeader: true,
  },
  {
    label: 'TO/FROM',
    value: 'toFrom',
    type: 'toFrom',
    isSortable: true,
    align: 'center',
    alignHeader: true,
  },
  {
    label: 'AMOUNT',
    value: 'amount',
    type: 'amount',
    isSortable: true,
    align: 'center',
    alignHeader: true,
  },
  {
    label: 'METHOD',
    value: 'method',
    type: 'method',
    isSortable: true,
    align: 'center',
  },
  {
    label: 'ACCOUNT',
    value: 'account',
    type: 'account',
    isSortable: true,
    align: 'center',
    alignHeader: false,
  },
];

const getStatusColors = (status) => {
  switch (status) {
    case 'Outbound Wire':
      return { backgroundColor: '#C9EEC8', color: '#58CE46' };
    case 'Onboarding':
      return { backgroundColor: 'rgb(255, 4, 4, .20)', color: 'FF0404' };
    case 'Wire':
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
      case 'date':
        return row.date;
      case 'toFrom':
        return row.toFrom;
      case 'amount':
        return `$${nWithCommas(row.amount)}`;
      case 'method':
        return (
          <div
            className={classes.statusContainer}
            style={{
              color: getStatusColors(row.method).color,
              backgroundColor: getStatusColors(row.method).backgroundColor,
              width: '90%',
            }}
          >
            {row[headerValue]}
          </div>
        );
      case 'account':
        return row.account;
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
