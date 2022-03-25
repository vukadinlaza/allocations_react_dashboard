import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Chip, Icon, Input, List, Menu, Typography } from '@allocations/design-system';
import {
  nWithCommas,
  getMomentFromId,
  sortByNumber,
  customStringSort,
  titleCase,
  sortByDate,
  openInNewTab,
  sortByString,
} from '@allocations/nextjs-common';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import 'chartjs-plugin-datalabels';
import { Grid } from '@material-ui/core';
import { toast } from 'react-toastify';
import { useFetchWithEmail } from '../../../../utils/hooks';

const headers = [
  {
    id: 'portfolioCompany',
    label: 'Portolio Company',
    withSort: true,
    customSort: true,
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
}) => {
  const { data: capitalAccounts } = useFetchWithEmail(BASE, TABLE, userProfile?.email || '');
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [selectedItem, setSelectedItem] = useState('');
  const [userDocuments, setUserDocuments] = useState([]);
  const [loadingDownloadDocs, setLoadingDownloadDoc] = useState(false);

  const itemsPerPage = 5;

  useEffect(() => {
    const userDocs = [];
    if (userInvestments) {
      userInvestments.forEach((inv) => {
        inv.metadata.documents.forEach((doc) => {
          const docNameArray = doc.path.split('/');
          const docName = docNameArray[docNameArray.length - 1];
          userDocs.push({
            ...doc,
            documentName: docName, // have same key document Name for all docs
            type: /K1|K-1/.test(doc.path.toUpperCase())
              ? 'K-1'
              : /AGREEMENT|SUBSCRIPTION|DOCS/.test(doc.path.toUpperCase())
              ? 'Investment Agreement'
              : 'N/A',
            status: 'Complete',
            dealName: inv.dealName,
          });
        });
      });
      setUserDocuments(userDocs);
    }
  }, [userInvestments]);

  const handleZip = async (dealName) => {
    setLoadingDownloadDoc(true);

    try {
      const zip = new JSZip();
      const filteredDocs = userDocuments.filter((d) => {
        return d.dealName === dealName;
      });
      const files = await Promise.all(
        filteredDocs.map((doc) =>
          fetch(doc.link ? `${doc.link.includes('http') ? doc.link : `//${doc.link}`}` : '', {
            mode: 'no-cors',
          }).then((res) => res.blob()),
        ),
      );

      files.forEach((file, i) =>
        zip.file(`${filteredDocs[i].documentName.replace('.pdf', '')}.pdf`, file),
      );

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${dealName}_Investment_Documents.zip`);
    } catch {
      toast.error('Error downloading Investment Documents');
    } finally {
      setLoadingDownloadDoc(false);
    }
  };

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
        openInNewTab(`/deals/${orgSlug}/${dealSlug}`);
        break;
      case 'nextSteps':
        openInNewTab(`/next-steps/${orgSlug}/${dealSlug}`);
        break;
      case 'downloadDocs':
        loadingDownloadDocs ? console.log('loading') : handleZip(investment.dealName);
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
      {
        id: 'downloadDocs',
        label: 'Download Documents',
        startIcon: {
          iconName: 'description',
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
            portfolioCompany: (
              <Typography
                component="div"
                content={titleCase(dealName || '')}
                fontWeight={700}
                variant="button"
              />
            ),
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
            investmentDate: getMomentFromId(_id).format('MMM DD, YYYY'),
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
      case 'portfolioCompany':
        return data.sort((a, b) => {
          return sortByString(a[orderBy].props.content, b[orderBy].props.content, '', direction);
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
    investment.portfolioCompany?.props?.content?.toLowerCase().includes(search?.toLowerCase()),
  );

  return (
    <Grid container spacing={2} className={classes.listsContainer}>
      <Grid item xs={1} />
      <Grid item xs={10} className={classes.list}>
        <div className={classes.listTitleContainer}>
          <Typography component="div" content="Investments" fontWeight={700} variant="heading3" />
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
