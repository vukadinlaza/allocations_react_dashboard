import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { useParams, withRouter, RouteComponentProps } from 'react-router-dom';
import { useHistory } from 'react-router';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { useCurrentOrganization } from '../../../state/current-organization';
import HighlightedTabs from '../../utils/HighlightedTabs';
import LoadingPlaceholder from './LoadingPlaceholder';
import Investors from './sections/Investors';
import DealProgress from './sections/DealProgress';
import { Task, DealPhase } from './types';
import styles from './styles';

const DEAL = gql`
  query getDealByIdWithTasks($deal_id: String) {
    getDealByIdWithTasks(deal_id: $deal_id) {
      _id
      type
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

const UPDATE_BUILD_DEAL = gql`
  mutation updateBuildDeal($payload: Object) {
    updateBuildDeal(payload: $payload)
  }
`;

type Props = WithStyles<typeof styles>;

const DealDashboard: React.FC<Props & RouteComponentProps> = ({ classes }) => {
  const history = useHistory();
  const currentOrg = useCurrentOrganization();
  const params: { deal_id: string } = useParams();
  const { deal_id } = params;
  const [tabIndex, setTabIndex] = useState(0);

  const [dealDashboardTabs, setDealDashboardTabs] = useState([] as string[]);

  const { data: dealData } = useQuery(DEAL, {
    fetchPolicy: 'network-only',
    pollInterval: 1000,
    variables: { deal_id },
  });

  useEffect(() => {
    if (dealData) {
      const remainingTasks = dealData?.getDealByIdWithTasks?.phases.flatMap((phase: DealPhase) =>
        phase.tasks.filter((task: Task) => !task.complete),
      );

      const investorsInvited = remainingTasks.find(
        (task: Task) => task.title === 'Invite Investors',
      );
      if (!remainingTasks?.length) {
        setDealDashboardTabs(['Investors', 'Documents', 'Deal Page']);
      } else if (investorsInvited) {
        setDealDashboardTabs(['Deal Progress', 'Documents', 'Deal Page']);
      } else {
        setDealDashboardTabs(['Deal Progress', 'Investors', 'Documents', 'Deal Page']);
      }
    }
  }, [dealData]);

  const [updateBuildDeal, { loading: updateDealLoading }] = useMutation(UPDATE_BUILD_DEAL);

  const handleTabChange = (event: React.ChangeEvent, index: number) => {
    setTabIndex(index);
  };

  const handleComplete = () => {
    updateBuildDeal({
      variables: {
        payload: {
          deal_id,
        },
      },
    });
  };

  const dealProps = {
    data: dealData?.getDealByIdWithTasks,
    handleComplete,
    updateDealLoading,
    orgSlug: currentOrg?.slug,
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
            orgSlug={currentOrg?.slug}
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
            {
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
              <p
                className={classes.backButton}
                onClick={() => history.push(`/organizations/${currentOrg.slug}/deals`)}
              >
                <ChevronLeftIcon /> Back to SPVs
              </p>
            }
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
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(withRouter(DealDashboard));
