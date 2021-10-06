import React, { useEffect, useState } from 'react';
import { TextField, InputAdornment, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import AllocationsTable from '../utils/AllocationsTable';
import MoreMenu from '../utils/MoreMenu';
import { openInNewTab } from '../../utils/helpers';
import styles from '../UserHome/styles';
import { nWithCommas } from '../../utils/numbers';

const spvHeaders = [
  {
    label: 'NAME',
    value: 'spvName',
    type: 'spvName',
    isSortable: true,
    align: 'left',
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
    label: 'SIZE',
    value: 'size',
    type: 'size',
    isSortable: true,
    align: 'center',
    alignHeader: true,
  },
  {
    label: 'STATUS',
    value: 'status',
    type: 'status',
    isSortable: true,
    align: 'right',
    alignHeader: false,
  },
  {
    label: 'CREATED AT DATE',
    value: 'createdAt',
    type: 'createdAt',
    isSortable: true,
    align: 'center',
  },
  {
    label: 'WIRE DEADLINE DATE',
    value: 'wireDeadline',
    type: 'wireDeadline',
    isSortable: true,
    align: 'center',
    alignHeader: true,
  },
  {
    label: 'MANAGE',
    value: 'manage',
    type: 'manage',
    align: 'center',
    isSortable: false,
    alignHeader: false,
  },
];
const fundHeaders = [
  {
    label: 'NAME',
    value: 'spvName',
    type: 'spvName',
    isSortable: true,
    align: 'left',
    alignHeader: true,
  },
  {
    label: 'RAISED',
    value: 'size',
    type: 'size',
    isSortable: true,
    align: 'center',
    alignHeader: true,
  },
  {
    label: 'MULTIPLE',
    value: 'multiple',
    type: 'multiple',
    isSortable: true,
    align: 'center',
    alignHeader: true,
  },
  {
    label: 'AUM',
    value: 'aum',
    type: 'aum',
    isSortable: true,
    align: 'center',
    alignHeader: true,
    keyNotInData: true,
  },
  {
    label: 'STATUS',
    value: 'status',
    type: 'status',
    isSortable: true,
    align: 'right',
    alignHeader: false,
  },
  {
    label: 'CREATED AT DATE',
    value: 'createdAt',
    type: 'createdAt',
    isSortable: true,
    align: 'center',
  },
  {
    label: 'FIRST CLOSE DATE',
    value: 'firstClose',
    type: 'firstClose',
    isSortable: true,
    align: 'center',
    alignHeader: true,
  },
  {
    label: 'FINAL CLOSE DATE',
    value: 'finalClose',
    type: 'finalClose',
    isSortable: true,
    align: 'center',
    alignHeader: true,
  },
  {
    label: 'MANAGE',
    value: 'manage',
    type: 'manage',
    align: 'center',
    isSortable: false,
    alignHeader: false,
  },
];

const getStatusColors = (status) => {
  switch (status) {
    case 'Complete':
      return { backgroundColor: '#C9EEC8', color: '#58CE46' };
    case 'Onboarding':
      return { backgroundColor: 'rgb(255, 4, 4, .20)', color: '#FF0404' };
    case 'Closed':
      return { backgroundColor: 'rgb(4, 97, 255, .25)', color: '#0461FF' };
    default:
      return { backgroundColor: 'rgba(0,0,0,0)', color: 'red' };
  }
};

const UserDocuments = ({ classes, data, type }) => {
  const headers = type === 'spvs' ? spvHeaders : fundHeaders;
  const history = useHistory();
  const [userDocuments, setUserDocuments] = useState(data);
  const [searchTerm, setSearchTerm] = useState('');

  const getCellContent = (type, row, headerValue) => {
    if (headerValue === 'status') {
      console.log('ROW', row);
      console.log('COLOR', row.status, getStatusColors(row.status).color);
    }
    switch (type) {
      case 'spvName':
        return row.spvName;
      case 'portfolioCompany':
        return row.portfolioCompany;
      case 'size':
        return `$${nWithCommas(row.size)}`;
      case 'status':
        return (
          <div
            className={classes.statusContainer}
            style={{
              color: getStatusColors(row.status).color,
              backgroundColor: getStatusColors(row.status).backgroundColor,
              marginLeft: 'auto',
            }}
          >
            {row[headerValue]}
          </div>
        );
      case 'createdAt':
        return row.createdAt;
      case 'wireDeadline':
        return row.wireDeadline;
      case 'firstClose':
        return row.firstClose;
      case 'finalClose':
        return row.finalClose;
      case 'aum':
        return `$${nWithCommas(row.size * row.multiple)}`;
      case 'multiple':
        return `${row.multiple}x`;
      case 'manage':
        return (
          <Button
            variant="contained"
            color="primary"
            style={{ borderRadius: '.5rem' }}
            onClick={() => history.push(`/deal-setup?name=${row.spvName}`)}
          >
            Manage
          </Button>
        );
      default:
        return <div />;
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const dataCopy = userDocuments.filter((doc) =>
    `${doc.name} ${doc.portfolioCompany}`.toUpperCase().includes(searchTerm.toUpperCase()),
  );

  return (
    <div className={classes.tableContainer}>
      <div className={classes.searchContainer}>
        <TextField
          label="Search"
          placeholder="Search by Name"
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