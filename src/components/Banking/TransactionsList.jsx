import * as React from 'react';
import Box from '@material-ui/core/Box';
import { DataGrid } from '@material-ui/data-grid';
import dayjs from 'dayjs';
import { Chip } from '@allocations/design-system';

const currencyFormatter = (input) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(input);

const columns = [
  {
    field: 'id',
    hide: true,
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 120,
    valueGetter: (params) => dayjs(parseInt(params.row.date, 10)).format('MM-DD-YYYY'),
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 120,
  },
  {
    field: 'amount',
    headerName: 'Amount',
    type: 'number',
    width: 150,
    valueGetter: (params) => currencyFormatter(params.row.amount),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    renderCell: (params) => <Chip text={params.row.status ?? 'Unknown'} />,
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 150,
  },
  {
    field: 'name',
    headerName: 'Transaction Description',
    flex: true,
  },
];

const TransactionsList = ({ transactions }) => {
  // remap id for transactions (if any)
  const rowMap = transactions.map((t) => ({ ...t, id: t._id }));
  return (
    <Box sx={{ height: '60vh', width: '100%' }}>
      <DataGrid rows={rowMap} columns={columns} />
    </Box>
  );
};
export default TransactionsList;
