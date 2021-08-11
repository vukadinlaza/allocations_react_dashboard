import React, { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { Typography, TextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useAuth } from '../../auth/useAuth';
import { nWithCommas } from '../../utils/numbers';
import 'chartjs-plugin-datalabels';
import UserInvestments from './sections/UserInvestments';
import FundsInvestments from './sections/FundsInvestments';
import UserDocuments from './sections/UserDocuments';
import HighlightedTabs from '../utils/HighlightedTabs';
import Highlights from './sections/Highlights';
import styles from './styles';
import AllocationsLoader from '../utils/AllocationsLoader';
import AllocationsTable from '../utils/AllocationsTable';
import { useFetch } from '../../utils/hooks';

const GET_INVESTOR = gql`
  query GetInvestor($email: String, $_id: String) {
    investor(email: $email, _id: $_id) {
      _id
      name
      first_name
      last_name
      entity_name
      country
      signer_full_name
      accredited_investor_status
      investor_type
      email
      organizations
      admin
      documents
      organizations_admin {
        _id
        slug
        name
        logo
      }
      investments {
        _id
        value
        amount
        status
        created_at
        documents {
          path
          link
        }
        deal {
          _id
          slug
          company_name
          company_description
          date_closed
          status
          investmentType
          deal_lead
          dealParams {
            dealMultiple
            wireDeadline
          }
          organization {
            _id
            slug
          }
        }
      }
      invitedDeals {
        _id
        slug
        company_name
        company_description
        date_closed
        status
        organization {
          _id
          slug
        }
      }
    }
  }
`;

const investmentsHeaders = [
  {
    label: 'NAME OF INVESTMENT',
    value: 'Investment',
    isSortable: true,
    align: 'left',
    alignHeader: true,
  },
  {
    label: 'DATE',
    value: 'createdTime',
    type: 'date',
    isSortable: true,
    align: 'right',
    alignHeader: true,
  },
  {
    label: 'AMOUNT',
    value: 'Invested',
    type: 'amount',
    isSortable: true,
    align: 'right',
    alignHeader: true,
  },
];

const investorTabs = ['Highlights', 'Investments', 'Documents'];

const OPS_ACCOUNTING = 'app3m4OJvAWUg0hng';
const INVESTMENTS_TABLE = 'Investments';
const DEALS_TABLE = 'Deals';

const UserHome = ({ classes }) => {
  const { userProfile, refetch } = useAuth(GET_INVESTOR);
  const [tabIndex, setTabIndex] = useState(0);
  const [userFunds, setUserFunds] = useState([]);
  const [dealsData, setDealsData] = useState({});
  const [funds, setFunds] = useState([]);
  const [fundInvestments, setFundInvestments] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (Object.keys(userProfile).length) {
      const funds = userProfile?.investments
        ?.filter((investment) => investment?.deal?.investmentType === 'fund')
        .map((investment) => investment.deal);
      setUserFunds(funds);
    }
  }, [userProfile]);

  const createDealsATFilter = () => {
    if (!userFunds.length) return `({Deal Name}="Invalid deal")`;
    if (!investorTabs.includes('Fund Investments')) {
      investorTabs.splice(2, 0, 'Fund Investments');
    }
    const dealsFilters = userFunds
      .map((fund) => `({Deal Name}="${encodeURIComponent(fund.company_name || 'Invalid name')}")`)
      .join(', ');

    return `OR(${dealsFilters})`;
  };

  const createInvestmentsATFilter = () => {
    if (!userFunds.length) return `(FIND("No Funds found", {Deals}))`;
    const fundsFilters = userFunds
      .map((fund) => `FIND("${encodeURIComponent(fund.company_name || 'Invalid name')}" , {Deals})`)
      .join(', ');

    return `OR(${fundsFilters})`;
  };

  const { data: atDeal } = useFetch(
    OPS_ACCOUNTING,
    userFunds?.length && DEALS_TABLE,
    userFunds?.length && createDealsATFilter(),
  );

  const { data: atFundData } = useFetch(
    OPS_ACCOUNTING,
    Object.keys(dealsData)?.length && INVESTMENTS_TABLE,
    Object.keys(dealsData)?.length && createInvestmentsATFilter(),
  );

  useEffect(() => {
    if (atDeal?.length) {
      const dealsData = {};
      atDeal.forEach((deal) => (dealsData[deal.fields['Deal Name']] = deal.id));
      setDealsData(dealsData);
    }
  }, [atDeal]);

  useEffect(() => {
    if (atFundData?.length) {
      const funds = userFunds.map((deal) => {
        const dealInvestments = atFundData
          .filter((investment) => investment.fields.Deals.includes(dealsData[deal.company_name]))
          .map((investment) => {
            return { ...investment.fields, createdTime: investment.createdTime };
          });
        const AUM = dealInvestments.map((inv) => inv.Invested).reduce((acc, n) => acc + n, 0);
        return { ...deal, investments: dealInvestments, AUM };
      });
      setFunds(funds);
    }
  }, [atFundData]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const showInvestments = (fund) => {
    setSearchTerm('');
    setFundInvestments(fund);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const getTabContent = () => {
    switch (tabIndex) {
      case 0:
        return (
          <Highlights
            data={userProfile.investments}
            classes={classes}
            userProfile={userProfile}
            refetch={refetch}
          />
        );

      case 1:
        return <UserInvestments data={userProfile.investments} classes={classes} />;

      case 2:
        if (investorTabs.includes('Fund Investments')) {
          return (
            <FundsInvestments data={funds} classes={classes} showInvestments={showInvestments} />
          );
        }
        return <UserDocuments data={userProfile} classes={classes} />;

      case 3:
        return <UserDocuments data={userProfile} classes={classes} />;

      default:
        return <p>No Data</p>;
    }
  };

  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'date':
        return moment(row[headerValue]).format('MM/DD/YYYY');
      case 'amount':
        return `$${nWithCommas(row[headerValue])}`;
      default:
        return <div />;
    }
  };

  if (!Object.keys(userProfile).length) return <AllocationsLoader fullHeight />;

  const fundInvestmentsCopy =
    fundInvestments?.investments?.filter((inv) =>
      inv.Investment.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  return (
    <div className={classes.root}>
      {fundInvestments && Object.keys(fundInvestments).length ? (
        <div className={classes.investmentsContainer}>
          <Typography className={classes.mainTitle}>{fundInvestments.company_name}</Typography>
          <span
            className={classes.backButton}
            onClick={() => showInvestments({})}
          >{`< Back to Funds`}</span>
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
            data={fundInvestmentsCopy}
            headers={investmentsHeaders}
            getCellContent={getCellContent}
            sortField="Date"
            sortOrder="desc"
          />
        </div>
      ) : (
        <>
          <Typography className={classes.mainTitle}>
            Hello, {userProfile.first_name || 'investor'}!
          </Typography>
          <HighlightedTabs
            tabs={investorTabs}
            tabIndex={tabIndex}
            handleTabChange={handleTabChange}
          />
          <div className={classes.contentContainer}>{getTabContent()}</div>
        </>
      )}
    </div>
  );
};

export default withStyles(styles)(UserHome);
