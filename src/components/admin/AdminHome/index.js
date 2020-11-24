import React, { useState, useEffect } from 'react';
import { gql } from 'apollo-boost';

import { Paper, Grid, ButtonBase, Typography, FormControl, Button, TextField } from '@material-ui/core';
import _ from 'lodash';
import { useQuery } from '@apollo/react-hooks';
import { useParams, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Chart from 'react-google-charts';
import { ActiveDeals } from './components/active-deals';
import ClosedDeals from './components/closed-deals';
import Loader from '../../utils/Loader';
import Investors from '../../Investors';
import Settings from './components/settings';
import Investments from '../../Investments';
import allFundData from './fundData.js';
import FundOverview from './fundOverview';
import { nWithCommas } from '../../../utils/numbers';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  divider: {
    margin: '16px -16px',
  },
  tabs: {
    borderTop: '1px solid #dfe3e9',
    borderBottom: '1px solid #dfe3e9',
    background: '#f7f9fa',
    minHeight: 44,
    margin: '40px 0',
  },
  text: {
    color: '#7f8ea3',
  },
  tab: {
    height: 42,
    width: '100%',
  },
  subtitle: {
    color: '#3A506B',
    marginTop: 16,
  },
  activeTab: {
    height: 42,
    paddingTop: 3,
    width: '100%',
    borderBottom: '3px solid #205DF5',
    outline: '0 !important',
  },
  button: {
    margin: '.5rem',
  },
  orgName: {
    color: '#3A506B',
    fontWeight: 'bolder',
  },
}));

export const ORG_OVERVIEW = gql`
  query GetOrg($slug: String!) {
    organization(slug: $slug) {
      _id
      name
      slug
      deals {
        _id
        raised
        appLink
        status
        date_closed
        dealParams {
          wireDeadline
          dealMultiple
        }
        company_name
        company_description
        target
        investments {
          amount
          investor {
            investingAs
          }
        }
      }
    }
    investor {
      _id
      admin
      documents
    }
  }
`;

export default function AdminHome({}) {
  const { organization: orgSlug } = useParams();
  const [tab, setTab] = useState('active-deals');
  const fundData = allFundData.find((d) => d.slug === orgSlug);
  const classes = useStyles();
  const { data, error, refetch } = useQuery(ORG_OVERVIEW, {
    variables: { slug: orgSlug },
  });

  const history = useHistory();

  if (!data) return <Loader />;
  const orgData = data.organization;

  if (!orgData)
    return (
      <Paper style={{ padding: '25px' }}>
        <Loader />
      </Paper>
    );
  const header = (
    <Grid container justify="space-between">
      <Grid item sm={12} md={6}>
        <Typography variant="h4" className={classes.orgName} style={{ color: fundData ? '#fff' : '#000' }}>
          {orgData.name}
        </Typography>
      </Grid>
      <Grid item sm={12} md={6}>
        <Typography variant="body2" style={{ textAlign: 'right' }}>
          <Grid item xs={12}>
            {data.investor.admin && <SuperAdmin org={orgData} />}
          </Grid>
        </Typography>
      </Grid>
    </Grid>
  );
  return (
    <>
      {fundData ? (
        <FundOverview data={fundData.data} orgData={orgData}>
          {header}
        </FundOverview>
      ) : (
        header
      )}
      <div className={classes.tabs} style={{ marginTop: fundData ? '0px' : 0 }}>
        <Grid container>
          <Grid item xs={12} sm={4} md={2}>
            <ButtonBase
              className={tab === 'active-deals' ? classes.activeTab : classes.tab}
              onClick={() => setTab('active-deals')}
            >
              Active Deals
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <ButtonBase
              className={tab === 'closed-deals' ? classes.activeTab : classes.tab}
              onClick={() => setTab('closed-deals')}
            >
              Closed Deals
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <ButtonBase
              className={tab === 'all-investors' ? classes.activeTab : classes.tab}
              onClick={() => setTab('all-investors')}
            >
              Investors
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <ButtonBase
              className={tab === 'investments' ? classes.activeTab : classes.tab}
              onClick={() => setTab('investments')}
            >
              Investments
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <ButtonBase
              className={tab === 'setting' ? classes.activeTab : classes.tab}
              style={{ borderRight: '1px solid #e1e9ec' }}
              onClick={() => setTab('setting')}
            >
              Settings
            </ButtonBase>
          </Grid>
        </Grid>
      </div>

      <>
        {tab === 'active-deals' && <ActiveDeals orgData={orgData} />}
        {tab === 'closed-deals' && <ClosedDeals orgData={orgData} />}
        {tab === 'all-investors' && <Investors />}
        {tab === 'investments' && <Investments />}
        {tab === 'setting' && <Settings orgData={orgData} investor={data.investor} refetch={refetch} />}
      </>
    </>
  );
}

function SuperAdmin({ org }) {
  const history = useHistory();
  return (
    <>
      <span style={{ marginTop: '5px' }}>
        You are a SuperAdmin{' '}
        <Button
          style={{ marginLeft: 16 }}
          onClick={() => history.push(`/admin/${org.slug}/manager`)}
          size="large"
          variant="contained"
          color="secondary"
        >
          Manage
        </Button>
      </span>
    </>
  );
}
