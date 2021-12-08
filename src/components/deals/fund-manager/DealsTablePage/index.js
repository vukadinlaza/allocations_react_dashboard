import React from 'react';
import { withRouter, useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styles from '../../../dashboard/FundManagerDashboard/styles';
import DealsTable from './DealsTable';
import Loader from '../../../utils/Loader';

const GET_DEALS = gql`
  query GetOrg($slug: String!, $offset: Int, $limit: Int, $status: String) {
    organization(slug: $slug, offset: $offset, limit: $limit) {
      _id
      n_deals
      deals(offset: $offset, limit: $limit, status: $status) {
        _id
        name
        slug
        status
        amount_raised
        target
        company_name
        company_description
        pledge_link
        onboarding_link
        date_closed
        dealParams {
          wireDeadline
        }
        deal_lead
        created_at
        investments {
          _id
          amount
          status
          metaData
          investor {
            _id
            name
            investingAs
          }
        }
      }
    }
  }
`;

const DealTable = ({ classes }) => {
  const { org_slug } = useParams();

  const { data, loading } = useQuery(GET_DEALS, {
    variables: { slug: org_slug, offset: 0, limit: 10 },
  });

  const typeDisplay = 'SPVs';

  if (loading) return <Loader />;

  return (
    <Grid container spacing={1} className={classes.section} style={{ paddingTop: '0px' }}>
      <Grid sm={12} lg={12} style={{ margin: '.75rem', fontWeight: '900' }}>
        <Typography color="inherit" variant="h3">
          {typeDisplay}
        </Typography>
      </Grid>
      <Grid sm={12} lg={12}>
        <div className={classes.contentContainer}>
          <DealsTable deals={data.organization.deals} />
        </div>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(withRouter(DealTable));
