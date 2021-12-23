import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams, withRouter, RouteComponentProps } from 'react-router-dom';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
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

interface Props extends WithStyles<typeof styles> {}

const dealDashboardTabs = ['Deal Progress', 'Investors', 'Documents', 'Deal Page'];

const DealDashboard: React.FC<Props & RouteComponentProps> = ({ classes }) => {
  const params: { deal_slug: string; organization: string } = useParams();
  const { deal_slug } = params;
  const { organization: orgSlug } = params;
  const [tabIndex, setTabIndex] = useState(0);
  const { data: dealData } = useQuery(GET_DEAL, {
    variables: { deal_slug, fund_slug: orgSlug },
  });

  const handleTabChange = (event: any, index: number) => {
    setTabIndex(index);
  };

  const getTabComponent = () => {
    if (!dealData) return <LoadingPlaceholder />;
    const tabName = dealDashboardTabs[tabIndex];
    switch (tabName) {
      case 'Deal Progress':
        return <p>Deal Progress </p>;
      case 'Investors':
        return <Investors />;
      case 'Documents':
        return <p>Documents </p>;
      case 'Deal Page':
        return <p>Deal Page </p>;
      default:
        return <p>No Data </p>;
    }
  };

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={4}>
            <p className={classes.backButton}>
              <ChevronLeftIcon /> Back to SPVs
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
