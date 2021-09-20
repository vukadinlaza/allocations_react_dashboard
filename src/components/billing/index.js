import * as React from 'react';
import { sample, random } from 'lodash';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { Paper, Typography } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import { FaBookmark } from 'react-icons/fa';
import { nWithCommas } from '../../utils/numbers';

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
const deals = [
  'Coinbase',
  'Space X',
  'Tundra Trust',
  'Axiom Space',
  'Robinhood',
  'Grid',
  'StarLink',
  'Flexport',
  'Insight',
  'Fast',
];
const desciptions = [
  'Allocations SPV Fee',
  'Allocations Fund Fee',
  'Blue Skys Fee',
  'Allocations Investment Advisor Fee',
];
const statuses = ['Pending', 'Draft', 'Paid'];
const statusPill = (type) => {
  const color = type === 'Pending' ? '#4d8fd1' : type === 'Draft' ? '#f5fc2b' : '#61e653';
  return (
    <span
      style={{
        backgroundColor: color,
        textAlign: 'center',
        width: '8%',
        padding: '.25rem',
        borderRadius: '1rem',
        opacity: '.4',
      }}
    >
      {type}
    </span>
  );
};

function createData() {
  return {
    number: random(10000, 50000),
    date: moment(randomDate(new Date(2018, 0, 1), new Date()).toString()).format('MMM/YYYY/DD'),
    dealName: sample(deals),
    description: sample(desciptions),

    amount: random(2000, 20000),

    status: sample(statuses),
  };
}

const rows = [...Array(20)].map(() => {
  return createData();
});

export default function BasicTable() {
  return (
    <>
      <div style={{ margin: '1rem 0' }}>
        <Typography variant="h3" style={{ color: 'Black', padding: '1rem' }}>
          Invoices
        </Typography>
        <Typography
          variant="subtitle2"
          style={{ color: 'Black', paddingBottom: '1rem', paddingLeft: '1rem' }}
        >
          A list of all your recent transactions
        </Typography>
      </div>

      <div
        style={{
          margin: '1rem 0',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          height: '1rem',
          alignItems: 'center',
          padding: '0 0.5rem',
        }}
      >
        <span style={{ textAlign: 'left', width: '6%' }}>No.</span>
        <span style={{ textAlign: 'center', width: '12%' }} align="center">
          Date
        </span>
        <span style={{ textAlign: 'center', width: '12%' }} align="center">
          Deal Name
        </span>
        <span style={{ textAlign: 'center', width: '12%' }} align="center">
          Description
        </span>
        <span style={{ textAlign: 'center', width: '12%' }} align="center">
          Invoice Amount
        </span>
        <span style={{ textAlign: 'center', width: '12%' }} align="center">
          Status
        </span>
        <span style={{ textAlign: 'center', width: '12%' }} align="center">
          View PDF
        </span>
      </div>

      {rows.map((row) => (
        <Paper
          style={{
            margin: '1rem 0',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            height: '5rem',
            alignItems: 'center',
            padding: '0 0.5rem',
          }}
        >
          <span style={{ textAlign: 'left', width: '6%', fontWeight: '900' }}>{row.number}</span>
          <span style={{ textAlign: 'left', width: '12%' }}>{row.date}</span>
          <span style={{ textAlign: 'left', width: '12%' }}>{row.dealName}</span>
          <span style={{ textAlign: 'left', width: '12%' }}>{row.description}</span>
          <span style={{ textAlign: 'left', width: '12%' }}>
            <span style={{ fontWeight: '900' }}>${nWithCommas(row.amount)}</span>
            <span>.00 USD</span>
          </span>
          {statusPill(row.status)}
          <span style={{ textAlign: 'center', width: '12%' }}>
            <a
              target="_blank"
              href="https://allocations-public.s3.us-east-2.amazonaws.com/Allocations+Demo+Invoice.pdf"
              rel="noreferrer"
            >
              <FaBookmark />
            </a>
          </span>
        </Paper>
      ))}
    </>
  );
}
