import React, { useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { TextField, InputAdornment, Box, Typography, Grid } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AllocationsTable from '../../../../utils/AllocationsTable';
import { nWithCommas } from '../../../../../utils/numbers';
import { titleCase, openInNewTab } from '../../../../../utils/helpers';
import MoreMenu from '../../../../utils/MoreMenu';
import { useFetchWithEmail } from '../../../../../utils/hooks';
import CapitalAccountsModal from '../../CapitalAccountsModal';
import ResignModal from '../../ResignModal';
import { DocumentBox } from '../../../../common/common';

const headers = [
  {
    label: 'DEAL',
    value: 'deal.company_name',
    isSortable: true,
    keyNotInData: true,
    align: 'left',
    alignHeader: true,
  },
  {
    label: 'STATUS',
    value: 'status',
    type: 'status',
    isSortable: true,
    align: 'left',
    alignHeader: true,
  },
  {
    label: 'TYPE',
    value: 'deal.investmentType',
    type: 'type',
    isSortable: true,
    keyNotInData: true,
    align: 'left',
    alignHeader: true,
  },
  {
    label: 'INVESTMENT AMOUNT',
    value: 'amount',
    type: 'amount',
    isSortable: true,
    align: 'left',
    alignHeader: true,
  },
  {
    label: 'MULTIPLE',
    value: 'deal.dealParams.dealMultiple',
    type: 'multiple',
    isSortable: true,
    keyNotInData: true,
    align: 'left',
    alignHeader: true,
  },
  {
    label: 'ESTIMATED VALUE',
    value: 'estimatedValue',
    type: 'estimated',
    isSortable: true,
    align: 'left',
    alignHeader: true,
    keyNotInData: true,
  },
  {
    label: 'INVESTMENT DATE',
    value: '_id',
    type: 'date',
    isSortable: true,
    align: 'left',
    alignHeader: true,
  },
  { label: 'ACTIONS', value: 'actions', type: 'actions', isSortable: false, keyNotInData: true },
];

const getStatusColors = (status) => {
  switch (status) {
    case 'Complete':
      return { backgroundColor: '#C9EEC8', color: '#58CE46' };
    case 'Wired':
      return { backgroundColor: '#C9EEC8', color: '#58CE46' };
    case 'Signed':
      return { backgroundColor: '#FFE9BF', color: '#FFA700' };
    case 'Pledged':
      return { backgroundColor: '#f99fc2', color: '#f92576' };
    case 'Closed':
      return { backgroundColor: '#CECECE', color: '#3D3D3D' };
    case 'Invited':
      return { backgroundColor: '#C0D7FF', color: '#0461FF' };
    default:
      return { backgroundColor: 'rgba(0,0,0,0)', color: 'red' };
  }
};
const BASE = 'appLhEikZfHgNQtrL';
const TABLE = 'Ledger';

const UserInvestments = ({ classes, data, showInvestments, userProfile, refetch }) => {
  const [showResignModal, setShowResignModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCapitalAccounts, setShowCapitalAccounts] = useState(false);
  const [currentCollapsed, setCurrentCollapsed] = useState('');
  const { data: capitalAccounts } = useFetchWithEmail(BASE, TABLE, userProfile?.email || '');

  const getCellContent = (type, row, headerValue) => {
    const { amount } = row;
    const multiple = Number(_.get(row, 'deal.dealParams.dealMultiple', '1'));
    const rowOrg = row.deal?.organization;
    const capFields = (capitalAccounts || []).map((r) => r.fields);
    const capitalAccountInfo = capFields.find((r) => {
      return (
        _.get(r, 'Deal Name (webapp)[0]') === row?.deal?.company_name ||
        _.get(r, 'Deal Name (webapp2)[0]') === row?.deal?.company_name
      );
    });
    console.log('CAP FIELDS', capFields);
    console.log('ALL', capitalAccountInfo);
    const actions = [
      {
        label: 'Deal Page',
        onItemClick: openInNewTab,
        clickArgs: { url: `/deals/${rowOrg.slug}/${row.deal.slug}` },
      },
      {
        label: 'Next Steps',
        onItemClick: openInNewTab,
        clickArgs: {
          url: `/next-steps/${rowOrg.slug}/${row.deal.slug}?investmentId=${row._id}`,
        },
      },
      {
        label: 'Capital Accounts',
        disabled: !capitalAccountInfo,
        onItemClick: () => {
          if (capitalAccountInfo) {
            setShowCapitalAccounts({
              ...capitalAccountInfo,
              investmentId: row._id,
              documents: row?.documents,
            });
          }
        },
      },
    ];
    if (row.submissionData?.submissionId) {
      actions.push({
        label: 'Resign Documents',
        onItemClick: () => {
          setShowResignModal(row);
        },
      });
    }
    if (row.deal.investmentType === 'fund') {
      const fundsInvestmentsAction = {
        label: `Fund's Investments`,
        onItemClick: showInvestments,
        clickArgs: { investment: row },
      };
      actions.splice(2, 0, fundsInvestmentsAction);
    }

    switch (type) {
      case 'type':
        return _.get(row, headerValue, '') === 'fund' ? 'Fund' : 'SPV';
      case 'status':
        return (
          <div
            className={classes.statusContainer}
            style={{
              color: getStatusColors(row.status).color,
              backgroundColor: getStatusColors(row.status).backgroundColor,
            }}
          >
            {row[headerValue]}
          </div>
        );
      case 'amount':
        return `$${nWithCommas(row[headerValue])}`;
      case 'multiple':
        return `${_.get(row, headerValue, '1.0')}x`;
      case 'estimated':
        return `$${nWithCommas(Math.round(amount * multiple))}`;
      case 'date':
        return moment(new Date(parseInt(row._id.substring(0, 8), 16) * 1000)).format('MM/DD/YYYY');
      case 'actions':
        return <MoreMenu menuItems={actions} />;
      default:
        return <div />;
    }
  };

  const getCollapsedContent = (row) => {
    return (
      <Box className={classes.collapsedRow}>
        <Typography className={classes.collapseTitle}>Documents</Typography>
        <Grid container spacing={1}>
          {row.documents.map((doc, index) => (
            <Grid item xs={12} lg={6} key={`doc-${index}`}>
              <DocumentBox doc={doc} docPath={doc.path.split('/')[2]} index={index} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const dataCopy = data
    .filter(
      (inv) =>
        inv.status !== 'invited' &&
        inv.deal.company_name?.toUpperCase().includes(searchTerm?.toUpperCase()),
    )
    .map((inv) => {
      const multiple = Number(_.get(inv, 'deal.dealParams.dealMultiple', '1'));
      const type = inv.deal?.investmentType === 'fund' ? 'fund' : 'SPV';
      return {
        ...inv,
        'deal.dealParams.dealMultiple': multiple,
        estimatedValue: Math.round(inv.amount * multiple),
        'deal.investmentType': type,
        status: titleCase(inv.status),
      };
    });

  const handleRowDetailPage = (row) => {
    setCurrentCollapsed(row._id);
  };

  return (
    <div className={classes.tableContainer}>
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
        withCollapse
        rowSelector="_id"
        currentCollapsed={currentCollapsed}
        getCollapsedContent={getCollapsedContent}
        handleRowDetailPage={handleRowDetailPage}
        rowDetailPage
        data={dataCopy}
        headers={headers}
        getCellContent={getCellContent}
      />
      {showCapitalAccounts && (
        <CapitalAccountsModal
          setShowCapitalAccounts={setShowCapitalAccounts}
          showCapitalAccounts={showCapitalAccounts}
          refetch={refetch}
        />
      )}
      <ResignModal
        showResignModal={showResignModal}
        setShowResignModal={setShowResignModal}
        refetch={refetch}
      />
    </div>
  );
};

export default UserInvestments;
