import React from 'react';
import _ from 'lodash';
import { gql } from 'apollo-boost';
import { Link, useHistory, Redirect } from 'react-router-dom';
import { Col } from 'reactstrap';
import {
  Hidden,
  Paper,
  ListItem,
  List,
  Table,
  TableCell,
  TableRow,
  Grid,
  Button,
  Typography,
} from '@material-ui/core';
import Chart from 'react-google-charts';
import { makeStyles } from '@material-ui/core/styles';
import { nWithCommas } from '../../utils/numbers';
import { validate } from '../forms/InvestorEdit';
import { useAuth } from '../../auth/useAuth';
import allocations_create_deal from '../../assets/allocations_create_deal.svg';
import allocations_faq from '../../assets/allocations_faq.svg';
import allocations_recent_investments from '../../assets/allocations_recent_investments.svg';
import allocations_total_investments from '../../assets/allocations_total_investments.svg';
import allocations_update_profile from '../../assets/allocations_update_profile.svg';
import allocations_update from '../../assets/allocations_update.svg';
import NewHome from './newHome';

import Loader from '../utils/Loader';
import './style.scss';
import NullPaper from '../NullPaper';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  banner: {
    minWidth: '100%',
  },
  blue: {
    color: '#205DF5',
  },
  grey: {
    color: '#707070',
  },
}));

const chartOptions = {
  minColor: '#A5BEFB',
  midColor: '#628DF8',
  maxColor: '#205df5',
  headerHeight: 0,
  fontColor: '#fff',
  highlightColor: '#fff',
  showTooltips: false,
  maxDepth: 1,
  maxPostDepth: 2,
  // showScale: true
};

function formatData(investments) {
  const grouped = investments.reduce((acc, inv) => {
    if (acc[inv.deal._id]) {
      acc[inv.deal._id].amount += inv.amount;
    } else {
      acc[inv.deal._id] = { ...inv };
    }
    return acc;
  }, {});

  const nameChecker = {};

  const d = Object.values(grouped).map((d, i) => {
    const dealName = d.deal.company_name;
    if (nameChecker[dealName]) {
      nameChecker[dealName] += 1;
    } else {
      nameChecker[dealName] = 1;
    }

    const displayName = nameChecker[dealName] === 1 ? dealName : dealName + nameChecker[dealName];
    return [displayName, 'All', d.amount, d.amount - i * 5000, d.deal._id];
  });

  return [
    ['Company', 'Group', 'Amount Invested (size)', 'Company Color (color)', 'Deal ID'],
    ['All', null, 0, 0, null],
  ].concat(d);
}

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
      organizations_admin {
        _id
        slug
        name
        logo
      }
      investments {
        _id
        amount
        status
        deal {
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

function orderInvestments(investments) {
  const pastInvited = investments.filter(({ status }) => status !== 'invited');
  return _.take(
    _.orderBy(pastInvited, (i) => new Date(i.deal.date_closed).getTime(), 'desc'),
    3,
  );
}

export default function UserHome(props) {
  const classes = useStyles();

  const history = useHistory();
  const { userProfile, error, params, adminView } = useAuth(GET_INVESTOR);

  if (error) {
    if (error.message === 'GraphQL error: permission denied' && userProfile && userProfile.email) {
      return <Redirect to="/signup" />;
    }
  }

  if (!userProfile.email)
    return (
      <div>
        <Loader />
      </div>
    );

  const userInvestments = userProfile.investments.filter((inv) => {
    if (!inv?.deal._id) {
      console.log('deal with no deal _id', inv.deal);
    }
    return inv.deal._id;
  });
  const total_invested = _.sumBy(userInvestments, 'amount') || 0;
  const chartEvents = [
    {
      eventName: 'select',
      callback({ chartWrapper }) {
        history.push(`/investments`);
      },
    },
  ];

  return <NewHome />;
}

function Name({ investor }) {
  return investor.investor_type === 'entity' ? investor.entity_name : investor.first_name;
}

function InvestmentStub({ investment }) {
  const history = useHistory();

  if (investment.status === 'invited') return null;

  const { deal } = investment;
  const link = deal.organization ? `/deals/${deal.organization.slug}/${deal.slug}` : `/deals/${deal.slug}`;

  return (
    <TableRow
      hover
      style={{ borderTop: '1px solid #dfe1e5' }}
      button
      key={investment._id}
      className="investment-stub"
      onClick={(e) => {
        e.stopPropagation();
        history.push(link);
      }}
    >
      <TableCell>{deal.company_name}</TableCell>
      <TableCell style={{ color: '#7f8fa4', fontWeight: '500' }}>
        {investment.amount ? `$${nWithCommas(investment.amount)}` : <i>TBD</i>}
      </TableCell>
      <TableCell style={{ textAlign: 'right' }}>
        <span className={`investment-status investment-status-${investment.status}`}>{investment.status}</span>
      </TableCell>
    </TableRow>
  );
}

function NextSteps({ investor }) {
  const history = useHistory();

  const profileComplete = investor && validate(investor).length === 0;
  return (
    <>
      <Typography variant="h6" gutterBottom>
        <span role='img' aria-label='siren'>
          🚨 Next Steps
        </span>
      </Typography>
      <Paper style={{ padding: '16px' }}>
        <List>
          <ListItem button onClick={() => history.push(`/profile`)}>
            <span role='img' aria-label='books'>📚 Complete Your Profile</span> {profileComplete && <span className="checkbox"role='img' aria-label='checkbox'>✅</span>}
          </ListItem>
          <ListItem button disabled>
            <span role='img' aria-label='money'>
              💵 Track My SPV Investment <small className="coming-soon">coming soon</small>
            </span>
          </ListItem>
          <ListItem button disabled>
            <span role='img' aria-label='mailbox'>
              📬 Apply to Join a Fund <small className="coming-soon">coming soon</small>
            </span>
          </ListItem>
          <ListItem button disabled>
            <span role='img' aria-label='bank'>
              🏦 Apply to be a Fund Manager <small className="coming-soon">coming soon</small>
            </span>
          </ListItem>
        </List>
      </Paper>
    </>
  );
}

function DealStub({ deal }) {
  const history = useHistory();
  const link = deal.organization ? `/deals/${deal.organization.slug}/${deal.slug}` : `/deals/${deal.slug}`;

  return (
    <TableRow hover button key={deal._id} className="deal-stub" onClick={() => history.push(link)}>
      <TableCell>{deal.company_name}</TableCell>
      <TableCell>{deal.date_closed || 'TBD'}</TableCell>
      <TableCell style={{ textAlign: 'right' }}>
        <span data-status={deal.status} className="deal-status">
          {deal.status}
        </span>
      </TableCell>
    </TableRow>
  );
}

function AdminTile({ investor }) {
  if (investor.admin || (investor.organizations_admin || []).length > 0) {
    return (
      <Col sm={{ size: 8, offset: 2 }}>
        <div className="tile admin-tile">
          <div className="text-center">
            You are a Fund Manager &nbsp;&nbsp;
            <Link to="/admin/funds">
              <Button variant="contained" size="small" color="primary">
                My Funds 🗂
              </Button>
            </Link>
          </div>
        </div>
      </Col>
    );
  }
  return null;
}

const NoInvestmentBanner = () => {
  const classes = useStyles();
  return (
    <Grid item sm={12} md={6} className={classes.banner}>
      <Paper className={classes.paper}>
        <Typography variant="body1" className={classes.grey}>
          Please contact your deal manager or Allocations if you are waiting for a unique link to join a private deal!
        </Typography>
      </Paper>
    </Grid>
  );
};
