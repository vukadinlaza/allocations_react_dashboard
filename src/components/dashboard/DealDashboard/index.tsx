import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams, withRouter, RouteComponentProps } from 'react-router-dom';
import { useHistory } from 'react-router';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { toast } from 'react-toastify';
import { useCurrentOrganization } from '../../../state/current-organization';
import HighlightedTabs from '../../utils/HighlightedTabs';
import LoadingPlaceholder from './LoadingPlaceholder';
import { Task, DealPhase } from './types';
import DealPage from '../Common/DealPage';
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

type Props = WithStyles<typeof styles>;

const Investors = React.lazy(() => import('invest/Onboarding'));

const DealDashboard: React.FC<Props & RouteComponentProps> = ({ classes }) => {
  const history = useHistory();
  const currentOrg = useCurrentOrganization();
  const orgSlug = currentOrg?.slug;
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
      const remainingTasks = dealData?.getDealByIdWithTasks?.phases?.flatMap((phase: DealPhase) =>
        phase.tasks.filter((task: Task) => !task.complete),
      );

      const investorsInvited = remainingTasks?.find(
        (task: Task) => task.title === 'Invite Investors',
      );
      if (!remainingTasks?.length) {
        setDealDashboardTabs(['Investors', 'Deal Page']);
      } else if (investorsInvited) {
        setDealDashboardTabs(['Deal Page']);
      } else {
        setDealDashboardTabs(['Investors', 'Deal Page']);
      }
    }
  }, [dealData]);

  const handleTabChange = (event: React.ChangeEvent, index: number) => {
    setTabIndex(index);
  };

  const goToDeal = () => {
    if (orgSlug && dealData.getDealByIdWithTasks.metadata?.slug) {
      window.open(`/deals/${orgSlug}/${dealData.getDealByIdWithTasks.metadata.slug}`);
    }
  };

  const goToEditDeal = () => {
    if (orgSlug && dealData.getDealByIdWithTasks._id) {
      window.open(`/admin/${orgSlug}/deals/${dealData.getDealByIdWithTasks._id}/edit`);
    }
  };

  const handleLinkCopy = () => {
    if (orgSlug && dealData.getDealByIdWithTasks.metadata?.slug) {
      navigator.clipboard.writeText(
        window.origin + (`/deals/${orgSlug}/${dealData.getDealByIdWithTasks.metadata.slug}` || ''),
      );
      toast.info('Copied deal link to clipboard');
    }
  };

  const getTabComponent = () => {
    if (!dealData) return <LoadingPlaceholder />;

    const tabName = dealDashboardTabs[tabIndex];

    switch (tabName) {
      case 'Investors':
        return (
          <React.Suspense fallback="Loading...">
            <Investors deal_id={deal_id} />
          </React.Suspense>
        );
      case 'Documents':
        return <p>Documents </p>;
      case 'Deal Page':
        return (
          <DealPage
            orgSlug={orgSlug}
            dealData={dealData.getDealByIdWithTasks}
            classes={classes}
            goToDeal={goToDeal}
            goToEditDeal={goToEditDeal}
            handleLinkCopy={handleLinkCopy}
          />
        );
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
          <Grid item xs={10} lg={10}>
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
