import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { withRouter, RouteComponentProps, useParams } from 'react-router-dom';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Grid, InputAdornment, TextField } from '@material-ui/core';
import {
  Typography as AllocationsTypography,
  Chip as AllocationsChip,
  Button as AllocationsButton,
  List as AllocationsList,
  Icon as AllocationsIcon,
} from '@allocations/design-system';
import { v4 as uuidv4 } from 'uuid';
import { Box, BigBox } from '../Common/components';
import { Header, Deal, GeneralObject } from '../Common/types';
import { nWithCommas } from '../../../utils/numbers';
import styles from './styles';
import { titleCase } from '../../../utils/helpers';
import { useAuth } from '../../../auth/useAuth';
import AllocationsLoader from '../../utils/AllocationsLoader';

export const ORG_DEALS = gql`
  query GetOrg($slug: String!) {
    organization(slug: $slug) {
      _id
      slug
      deals(limit: 100) {
        _id
        company_name
        investmentType
        status
        dealParams {
          dealMultiple
        }
        investments {
          _id
          amount
          status
        }
        AUM
      }
    }
  }
`;

const AUM_DATA = gql`
  query OrganizationAUM($slug: String!) {
    aum: organization(slug: $slug) {
      total: totalAUM
    }
  }
`;

const TOTAL_SPVS_DATA = gql`
  query OrganizationSPVs($slug: String!) {
    spvs: organization(slug: $slug) {
      total: totalSPVs
    }
  }
`;

const TOTAL_FUNDS_DATA = gql`
  query OrganizationFunds($slug: String!) {
    funds: organization(slug: $slug) {
      total: totalFunds
    }
  }
`;

const TOTAL_INVESTMENTS_DATA = gql`
  query OrganizationFunds($slug: String!) {
    investments: organization(slug: $slug) {
      total: totalInvestments
    }
  }
`;

const headers: Header[] = [
  {
    id: 'company_name',
    isButton: false,
    label: 'Deal Name',
    withSort: true,
  },
  {
    id: 'status',
    isButton: false,
    label: 'Status',
    withSort: true,
  },
  {
    id: 'amountRaised',
    isButton: false,
    label: 'Total Raised',
    withSort: true,
  },
  {
    id: 'manage',
    isButton: true,
    label: '',
    withSort: false,
  },
];

type Props = WithStyles<typeof styles>;

