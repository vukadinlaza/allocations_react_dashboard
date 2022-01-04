import React, { useState } from 'react';
import moment from 'moment';
import { TextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { nWithCommas } from '../../../../../utils/numbers';
import AllocationsTable from '../../../../utils/AllocationsTable';
import Loader from '../../../../utils/Loader';

const headers = [
  { value: 'Investment', label: 'NAME', align: 'left', alignHeader: true },
  { value: 'Date', label: 'DATE', type: 'date', align: 'left', alignHeader: true },
  {
    value: 'Invested',
    label: 'INVESTMENT AMOUNT',
    type: 'amount',
    align: 'right',
    alignHeader: true,
  },
];

const Investments = ({ classes, data }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'company':
        return row.deal.company_name;
      case 'date':
        return moment(row[headerValue]).format('MM/DD/YYYY');
      case 'amount':
        return `$${nWithCommas(row[headerValue])}`;
      default:
        return <div />;
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  let investmentsData = data.map((investment) => {
    return { ...investment, Date: new Date(investment.Date) };
  });
  if (!investmentsData) return <Loader />;

  if (searchTerm)
    investmentsData = investmentsData.filter((investment) =>
      investment.Investment.toUpperCase().includes(searchTerm.toUpperCase()),
    );

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
        data={investmentsData}
        headers={headers}
        getCellContent={getCellContent}
        sortField="Date"
        sortOrder="desc"
      />
    </div>
  );
};

export default Investments;
