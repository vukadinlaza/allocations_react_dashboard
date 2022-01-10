import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams, withRouter, RouteComponentProps } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useCurrentOrganization } from '../../../state/current-organization';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import HighlightedTabs from '../../utils/HighlightedTabs';
import LoadingPlaceholder from './LoadingPlaceholder';
import Investors from './sections/Investors';
import DealProgress from './sections/DealProgress';
import styles from './styles';
import CompletedTasksList from './sections/DealProgress/components/CompletedTasksList';

const DEAL = gql`
  query getDealByIdWithTasks($deal_id: String) {
    getDealByIdWithTasks(deal_id: $deal_id) {
      _id
      metadata
      manager_name
      name
      company_name
      wire_deadline
      investments {
        _id
        amount
        status
        updated_at
        investor {
          _id
          first_name
          last_name
          name
          email
          accredidation_status
        }
      }
      phase
      phases {
        _id
        name
        deal_id
        tasks {
          _id
          title
          metadata
          type
          complete
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
  const currentOrg = useCurrentOrganization();
  const params: { deal_id: string } = useParams();
  const { deal_id } = params;
  const [tabIndex, setTabIndex] = useState(0);
  const { data: dealData } = useQuery(DEAL, {
    fetchPolicy: 'network-only',
    pollInterval: 1000,
    variables: { deal_id },
  });

  const completedTasks = dealData?.getDealByIdWithTasks?.phases
    .filter((phase: any) => phase.name !== 'build')
    .flatMap((phase: any) =>
      phase.tasks
        .filter((task: any) => task.completed)
        .map((task: any) => ({ ...task, phase: phase.name })),
    );

  const handleTabChange = (event: any, index: number) => {
    setTabIndex(index);
  };

  const dealProps = {
    data: dealData?.getDealByIdWithTasks,
  };

  const getTabComponent = () => {
    if (!dealData) return <LoadingPlaceholder />;
    const tabName = dealDashboardTabs[tabIndex];
    switch (tabName) {
      case 'Deal Progress':
        return <DealProgress {...dealProps} />;
      case 'Investors':
        return (
          <Investors
            investorsData={dealData?.getDealByIdWithTasks?.investments}
            orgSlug={currentOrg.slug}
            dealId={deal_id}
          />
        );
      case 'Documents':
        return <p>Documents </p>;
      case 'Deal Page':
        return <p>Deal Page </p>;
      default:
        return <p>No Data </p>;
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container justifyContent="flex-start" spacing={2}>
          <Grid item xs={4}>
            <p
              className={classes.backButton}
              onClick={() => history.push(`/organizations/${currentOrg.slug}/deals`)}
            >
              <ChevronLeftIcon /> Back to SPVs
            </p>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={1} />
          <Grid item xs={12} lg={10}>
            <Typography className={classes.pageTitle}>
              {dealData?.getDealByIdWithTasks?.name ||
                dealData?.getDealByIdWithTasks?.company_name ||
                'Deal Name'}
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

          <Grid item xs={10} lg={10} style={{ padding: '0px' }}>
            <CompletedTasksList completedTasks={completedTasks} classes={classes} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(withRouter(DealDashboard));
