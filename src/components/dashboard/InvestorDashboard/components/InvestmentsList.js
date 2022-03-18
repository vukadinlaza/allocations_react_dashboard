import React, { useState } from 'react';
import _ from 'lodash';
import { Button, Chip, Icon, Input, List, Menu, Typography } from '@allocations/design-system';
import {
  nWithCommas,
  getMomentFromId,
  sortByNumber,
  customStringSort,
  titleCase,
  sortByDate,
} from '@allocations/nextjs-common';
import 'chartjs-plugin-datalabels';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router';
import { useFetchWithEmail } from '../../../../utils/hooks';

const headers = [
  {
    id: 'portfolioCompany',
    label: 'Portolio Company',
    withSort: true,
  },
  {
    id: 'company_name',
    label: 'Deal Name',
    withSort: true,
  },
  {
    id: 'amount',
    label: 'Investment',
    withSort: true,
    customSort: true,
  },
  {
    id: 'dealMultiple',
    label: 'Multiple',
    withSort: true,
    customSort: true,
  },
  {
    id: 'value',
    label: 'Value',
    withSort: true,
    customSort: true,
  },
  {
    id: 'type',
    label: 'Type',
    withSort: true,
  },
  {
    id: 'status',
    label: 'Status',
    withSort: true,
    customSort: true,
  },
  {
    id: 'investmentDate',
    label: 'Investment Date',
    withSort: true,
    customSort: true,
  },
  {
    id: 'actions',
    label: '',
  },
];

const getChipColor = {
  'post-build': 'gray',
  'pre-onboarding': 'blue',
  onboarding: 'green',
  closing: 'yellow',
  'post-closing': 'red',
  closed: 'black',
};

const BASE = 'appLhEikZfHgNQtrL';
const TABLE = 'Ledger';

