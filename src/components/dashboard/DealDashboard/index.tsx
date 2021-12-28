import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams, withRouter, RouteComponentProps } from 'react-router-dom';
import { useHistory } from 'react-router';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Button, Grid, Typography } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import HighlightedTabs from '../../utils/HighlightedTabs';
import LoadingPlaceholder from './LoadingPlaceholder';
import Investors from './sections/Investors';
import DealProgress from './sections/DealProgress';
import backArrow from '../../../assets/back-arrow.svg';
import styles from './styles';
import { useCurrentOrganization } from '../../../state/current-organization';

// const GET_DEAL = gql`
//   query GetDeal($fund_slug: String!, $deal_slug: String!) {
//     deal(fund_slug: $fund_slug, deal_slug: $deal_slug) {
//       _id
//       company_name
//       investments {
//         _id
//         amount
//         investor {
//           _id
//           first_name
//           last_name
//           name
//           email
//           accredidation_status
//         }
//       }
//     }
//   }
// `;

const DEAL = gql`
  query getDealByIdWithTasks($deal_id: String) {
    getDealByIdWithTasks(deal_id: $deal_id) {
      _id
      metadata
      manager_name
      name
      wire_deadline
      phase
      phases {
        _id
        name
        deal_id
        tasks {
          _id
          title
          description
          metadata
          type
          complete
          done_by
          created_at
          updated_at
        }
      }
    }
  }
`;

interface Props extends WithStyles<typeof styles> {}

const dealDashboardTabs = ['Deal Progress', 'Investors', 'Documents', 'Deal Page'];

const DealDashboard: React.FC<Props & RouteComponentProps> = ({ classes }) => {
  const history = useHistory();
  // i realize this could be confusing, but the global state might be preferable to grab.
  const currentOrg = useCurrentOrganization();
  const params: { organization: string; deal_id: string } = useParams();
  const { organization: orgSlug, deal_id } = params;
  const [tabIndex, setTabIndex] = useState(0);
  // const { data: dealData } = useQuery(GET_DEAL, {
  //   variables: { deal_slug, fund_slug: orgSlug },
  // });
  const { data: dealData } = useQuery(DEAL, {
    variables: { deal_id },
  });

  console.log('data:', dealData);
  console.log('Deal Id:', deal_id);
  console.log('Org Slug:', orgSlug);
  const handleTabChange = (event: any, index: number) => {
    setTabIndex(index);
  };

  const getTabComponent = () => {
    if (!dealData) return <LoadingPlaceholder />;
    const tabName = dealDashboardTabs[tabIndex];
    switch (tabName) {
      case 'Deal Progress':
        return <DealProgress />;
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

  // I don't see the class 'root' anywhere.
  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Button
            style={{ textTransform: 'capitalize', color: '#64748B', outline: 'none' }}
            startIcon={<img src={backArrow} alt="back arrow" />}
            onClick={() => history.push(`/organizations/${currentOrg.slug}/deals`)}
          >
            Back to SPVs
          </Button>
        </Grid>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={1} />
          <Grid item xs={12} lg={10}>
            <Typography className={classes.pageTitle}>
              {dealData?.getDealByIdWithTasks?.name || 'Deal Name'}
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