const FundManagerDashboard: React.FC<Props & RouteComponentProps> = ({ classes, history }) => {
  const { userProfile } = useAuth();
  const params = useParams();
  const orgSlug = (params as GeneralObject)?.organization;
  const [searchTerm, setSearchTerm] = useState('');
  const { data: aumData } = useQuery(AUM_DATA, { variables: { slug: orgSlug } });
  const { data: totalSpvData } = useQuery(TOTAL_SPVS_DATA, { variables: { slug: orgSlug } });
  const { data: totalFundsData } = useQuery(TOTAL_FUNDS_DATA, { variables: { slug: orgSlug } });
  const { data: totalInvestmentsData } = useQuery(TOTAL_INVESTMENTS_DATA, {
    variables: { slug: orgSlug },
  });
  const { data } = useQuery(ORG_DEALS, {
    variables: {
      slug: orgSlug,
    },
  });

  const orgAUM = () => {
    if (data?.organization?.deals) {
      const { deals } = data.organization;
      return deals
        .map((deal: Deal) => {
          // eslint-disable-next-line prefer-const
          let { dealParams: { dealMultiple = {} } = {}, AUM } = deal;
          dealMultiple = Number(dealMultiple);
          if (dealMultiple && dealMultiple > 1) {
            return (dealMultiple as number) * AUM;
          }
          return AUM || 0;
        })
        .reduce((acc: number, n: number) => {
          return acc + n;
        }, 0);
    }
  };

  const getFormattedAmount = (amount: number) => {
    if (amount > 1000000) {
      return `${Math.round(amount / 1000000)}m`;
    }
    if (amount > 1000) {
      return `${Math.round(amount / 1000)}k`;
    }
    return amount;
  };

  const dashboardBoxes: { title: string; value: number | string }[] = [
    { title: 'Total AUM', value: `$${getFormattedAmount(orgAUM()) || 0}` },
    {
      title: 'Total Raised',
      value: `$${getFormattedAmount(aumData?.aum?.total) || 0}`,
    },
    {
      title: 'Estimated Multiple',
      value: `${(orgAUM() / (aumData?.aum?.total || 1)).toFixed(1) || 1}x`,
    },
    {
      title: 'Total Private Funds',
      value: `${(totalFundsData?.funds?.total || 0) + (totalSpvData?.spvs?.total || 0)}`,
    },
    { title: 'Total Investors', value: totalInvestmentsData?.investments?.total || 0 },
  ];

  const getChipColor = (status: string) => {
    switch (status) {
      case 'pre-onboarding':
        return 'blue';
      case 'onboarding':
        return 'green';
      case 'closing':
        return 'yellow';
      case 'closed':
        return 'black';
      default:
        return 'blue';
    }
  };

  const getListData = (type: string) => {
    return data.organization?.deals
      ?.filter((d: Deal) =>
        type === 'spv' ? d.investmentType !== 'fund' : d.investmentType === 'fund',
      )
      .filter((d: Deal) => d.company_name.toUpperCase().includes(searchTerm.toUpperCase()))
      .reverse()
      .map((deal: Deal) => {
        let dealRaised: number | number[] = deal.investments?.map((i) =>
          ['complete', 'wired'].includes(i.status) ? i.amount : 0,
        );
        dealRaised = dealRaised.length
          ? dealRaised.reduce((acc, n) => {
              return acc + n;
            }, 0)
          : 0;
        return {
          company_name: deal.company_name,
          status: (
            <AllocationsChip
              chipColor={getChipColor(deal.status)}
              chipSize="small"
              icons="none"
              text={`${titleCase(deal.status)}`}
            />
          ),
          amountRaised: `$${nWithCommas(dealRaised)}`,
          manage: (
            <AllocationsButton
              onClick={() => history.push(`/admin/${orgSlug}/deals/${deal._id}`)}
              size="small"
              text="Manage"
              variant="primary"
            />
          ),
        };
      });
  };

  const updateSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchTerm(event.currentTarget.value);
  };

  if (!data) return <AllocationsLoader fullHeight />;

  const spvs = getListData('spv');
  const funds = getListData('fund');

  return (
    <Grid container spacing={2} className={classes.mainContainer}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={1} />
          <Grid
            item
            xs={10}
            container
            spacing={2}
            className={classes.titleContainer}
            alignItems="center"
          >
            <Grid item xs={12} lg={8}>
              <AllocationsTypography
                component="div"
                content="Dashboard"
                fontWeight={700}
                variant="heading2"
              />
            </Grid>
            <Grid
              item
              xs={12}
              lg={4}
              justifyContent="space-between"
              className={classes.buttonsContainer}
            >
              {userProfile?.admin && (
                <AllocationsButton
                  onClick={() => history.push(`/admin/${orgSlug}/deal/new`)}
                  size="small"
                  text="Create New Deal Page"
                  variant="secondary"
                />
              )}
              {userProfile?.admin && (
                <AllocationsButton
                  onClick={() => history.push(`/admin/${orgSlug}/manager`)}
                  size="small"
                  text="Add Org Admin"
                  variant="primary"
                />
              )}
            </Grid>
          </Grid>
          <Grid item xs={1} />
        </Grid>
        <Grid container spacing={2} className={classes.computerBoxes}>
          <Grid item xs={1} />
          {dashboardBoxes.map((box) => (
            <Box key={uuidv4()} box={box} />
          ))}
          <Grid item xs={1} />
        </Grid>
        <Grid container spacing={2} className={classes.mobileBoxes}>
          {dashboardBoxes.map((box) => (
            <Grid container spacing={2} key={uuidv4()} className={classes.box}>
              <Grid item xs={1} />
              <Box box={box} />
              <Grid item xs={1} />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={2} className={classes.searchContainer}>
          <Grid item xs={1} />
          <Grid item xs={10}>
            <AllocationsTypography
              component="div"
              content="Deals"
              fontWeight={700}
              variant="heading3"
            />
            <TextField
              variant="outlined"
              placeholder="Search investor"
              className={classes.textFieldRoot}
              onChange={(e) => updateSearch(e)}
              InputLabelProps={{ style: { top: '-4px' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AllocationsIcon iconColor="#64748B" iconName="search" />
                  </InputAdornment>
                ),
                classes: { input: classes.input, root: classes.inputRoot },
              }}
            />
          </Grid>
          <Grid item xs={1} />
        </Grid>
        <Grid container spacing={2} zeroMinWidth className={classes.listsContainer}>
          <Grid item xs={1} />
          <Grid item xs={10}>
            <Grid container justifyContent="space-between">
              <Grid item xs={12} xl={6} className={classes.list}>
                <AllocationsTypography
                  component="div"
                  content="SPVs"
                  fontWeight={700}
                  variant="heading3"
                />
                {spvs.length ? (
                  <AllocationsList
                    data={spvs}
                    headers={headers}
                    sortBy=""
                    sortDirection="desc"
                    itemsPerPage={5}
                  />
                ) : (
                  <BigBox content="No SPVs created" />
                )}
              </Grid>
              <Grid item xs={12} xl={6} className={classes.list}>
                <AllocationsTypography
                  component="div"
                  content="Funds"
                  fontWeight={700}
                  variant="heading3"
                />
                {funds.length ? (
                  <AllocationsList
                    data={funds}
                    headers={headers}
                    sortBy=""
                    sortDirection="desc"
                    itemsPerPage={5}
                  />
                ) : (
                  <BigBox content="No Funds created" />
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={false} md={1} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(withRouter(FundManagerDashboard));
