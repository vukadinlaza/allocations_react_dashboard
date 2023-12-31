import React, { useState } from 'react';
import { TextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { colors } from '@allocations/design-system';
import AllocationsTable from '../../../../utils/AllocationsTable';
import Loader from '../../../../utils/Loader';

const LegacyInvestors = ({ classes, data, orgSlug, userProfile }) => {
  const { investments } = data.deal;
  const [searchTerm, setSearchTerm] = useState('');
  const headers = [
    { value: 'name', label: 'Name', type: 'name', align: 'left', alignHeader: true },
    { value: 'email', label: 'Email', align: 'left', alignHeader: true },
  ];

  const getCellContent = (type, row) => {
    switch (type) {
      case 'name':
        return row.first_name ? `${row['first_name']} ${row['last_name']}` : '';
      case 'taxLink':
        return row._id ? (
          <a
            href={`https://tax.allocations.com/admin/investor/${row.email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Tax Activity
          </a>
        ) : (
          <div />
        );
      case 'link':
        return <a href={`/investor/${row._id}/home`}>Link</a>;
      default:
        return <div />;
    }
  };

  if (['irishangels'].includes(orgSlug) || userProfile.admin) {
    headers.push({
      value: 'Tax Activity',
      label: 'Tax Activity',
      type: 'taxLink',
      alignHeader: true,
      keyNotInData: true,
    });

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
          placeholder="Search by investor name"
          id="search-field"
          fullWidth
          onChange={handleSearch}
          value={searchTerm || ''}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: colors.gray[500] }} />
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
        noShadow
      />
    </div>
  );
};

export default LegacyInvestors;
