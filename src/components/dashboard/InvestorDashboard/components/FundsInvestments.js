import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Input, List, Typography, colors } from '@allocations/design-system';
import {
  nWithCommas,
  sortByNumber,
  titleCase,
  sortByDate,
  sortByString,
} from '@allocations/nextjs-common';
import 'chartjs-plugin-datalabels';
import { Grid } from '@material-ui/core';

const dealInvestmentsHeaders = [
  {
    id: 'Investment',
    label: 'NAME OF INVESTMENT',
    withSort: true,
    customSort: true,
  },
  {
    id: 'createdTime',
    label: 'DATE',
    withSort: true,
    customSort: true,
  },
  {
    id: 'Invested',
    label: 'AMOUNT',
    withSort: true,
    customSort: true,
  },
];

const FundsInvestments = ({ classes, fundInvestments, showInvestments, dealName }) => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.querySelector('.mainRoute').scrollTo(0, 0);
  }, []);

  const getFormattedData = () =>
    fundInvestments.length
      ? fundInvestments.map((investment) => {
          const { Investment, Invested, createdTime } = investment;
          return {
            Investment: titleCase(Investment || ''),
            createdTime: moment(createdTime).format('MM/DD/YYYY'),
            Invested: `$${nWithCommas(Invested)}`,
          };
        })
      : [{}];

  const handleSort = (data, orderBy, direction) => {
    const numberAmount = (amount) => {
      return Number(amount?.replace(/[^\d.-]/g, ''));
    };

    switch (orderBy) {
      case 'Investment':
        return data.sort((a, b) => sortByString(a[orderBy], b[orderBy], '', direction));
      case 'createdTime':
        return data.sort((a, b) =>
          sortByDate(new Date(a.createdTime), new Date(b.createdTime), '', direction),
        );
      case 'Invested':
        return data.sort((a, b) =>
          sortByNumber(numberAmount(a[orderBy]), numberAmount(b[orderBy]), '', direction),
        );
      default:
        return data;
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);
  };

  const filteredData = getFormattedData().filter((investment) =>
    investment.Investment?.toLowerCase().includes(search?.toLowerCase()),
  );

  return (
    <Grid container spacing={2} className={classes.listsContainer}>
      <Grid item xs={1} />
      <Grid item xs={10} className={classes.list}>
        <div className={classes.back}>
          <span className={classes.previousPage}>
            <Typography
              component="div"
              content="Dashboard"
              fontColor={colors.gray[400]}
              fontWeight={500}
              variant="button"
              onClick={() => showInvestments(false)}
            />
          </span>
          <div className={classes.breadcrumbSeparator}>
            <Typography
              component="div"
              content="/"
              fontColor={colors.gray[400]}
              fontWeight={500}
              variant="button"
            />
          </div>
          <Typography
            component="div"
            content={`${dealName} Investments`}
            fontColor={colors.black[50]}
            fontWeight={500}
            variant="button"
          />
        </div>
        <div className={classes.searchContainer}>
          <Input
            helperText=""
            iconName="search"
            iconPosition="left"
            label=""
            name="search"
            placeholder="Search Investments"
            type="text"
            onChange={handleSearch}
          />
        </div>
        <List
          data={filteredData}
          headers={dealInvestmentsHeaders}
          sortBy="Investment"
          sortDirection="asc"
          customSort={handleSort}
        />
      </Grid>
      <Grid item xs={false} md={1} />
    </Grid>
  );
};

export default FundsInvestments;
