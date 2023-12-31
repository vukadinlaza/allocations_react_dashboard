import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { InputAdornment, InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { colors } from '@allocations/design-system';
import { nWithCommas } from '../../../../../utils/numbers';
import AllocationsTable from '../../../../utils/AllocationsTable';
import Loader from '../../../../utils/Loader';
import { useFetch } from '../../../../../utils/hooks';
import ProgressBarWithLabel from './ProgressBarWithLabel';

const InvestorsCapitalCall = ({ classes, orgSlug, userProfile, dealName }) => {
  const BASE = 'appLhEikZfHgNQtrL'; // Accounting - Capital accounts
  const DEAL_TRACKER_TABLE = 'Deal Tracker';
  const { data, status } = useFetch(
    BASE,
    DEAL_TRACKER_TABLE,
    `(FIND("${dealName}", {Deal Name (webapp)}))`,
  );
  const [dataWithEmails, setDataWithEmails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const headers = [
    {
      value: 'Investor Name',
      label: 'Name',
      type: 'name',
      isSortable: true,
    },
    {
      value: 'Email',
      label: 'Email',
      isSortable: true,
    },
    {
      value: 'Total Amount Committed (with fees)',
      label: 'Total Committed',
      type: 'amount',
      align: 'center',
      isSortable: true,
    },
    {
      value: 'Net Amount Contributed',
      label: 'Amount Contributed ($)',
      type: 'amount',
      align: 'center',
      isSortable: true,
    },
    {
      value: 'Aggregate Contributed (%)',
      label: 'Total Contribution (%)',
      type: 'progressBar',
      isSortable: true,
    },
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
                'Content-Type': 'application/json', // we will receive a json object
              },
            },
          );
          const resData = await response.json();
          return {
            ...record,
            fields: {
              ...record.fields,
              Email: resData.fields.Email,
              _id: resData.fields._id,
            },
          };
        }),
      )
        .then((res) => setDataWithEmails(res))
        // eslint-disable-next-line no-console
        .catch((error) => console.error(error));
    }
  }, [data]);

  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'name':
        return row['Investor Name'];
      case 'link':
        return row._id ? <a href={`/investor/${row._id}/home`}>Link</a> : <div />;
      case 'amount':
        return `$${nWithCommas(row[headerValue])}`;
      case 'date':
        return moment(row[headerValue]).format('MM/DD/YYYY');
      case 'progressBar':
        return <ProgressBarWithLabel value={Math.round(row[headerValue] * 100)} />;
      default:
        return <div />;
    }
  };

  if (['irishangels'].includes(orgSlug) || userProfile.admin) {
    headers.push({
      value: 'Deal Name (webapp)',
      label: 'Dashboard Link',
      type: 'link',
      alignHeader: true,
      isSortable: true,
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
        <SearchIcon style={{ color: colors.gray[500] }} />
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
                <SearchIcon style={{ color: colors.gray[500] }} />
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
        count={investorsData.length}
      />
    </div>
  );
};

export default InvestorsCapitalCall;
