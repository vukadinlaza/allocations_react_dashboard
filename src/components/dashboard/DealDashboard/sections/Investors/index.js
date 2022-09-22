import React, { useState } from 'react';
import { Box, Grid, Menu, MenuItem } from '@material-ui/core';
import { Button, Chip, IconButton, List, Search } from '@allocations/design-system';
import moment from 'moment';
import { nWithCommas } from '../../../../../utils/numbers';
import { openInNewTab } from '../../../../../utils/helpers';

const statusColors = {
  invited: 'gray',
  signed: 'blue',
  complete: 'green',
  wired: 'green',
};

const investorTypeColor = {
  entity: 'green',
  individual: 'blue',
};

const headers = [
  { id: 'name', label: 'Name' },
  { id: 'investingAs', label: 'Investing As' },
  { id: 'type', label: 'Type' },
  { id: 'email', label: 'Email' },
  { id: 'amount', label: 'Amount Committed' },
  { id: 'wiredAmount', label: 'Wired Amount' },
  { id: 'status', label: 'Status' },
  { id: 'documents', label: 'Documents' },
];

const Investors = ({ investments }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [documents, setDocuments] = useState([]);

  const displayData = investments
    ?.map((investment) => ({
      name: investment.submissionData?.fullName || investment.submissionData?.legalName,
      investingAs:
        investment.submissionData?.investor_type === 'Entity'
          ? investment.submissionData?.legalName
          : investment.submissionData?.fullName,
      type: (
        <Chip
          text={investment.submissionData?.investor_type || 'unknown'}
          chipColor={investorTypeColor[investment.submissionData?.investor_type] || 'gray'}
        />
      ),
      email: investment.investor.email,
      amount: `$${nWithCommas(investment.amount)}`,
      wiredAmount: `$${nWithCommas(investment.capitalWiredAmount)}`,
      status: (
        <Chip text={investment.status} chipColor={statusColors[investment.status] || 'black'} />
      ),
      documents: (
        <>
          <IconButton
            text="Open"
            size="small"
            iconName="more_vert"
            variant="ghost"
            onClick={({ currentTarget }) => {
              setAnchorEl(currentTarget);
              setDocuments(investment.documents);
            }}
          />
        </>
      ),
    }))
    .filter((investment) => {
      return (
        investment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investment.investingAs?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const createCSV = () => {
    const headers = [
      'Name',
      'Investing As',
      'Type',
      'Email',
      'Status',
      'Committed Amount',
      'Wired Amount',
      'Signed Date',
      'Wired Date',
    ];

    return investments.reduce((acc, investment) => {
      const timestamp = investment._id.toString().substring(0, 8);
      const signedAt = moment.utc(new Date(parseInt(timestamp, 16) * 1000)).format('MMM DD YYYY');
      const wiredAt = !investment?.wired_at
        ? ''
        : moment.utc(new Date(investment?.wired_at * 1)).format('MMM DD YYYY');
      const legalName = encodeURIComponent(investment.submissionData?.legalName);

      return `${acc}\n${investment.submissionData?.fullName || legalName};${legalName};${
        investment.submissionData?.investor_type
      };${investment.investor.email};${investment.status};${investment.amount};${
        investment.capitalWiredAmount || 0
      };${signedAt};${wiredAt}`;
    }, `data:text/csv;charset=utf-8,${headers.join(';')}`);
  };

  return (
    <>
      <Box my={3}>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Button text="Export to CSV" onClick={() => window.open(createCSV())} />
          </Grid>
        </Grid>
      </Box>
      <Search value={searchTerm} onChange={({ target }) => setSearchTerm(target.value)} />
      <List
        loading={!investments}
        headers={headers}
        data={displayData}
        sortBy="name"
        sortDirection="asc"
        stickyHeader
      />
      <Menu open={anchorEl} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
        {documents.map(({ path, link }) => (
          <MenuItem
            onClick={() => openInNewTab({ url: link.includes('http') ? link : `//${link}` })}
          >
            {path.split('/').slice(-1)[0]}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Investors;
