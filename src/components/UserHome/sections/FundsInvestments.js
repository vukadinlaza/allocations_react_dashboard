import React, { useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Typography, Grid, Box, Tooltip } from '@material-ui/core';
import StorefrontIcon from '@material-ui/icons/Storefront';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import AllocationsTable from '../../utils/AllocationsTable';
import { DocumentBox } from '../../Settings/common';
import { nWithCommas } from '../../../utils/numbers';

const headers = [
  { label: 'FUND NAME', value: 'company_name', isSortable: true },
  {
    label: 'FUND MANAGER',
    value: 'deal_lead',
    isSortable: true,
    align: 'left',
    alignHeader: true,
  },
  {
    label: 'AUM',
    value: 'AUM',
    type: 'amount',
    isSortable: true,
    keyNotInData: true,
    align: 'right',
    alignHeader: true,
  },
  {
    label: 'CLOSE DATE',
    value: 'dealParams.wireDeadline',
    type: 'date',
    isSortable: true,
    align: 'right',
    alignHeader: true,
  },
  // {
  //   label: 'DRAWDOWN TYPE',
  //   value: 'deal.dealParams.dealMultiple',
  //   type: 'multiple',
  //   isSortable: true,
  //   keyNotInData: true,
  //   align: 'right',
  //   alignHeader: true,
  // },
  {
    label: 'FUND STATUS',
    value: 'status',
    type: 'status',
    isSortable: true,
    align: 'right',
    alignHeader: true,
  },
  { label: 'LINKS', value: 'links', type: 'links', isSortable: false, keyNotInData: true },
];

const getStatusColors = (status) => {
  switch (status) {
    case 'closing':
      return { backgroundColor: '#C9EEC8', color: '#58CE46' };
    case 'closed':
      return { backgroundColor: '#f99fc2', color: '#f92576' };
    case 'draft':
      return { backgroundColor: '#CECECE', color: '#3D3D3D' };
    case 'onboarding':
      return { backgroundColor: '#C0D7FF', color: '#0461FF' };
    default:
      return { backgroundColor: 'rgba(0,0,0,0)', color: 'red' };
  }
};

const FundsInvestments = ({ classes, data, showInvestments }) => {
  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'status':
        return (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <div
              className={classes.statusContainer}
              style={{
                color: getStatusColors(row.status).color,
                backgroundColor: getStatusColors(row.status).backgroundColor,
              }}
            >
              {row[headerValue]}
            </div>
          </div>
        );
      case 'amount':
        return `$${nWithCommas(row[headerValue])}`;
      case 'date':
        return moment(new Date(parseInt(row._id.substring(0, 8), 16) * 1000)).format('MM/DD/YYYY');
      case 'links':
        return (
          <div className={classes.links}>
            <Tooltip title="Deal Page">
              <a
                href={`/deals/${row.organization.slug}/${row.slug}`}
                className={classes.buttonLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <StorefrontIcon className={classes.button} />
              </a>
            </Tooltip>
            <Tooltip title="View Investments">
              <span className={classes.buttonLink}>
                <TrendingUpIcon className={classes.button} onClick={() => showInvestments(row)} />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return <div />;
    }
  };

  return (
    <div className={classes.tableContainer}>
      <AllocationsTable data={data} headers={headers} getCellContent={getCellContent} />
    </div>
  );
};

export default FundsInvestments;
