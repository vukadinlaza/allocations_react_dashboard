import React, { useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { TextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { toast } from 'react-toastify';
import AllocationsTable from '../../utils/AllocationsTable';
import { nWithCommas } from '../../../utils/numbers';
import { titleCase, openInNewTab } from '../../../utils/helpers';
import MoreMenu from '../../utils/MoreMenu';
import { useFetchWithEmail } from '../../../utils/hooks';
import CapitalAccountsModal from '../capitalAccountsModal';
import AppModal from '../../Modal/AppModal';
import InvestmentEdit from '../../InvestmentEdit/UpdateInvestment';
import ResignModal from '../resignModal';

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
    case 'complete':
      return { backgroundColor: '#C9EEC8', color: '#58CE46' };
    case 'wired':
      return { backgroundColor: '#C9EEC8', color: '#58CE46' };
    case 'signed':
      return { backgroundColor: '#FFE9BF', color: '#FFA700' };
    case 'pledged':
      return { backgroundColor: '#f99fc2', color: '#f92576' };
    case 'closed':
      return { backgroundColor: '#CECECE', color: '#3D3D3D' };
    case 'invited':
      return { backgroundColor: '#C0D7FF', color: '#0461FF' };
    default:
      return { backgroundColor: 'rgba(0,0,0,0)', color: 'red' };
  }
};
const BASE = 'appLhEikZfHgNQtrL';
const TABLE = 'Ledger';

const UserInvestments = ({ classes, data, showInvestments, userProfile, refetch }) => {
  const [showModal, setShowModal] = useState(false);
  const [showResignModal, setShowResignModal] = useState(false);
  const [investmentId, setInvestmentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCapitalAccounts, setShowCapitalAccounts] = useState({});
  const { data: capitalAccounts } = useFetchWithEmail(BASE, TABLE, userProfile?.email || '');

  const showInvestment = ({ invId }) => {
    setShowModal(true);
    setInvestmentId(invId);
  };

  const getCellContent = (type, row, headerValue) => {
    const { amount } = row;
    const multiple = Number(_.get(row, 'deal.dealParams.dealMultiple', '1'));
    const rowOrg = row.deal?.organization;
    const capFields = (capitalAccounts || []).map((r) => r.fields);
    const capitalAccountInfo = capFields.find((r) => {
      return _.get(r, 'Deal Name (webapp)[0]') === row?.deal?.company_name;
    });
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
            setShowCapitalAccounts(capitalAccountInfo);
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
    if (userProfile.admin) {
      const editInvestment = {
        label: 'Edit Investment',
        onItemClick: showInvestment,
        clickArgs: { invId: row._id },
      };
      actions.unshift(editInvestment);
    }

    switch (type) {
      case 'type':
        return titleCase(_.get(row, headerValue, '')) || 'SPV';
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
        return `$${nWithCommas(amount * multiple)}`;
      case 'date':
        return moment(new Date(parseInt(row._id.substring(0, 8), 16) * 1000)).format('MM/DD/YYYY');
      case 'actions':
        return <MoreMenu menuItems={actions} />;
      default:
        return <div />;
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const onClose = () => {
    setShowModal(false);
    setInvestmentId(null);
  };

  const handleUpdate = {
    refetch: () => refetch(),
    closeModal: () => setShowModal(false),
  };

  const dataCopy = data
    .filter(
      (inv) =>
        inv.status !== 'invited' &&
        inv.deal.company_name.toUpperCase().includes(searchTerm.toUpperCase()),
    )
    .map((inv) => {
      const multiple = Number(_.get(inv, 'deal.dealParams.dealMultiple', '1'));
      const type = inv.deal?.investmentType === 'fund' ? 'fund' : 'SPV';
      return {
        ...inv,
        estimatedValue: inv.amount * multiple,
        'deal.investmentType': type,
      };
    });

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
      <AllocationsTable data={dataCopy} headers={headers} getCellContent={getCellContent} />
      <CapitalAccountsModal
        setShowCapitalAccounts={setShowCapitalAccounts}
        showCapitalAccounts={showCapitalAccounts}
      />
      <AppModal isOpen={showModal} onClose={onClose}>
        <InvestmentEdit investmentId={investmentId} handleUpdate={handleUpdate} />
      </AppModal>
      <ResignModal
        showResignModal={showResignModal}
        setShowResignModal={setShowResignModal}
        refetch={refetch}
      />
    </div>
  );
};

export default UserInvestments;
