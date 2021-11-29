import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { InputAdornment, InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { nWithCommas } from '../../../../../utils/numbers';
import AllocationsTable from '../../../../utils/AllocationsTable';
import Loader from '../../../../utils/Loader';
import { useFetch } from '../../../../../utils/hooks';
import ProgressBarWithLabel from './ProgressBarWithLabel';

const Investors = ({ classes, orgSlug, userProfile }) => {
  const BASE = 'appLhEikZfHgNQtrL'; // Accounting - Capital accounts
  const DEAL_TRACKER_TABLE = 'Deal Tracker';
  const { data, status } = useFetch(BASE, DEAL_TRACKER_TABLE);
  const [dataWithEmails, setDataWithEmails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const headers = [
    { value: 'Investor Name', label: 'Name', type: 'name' },
    { value: 'Email', label: 'Email' },
    {
      value: 'Total Amount Committed (with fees)',
      label: 'Total Committed',
      type: 'amount',
      align: 'right',
    },
    {
      value: 'Current Amount Contributed',
      label: 'Amount Contributed ($)',
      type: 'amount',
      align: 'right',
    },
    { value: 'Gross Contribution Received', label: 'Total Contribution (%)', type: 'progressBar' },
  ];

  useEffect(() => {
    if (data) {
      Promise.all(
        data.map(async (record) => {
          const response = await fetch(
            `https://api.airtable.com/v0/${BASE}/${DEAL_TRACKER_TABLE}/${record.fields.Email[0]}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`, // API key
                'Content-Type': 'application/json', // we will recive a json object
              },
            },
          );
          const resData = await response.json();
          return {
            ...record,
            fields: {
              ...record.fields,
              Email: resData.fields.Email,
            },
          };
        }),
      )
        .then((res) => setDataWithEmails(res))
        .catch((error) => console.error(error));
    }
  }, [data]);

  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'name':
        return row['Investor Name'];
      case 'link':
        return <a href={`/investor/${row._id}/home`}>Link</a>;
      case 'amount':
        return `$${nWithCommas(row[headerValue])}`;
      case 'date':
        return moment(row[headerValue]).format('MM/DD/YYYY');
      case 'progressBar':
        return <ProgressBarWithLabel value={row[headerValue] * 100} />;
      default:
        return <div />;
    }
  };

  if (['irishangels'].includes(orgSlug) || userProfile.admin) {
    headers.push({
      value: 'Deal',
      label: 'Dashboard Link',
      type: 'link',
      alignHeader: true,
    });
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  let investorsData = dataWithEmails?.map((inv) => inv.fields);
  if (status === 'fetching') return <Loader />;

  if (searchTerm) {
    investorsData = investorsData.filter((investor) =>
      (investor['Investor Name']
        ? `${investor['Investor Name']} ${investor.email}`
        : `${investor.email}`
      )
        .toUpperCase()
        .includes(searchTerm.toUpperCase()),
    );
  }

  return (
    <div className={classes.section}>
      <div className={classes.searchContainer}>
        <SearchIcon style={{ color: '#7688A0' }} />
        <InputBase
          label="Search"
          placeholder="Search by investor name"
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
        pagination
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
