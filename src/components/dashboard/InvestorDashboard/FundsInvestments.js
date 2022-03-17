/* eslint-disable no-unused-vars */

import React, { useState } from 'react';
import moment from 'moment';
import { Button, Chip, colors, Icon, List, Menu, Typography } from '@allocations/design-system';
import {
  nWithCommas,
  getMomentFromId,
  sortByNumber,
  customStringSort,
  titleCase,
  sortByDate,
  sortByString,
} from '@allocations/nextjs-common';
import 'chartjs-plugin-datalabels';
import { Grid } from '@material-ui/core';
import FundsInvestments from './sections/FundsInvestments1';

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

const InvestmentsList = ({ classes, fundInvestments, showInvestments, dealName }) => {
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
  return (
    <Grid container spacing={2} className={classes.listsContainer}>
      <Grid item xs={1} />
      <Grid item xs={10} className={classes.list}>
        <div className={classes.back}>
          <Button
            text="Back to Dashboard"
            variant="ghost"
            onClick={() => showInvestments(false)}
            startIcon={<Icon iconName="chevron_left" />}
          />
        </div>

        <div className={classes.listTitleContainer}>
          <Typography
            component="div"
            content={`${dealName} Investments`}
            fontWeight={700}
            variant="heading3"
          />
        </div>
        <List
          data={getFormattedData()}
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

export default InvestmentsList;
