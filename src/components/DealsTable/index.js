import React, { useState } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { SimpleBox } from '../dashboard/FundManagerDashboard/widgets';
import styles from '../dashboard/FundManagerDashboard/styles';
import UserDocuments from './table';
import { nWithCommas } from '../../utils/numbers';
import Loader from '../utils/Loader';

const GET_DEALS = gql`
  query GetOrg($slug: String!, $offset: Int, $limit: Int, $status: String) {
    organization(slug: $slug, offset: $offset, limit: $limit) {
      _id
      n_deals
      deals(offset: $offset, limit: $limit, status: $status) {
        _id
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

  const [openTooltip, setOpenTooltip] = useState('');

  const handleTooltip = (id) => {
    setOpenTooltip(id);
  };

  if (loading) return <Loader />;

  const totalDeals = data.organization.deals.length;
  const totalAUM = data.organization.deals.reduce((acc, c) => acc + c.size, 0);
  const avgMultiple = 2.5;

  return (
    <Grid container spacing={1} className={classes.section} style={{ paddingTop: '0px' }}>
      <Grid sm={12} lg={12} style={{ margin: '.75rem', fontWeight: '900' }}>
        <Typography color="inherit" variant="h3">
          {typeDisplay}
        </Typography>
      </Grid>
      <Grid item xs={12} lg={3}>
        <SimpleBox
          size="fourth"
          title={`Total ${typeDisplay}`}
          openTooltip={openTooltip}
          handleTooltip={handleTooltip}
          id="totalInvested"
          tooltipContent={
            <Typography color="inherit">Total number of {typeDisplay} you've created</Typography>
          }
        >
          <div
            className={classes.simpleBoxDataRow}
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Typography style={{ fontSize: '26px' }}>{totalDeals}</Typography>
          </div>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg={3}>
        <SimpleBox
          size="fourth"
          title="Total AUM"
          openTooltip={openTooltip}
          handleTooltip={handleTooltip}
          id="multiple"
          tooltipContent={
            <Typography color="inherit">
              This is the total USD value of assest under management across all your {typeDisplay}.
            </Typography>
          }
        >
          <div
            className={classes.simpleBoxDataRow}
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Typography style={{ fontSize: '26px' }}>
              ${nWithCommas(Math.round(totalAUM * avgMultiple))}
            </Typography>
          </div>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg={3}>
        <SimpleBox
          size="fourth"
          title="Multiple"
          openTooltip={openTooltip}
          handleTooltip={handleTooltip}
          id="portfolioValue"
          tooltipContent={
            <Typography color="inherit">
              This is the estimated summed multiple of all your {typeDisplay}.
            </Typography>
          }
        >
          <div
            className={classes.simpleBoxDataRow}
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Typography style={{ fontSize: '26px' }}> {avgMultiple}x</Typography>
          </div>
        </SimpleBox>
      </Grid>
      <Grid item xs={12} lg={3}>
        <SimpleBox
          size="fourth"
          title="Total Raised"
          openTooltip={openTooltip}
          handleTooltip={handleTooltip}
          id="totalRaised"
          tooltipContent={
            <Typography color="inherit">
              This is the total USD value of funds raised across all {typeDisplay}.
            </Typography>
          }
        >
          <div
            className={classes.simpleBoxDataRow}
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <Typography style={{ fontSize: '26px' }}>${nWithCommas(totalAUM)}</Typography>
            {/* <Typography className={classes.footerData}>0% Realized | 100% Unrealized</Typography> */}
          </div>
        </SimpleBox>
      </Grid>

      <Grid sm={12} lg={12}>
        <div className={classes.contentContainer}>
          <UserDocuments data={data.organization.deals} type="spvs" />
        </div>
        {/* </Paper> */}
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(withRouter(DealTable));