const InvestmentsList = ({
  classes,
  userInvestments,
  showInvestments,
  showResignInvestment,
  userProfile,
  setShowCapitalAccounts,
  setShowDocuments,
}) => {
  const { data: capitalAccounts } = useFetchWithEmail(BASE, TABLE, userProfile?.email || '');
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [selectedItem, setSelectedItem] = useState('');
  const history = useHistory();

  const itemsPerPage = 5;

  const handleMenuOpen = (e, index) => {
    setAnchorEl(e.currentTarget);
    setMenuOpen(index);
  };

  const selectItem = (item) => {
    setSelectedItem(item);
  };

  const handleMenuClose = (item) => {
    selectItem(item);
    setSelectedItem(item.id);
    setMenuOpen(false);
    setAnchorEl(null);
  };

  const handleItemClick = ({ id, capitalAccounts }, { metadata, ...investment }) => {
    const { orgSlug, dealSlug, dealId } = metadata;
    switch (id) {
      case 'dealPage':
        history.push(`/deals/${orgSlug}/${dealSlug}`);
        break;
      case 'nextSteps':
        history.push(`/next-steps/${orgSlug}/${dealSlug}`);
        break;
      case 'fundsInvestments':
        showInvestments(dealId);
        break;
      case 'resign':
        showResignInvestment(investment);
        break;
      case 'capitalAccounts':
        setShowCapitalAccounts(capitalAccounts);
        break;
      default:
        console.log('no item with that id');
    }
  };

  const getRowItems = ({ metadata, dealName, ...investment }) => {
    const rowItems = [
      {
        id: 'dealPage',
        label: 'Deal Page',
        startIcon: {
          iconName: 'dashboard',
          iconColor: '#64748B',
        },
      },
      {
        id: 'nextSteps',
        label: 'Next Steps',
        startIcon: {
          iconName: 'dns',
        },
      },
    ];

    if (investment.type === 'fund') {
      rowItems.push({
        id: 'fundsInvestments',
        label: 'Funds Investments',
        startIcon: {
          iconName: 'timeline',
        },
      });
    }
    if (metadata.submissionId) {
      rowItems.push({
        id: 'resign',
        label: 'Resign Documents',
        startIcon: {
          iconName: 'drive_file_rename_outline',
        },
      });
    }

    const capFields = (capitalAccounts || []).map((r) => r.fields);
    const capitalAccountInfo = capFields.find((r) => {
      return (
        _.get(r, 'Deal Name (webapp)[0]') === dealName ||
        _.get(r, 'Deal Name (webapp2)[0]') === dealName
      );
    });
    if (capitalAccountInfo) {
      rowItems.push({
        id: 'capitalAccounts',
        label: `Capital Accounts`,
        capitalAccounts: {
          ...capitalAccountInfo,
          investmentId: investment._id,
          documents: investment?.documents,
        },
        startIcon: {
          iconName: 'event',
        },
      });
    }

    return rowItems;
  };

  const getFormattedData = () =>
    userInvestments.length
      ? userInvestments.map((investment, index) => {
          const { dealName, amount, dealMultiple, type, dealStatus, _id } = investment;
          return {
            portfolioCompany: titleCase(dealName || ''),
            dealName: titleCase(dealName || ''),
            amount: `$${nWithCommas(amount)}`,
            dealMultiple: `${Number(dealMultiple).toFixed(2)}x`,
            value: `$${nWithCommas(Math.round(amount * Number(dealMultiple)))}`,
            type: titleCase(type || 'spv'),
            dealStatus: (
              <Chip
                chipColor={getChipColor[dealStatus]}
                chipSize="small"
                icons="none"
                text={`${titleCase(dealStatus || '')}`}
              />
            ),
            investmentDate: getMomentFromId(_id).format('MM/DD/YYYY'),
            actions: (
              <span className={classes.menuContainer}>
                <Icon onClick={(e) => handleMenuOpen(e, index)} iconName="more_vert" id={index} />
                <Menu
                  anchorEl={anchorEl}
                  onClose={handleMenuClose}
                  onMenuItemClick={(item) => handleItemClick(item, investment)}
                  selectedMenuItem={selectedItem}
                  getContentAnchorEl={null}
                  transformOrigin={{
                    horizontal: 'right',
                    vertical: 'top',
                  }}
                  open={menuOpen === index}
                  menuItems={getRowItems(investment)}
                />
              </span>
            ),
          };
        })
      : [{}];

  const handleSort = (data, orderBy, direction) => {
    const statusOrder = {
      'Post-build': 1,
      'Pre-onboarding': 2,
      Onboarding: 3,
      Closing: 4,
      'Post-closing': 5,
      Closed: 6,
    };
    const numberAmount = (amount) => {
      return Number(amount?.replace(/[^\d.-]/g, ''));
    };

    switch (orderBy) {
      case 'amount':
      case 'value':
      case 'dealMultiple':
        return data.sort((a, b) =>
          sortByNumber(numberAmount(a[orderBy]), numberAmount(b[orderBy]), '', direction),
        );
      case 'status':
        return data.sort((a, b) => {
          return customStringSort(
            a.dealStatus.props.text,
            b.dealStatus.props.text,
            statusOrder,
            '',
            direction,
          );
        });
      case 'investmentDate':
        return data.sort((a, b) =>
          sortByDate(new Date(a.investmentDate), new Date(b.investmentDate), '', direction),
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
    investment.dealName?.toLowerCase().includes(search?.toLowerCase()),
  );

  return (
    <Grid container spacing={2} className={classes.listsContainer}>
      <Grid item xs={1} />
      <Grid item xs={10} className={classes.list}>
        <div className={classes.listTitleContainer}>
          <Typography component="div" content="Investments" fontWeight={700} variant="heading3" />
          <Button
            text="View Documents"
            variant="primary"
            onClick={() => setShowDocuments(true)}
            startIcon={<Icon iconName="description" iconColor="#FFFFFF" />}
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
          headers={headers}
          customSort={handleSort}
          sortBy="amount"
          sortDirection="desc"
          withPagination={!(filteredData.length < itemsPerPage)}
          itemsPerPage={itemsPerPage}
        />
      </Grid>
      <Grid item xs={false} md={1} />
    </Grid>
  );
};

export default InvestmentsList;
