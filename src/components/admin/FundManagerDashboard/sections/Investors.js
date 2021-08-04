import React, { useState } from 'react';
import moment from 'moment';
import { TextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { nWithCommas } from '../../../../utils/numbers';
import AllocationsTable from '../../../utils/AllocationsTable';
import Loader from '../../../utils/Loader';

const Investors = ({ classes, data, orgSlug, userProfile }) => {
  const { investments } = data.deal;
  const [searchTerm, setSearchTerm] = useState('');
  const headers = [
    { value: 'name', label: 'Name', type: 'name', align: 'left', alignHeader: true },
    { value: 'email', label: 'Email', align: 'left', alignHeader: true },
  ];

  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'name':
        return row.first_name ? `${row['first_name']} ${row['last_name']}` : '';
      case 'link':
        return <a href={`/investor/${row._id}/home`}>Link</a>;
      default:
        return <div />;
    }
  };

  if (['irishangels'].includes(orgSlug) || userProfile.admin) {
    headers.push({
      value: '_id',
      label: 'Dashboard Link',
      type: 'link',
      align: 'right',
      alignHeader: true,
    });
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  let investorsData = investments.map((inv) => inv.investor).filter((investor) => investor);
  if (!investorsData) return <Loader />;

  if (searchTerm) {
    investorsData = investorsData.filter((investor) =>
      (investor?.first_name
        ? `${investor['first_name']} ${investor['last_name']} ${investor.email}`
        : `${investor.email}`
      )
        .toUpperCase()
        .includes(searchTerm.toUpperCase()),
    );
  }

  return (
    <div className={classes.section}>
      <div className={classes.searchContainer}>
        <TextField
          label="Search"
          placeholder="Search by company name"
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
      <AllocationsTable
        data={investorsData}
        headers={headers}
        getCellContent={getCellContent}
        sortField="email"
        sortOrder="desc"
      />
    </div>
  );
};

export default Investors;
