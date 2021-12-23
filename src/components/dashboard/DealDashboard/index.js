import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useLazyQuery, useQuery, gql } from '@apollo/client';
import { useParams, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography } from '@material-ui/core';
import { IoIosArrowBack } from 'react-icons/io';
import { useViewport } from '../../../utils/hooks';
import HighlightedTabs from '../../utils/HighlightedTabs';
import LoadingPlaceholder from './LoadingPlaceholder';
import Investors from './sections/Investors';
import styles from './styles';

const GET_DEAL = gql`
  query GetDeal($fund_slug: String!, $deal_slug: String!) {
    deal(fund_slug: $fund_slug, deal_slug: $deal_slug) {
      _id
      company_name
      investments {
        _id
        amount
        investor {
          _id
          first_name
          last_name
          name
          email
          accredidation_status
        }
      }
    }
  }
`;

const dealDashboardTabs = ['Deal Progress', 'Investors', 'Documents', 'Deal Page'];

const DealDashboard = ({ classes, history }) => {
  const { width } = useViewport();
  const params = useParams();
  const { deal: dealSlug } = params;
  const { organization: orgSlug } = params;
  const [tabIndex, setTabIndex] = useState(0);
  const { data: dealData } = useQuery(GET_DEAL, {
    variables: { deal_slug: dealSlug, fund_slug: orgSlug },
  });

  console.log({ dealSlug, orgSlug, dealData });

  const handleTabChange = (event, index) => {
    setTabIndex(index);
  };

  const getTabComponent = () => {
    if (!dealData) return <LoadingPlaceholder />;
    const tabName = dealDashboardTabs[tabIndex];
    switch (tabName) {
      case 'Deal Progress':
        return <p>Deal Progres</p>;
      case 'Investors':
        return <Investors />;
      case 'Documents':
        return <p>Documents</p>;
      case 'Deal Page':
        return <p>Deal Page</p>;
      default:
        return <p>No Data</p>;
    }
  };

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={4}>
            <p className={classes.backButton}>
              <IoIosArrowBack size="1.2rem" style={{ marginRight: '0.5em' }} /> Back to SPVs
            </p>
          </Grid>
          <Grid item xs={8} />
        </Grid>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={1} />
          <Grid item lg={10}>
            <Typography className={classes.pageTitle}>
              {dealData?.deal?.company_name || 'Deal Name'}
            </Typography>
            <HighlightedTabs
              tabs={dealDashboardTabs}
              tabIndex={tabIndex}
              handleTabChange={handleTabChange}
              rootStyle={{ marginBottom: '32px' }}
            />
          </Grid>
          <Grid item xs={1} />
          {getTabComponent()}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(withRouter(DealDashboard));

// {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
//     <Grid key={value} item>
//         <Paper className={classes.paper}>{value + 1}</Paper>
//     </Grid>
// ))}
