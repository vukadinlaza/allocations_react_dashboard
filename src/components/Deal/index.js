import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import BN from 'bignumber.js';
import { useParams, useHistory, Link, useLocation } from 'react-router-dom';
import { useLazyQuery, useMutation, gql } from '@apollo/client';
import { Paper, List, ListItem, ListItemText, Grid, Button } from '@material-ui/core';
import { colors } from '@allocations/design-system';
import queryString from 'query-string';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import moment from 'moment';
import base64 from 'base-64';
import { useAuth } from '../../auth/useAuth';
import InvestmentFlow from './DealFlow';
import Pledge from './Pledge';
import Loader from '../utils/Loader';

/** *
 *
 * Deal page shows a deal docs/pledging/onboarding/wiring flow
 *
 * */

export const GET_INVESTOR_DEAL = gql`
  query Deal($deal_slug: String!, $fund_slug: String!) {
    user {
      _id
      name
      first_name
      last_name
      entity_name
      country
      investor_type
      signer_full_name
      accredited_investor_status
      email
      documents
      invitedDeal(deal_slug: $deal_slug, fund_slug: $fund_slug) {
        _id
        approved
        created_at
        company_name
        company_description
        date_closed
        deal_lead
        pledge_link
        onboarding_link
        status
        memo
        documents {
          path
          link
        }
        investment {
          _id
          amount
          status
        }
        dealParams {
          dealType
          totalRoundSize
          allocation
          totalCarry
          minimumInvestment
          signDeadline
          wireDeadline
          estimatedSetupCosts
          estimatedSetupCostsDollar
          estimatedTerm
          managementFees
          managementFeesDollar
          managementFeeType
          portfolioTotalCarry
          portfolioEstimatedSetupCosts
          portfolioEstimatedSetupCostsDollar
          portfolioManagementFees
          portfolioManagementFeesDollar
          portfolioManagementFeeType
          fundTotalCarry
          fundEstimatedSetupCosts
          fundEstimatedSetupCostsDollar
          fundManagementFees
          fundManagementFeesDollar
          fundManagementFeeType
          fundGeneralPartner
          fundEstimatedTerm
        }
      }
    }
  }
`;

export const CREATE_INVESTMENT = gql`
  mutation CreateInvestment($investment: InvestmentInput!) {
    createInvestment(investment: $investment) {
      _id
    }
  }
`;
// TODO: Change the slug in the DB if needed
// export const legacySlugMap = {
//   Xplore: "xplore",
//   Swarm: "swarm",
//   Volumetric: "volumetric",
//   Focusmate: "focusmate",
//   "Focusmate SPV": "focusmate-spv",
//   'volumetric-spv%20seed%20round': "volumetric-spv-seed-round"
// }
const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

export function DealParams({ deal, deal_slug }) {
  const { dealParams } = deal;
  const history = useHistory();
  const { userProfile } = useAuth();

  const allocationPercent =
    dealParams.totalRoundSize && dealParams.allocation
      ? new BN(dealParams.allocation).dividedBy(dealParams.totalRoundSize).times(100).toFixed(0)
      : null;

  const setupCosts =
    dealParams.totalRoundSize && dealParams.estimatedSetupCosts
      ? new BN(dealParams.estimatedSetupCosts)
          .dividedBy(dealParams.totalRoundSize)
          .times(100)
          .toFixed(0)
      : null;

  const show =
    allocationPercent ||
    setupCosts ||
    dealParams.totalCarry ||
    dealParams.minimumInvestment ||
    dealParams.totalManagementFee ||
    dealParams.signDeadline ||
    dealParams.wireDeadline ||
    dealParams.estimatedSetupCosts ||
    dealParams.estimatedSetupCostsDollar ||
    dealParams.estimatedTerm ||
    dealParams.managementFees ||
    dealParams.managementFeesDollar ||
    dealParams.portfolioTotalCarry ||
    dealParams.portfolioEstimatedSetupCosts ||
    dealParams.portfolioEstimatedSetupCostsDollar ||
    dealParams.portfolioManagementFees ||
    dealParams.portfolioManagementFeesDollar ||
    dealParams.fundTotalCarry ||
    dealParams.fundEstimatedSetupCosts ||
    dealParams.fundEstimatedSetupCostsDollar ||
    dealParams.fundManagementFees ||
    dealParams.fundManagementFeesDollar ||
    dealParams.fundGeneralPartner ||
    dealParams.fundEstimatedTerm;

  const formattedDate_sign = moment(dealParams.signDeadline).format('Do MMMM YYYY, h:mm a');
  const formattedDate_wire = moment(dealParams.wireDeadline).format('Do MMMM YYYY, h:mm a');
  const isOrgAdmin = userProfile?.organizations_admin?.find((org) => org.slug === deal_slug);
  return (
    <>
      {isOrgAdmin && (
        <div
          style={{
            minWidth: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Button
            color="primary"
            style={{ minWidth: '105px' }}
            size="sm"
            onClick={() => history.push(`/admin/${deal_slug}/deals/${deal._id}/edit`)}
            variant="contained"
          >
            Edit Deal
          </Button>
          <Button
            color="primary"
            style={{ minWidth: '105px' }}
            size="sm"
            onClick={() => history.push(`/admin/${deal_slug}`)}
            variant="contained"
          >
            View Fund
          </Button>
        </div>
      )}
      {(dealParams.signDeadline || dealParams.wireDeadline) && (
        <div
          style={{
            backgroundColor: colors.gray[50],
            height: 44,
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 8,
            textAlign: 'left',
            padding: '10px',
            borderTop: `1px solid ${colors.gray[200]}`,
            borderBottom: `1px solid ${colors.gray[200]}`,
          }}
        >
          <span>Deadlines</span>
        </div>
      )}
      {show && (
        <>
          <List>
            <ListItem>
              <ListItemText
                primary="Signing Deadline"
                secondary={`${_.upperFirst(formattedDate_sign)} PST`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Wiring Deadline"
                secondary={`${_.upperFirst(formattedDate_wire)} PST`}
              />
            </ListItem>
          </List>
        </>
      )}

      {(deal.deal_lead ||
        dealParams.estimatedSetupCosts ||
        dealParams.totalCarry ||
        dealParams.estimatedTerm ||
        dealParams.managementFees ||
        dealParams.managementFeesDollar) && (
        <div
          style={{
            backgroundColor: colors.gray[50],
            height: 44,
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 8,
            textAlign: 'left',
            padding: '10px',
            borderTop: `1px solid ${colors.gray[200]}`,
            borderBottom: `1px solid ${colors.gray[200]}`,
          }}
        >
          <span>SPV Terms</span>
        </div>
      )}
      {show && (
        <>
          <List>
            {deal.deal_lead && (
              <ListItem>
                <ListItemText primary="Organizer" secondary={deal.deal_lead} />
              </ListItem>
            )}
            {dealParams.totalCarry && (
              <ListItem>
                <ListItemText primary="Total Carry" secondary={`${dealParams.totalCarry}%`} />
              </ListItem>
            )}
            {dealParams.estimatedSetupCosts && (
              <ListItem>
                <ListItemText
                  primary="Estimated Setup Costs"
                  secondary={`${dealParams.estimatedSetupCosts}% (Excludes blue sky fees)`}
                />
              </ListItem>
            )}
            {dealParams.estimatedSetupCostsDollar && (
              <ListItem>
                <ListItemText
                  primary="Estimated Setup Costs"
                  secondary={`$${dealParams.estimatedSetupCostsDollar} (Excludes blue sky fees)`}
                />
              </ListItem>
            )}
            {dealParams.managementFees && (
              <ListItem>
                <ListItemText
                  primary="Management Fee"
                  secondary={`${dealParams.managementFees}% ${
                    dealParams.managementFeeType === null ? '' : `(${dealParams.managementFeeType})`
                  }`}
                />
              </ListItem>
            )}
            {dealParams.managementFeesDollar && (
              <ListItem>
                <ListItemText
                  primary="Management Fee"
                  secondary={`$${dealParams.managementFeesDollar} ${
                    dealParams.managementFeeType === null ? '' : `(${dealParams.managementFeeType})`
                  }`}
                />
              </ListItem>
            )}
            {dealParams.estimatedTerm && (
              <ListItem>
                <ListItemText
                  primary="Estimated Term"
                  secondary={`${dealParams.estimatedTerm} Years`}
                />
              </ListItem>
            )}
          </List>
        </>
      )}

      {(dealParams.portfolioTotalCarry ||
        dealParams.portfolioEstimatedSetupCosts ||
        dealParams.portfolioEstimatedSetupCostsDollar ||
        dealParams.portfolioManagementFees ||
        dealParams.portfolioManagementFeesDollar) && (
        <div
          style={{
            backgroundColor: colors.gray[50],
            height: 44,
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 8,
            textAlign: 'left',
            padding: '10px',
            borderTop: `1px solid ${colors.gray[200]}`,
            borderBottom: `1px solid ${colors.gray[200]}`,
          }}
        >
          <span>Portfolio Company Terms</span>
        </div>
      )}
      {show && (
        <>
          <List>
            {dealParams.portfolioTotalCarry && (
              <ListItem>
                <ListItemText
                  primary="Total Carry"
                  secondary={`${dealParams.portfolioTotalCarry}%`}
                />
              </ListItem>
            )}
            {dealParams.portfolioEstimatedSetupCosts && (
              <ListItem>
                <ListItemText
                  primary="Estimated Setup Costs"
                  secondary={`${dealParams.portfolioEstimatedSetupCosts}%`}
                />
              </ListItem>
            )}
            {dealParams.portfolioEstimatedSetupCostsDollar && (
              <ListItem>
                <ListItemText
                  primary="Estimated Setup Costs"
                  secondary={`$${dealParams.portfolioEstimatedSetupCostsDollar}`}
                />
              </ListItem>
            )}
            {dealParams.portfolioManagementFees && (
              <ListItem>
                <ListItemText
                  primary="Management Fee"
                  secondary={`${dealParams.portfolioManagementFees}% ${
                    dealParams.portfolioManagementFeeType === null
                      ? ''
                      : `(${dealParams.portfolioManagementFeeType})`
                  }`}
                />
              </ListItem>
            )}
            {dealParams.portfolioManagementFeesDollar && (
              <ListItem>
                <ListItemText
                  primary="Management Fee"
                  secondary={`$${dealParams.portfolioManagementFeesDollar} ${
                    dealParams.portfolioManagementFeeType === null
                      ? ''
                      : `(${dealParams.portfolioManagementFeeType})`
                  }`}
                />
              </ListItem>
            )}
          </List>
        </>
      )}

      {(dealParams.fundTotalCarry ||
        dealParams.fundEstimatedSetupCosts ||
        dealParams.fundEstimatedSetupCostsDollar ||
        dealParams.fundManagementFees ||
        dealParams.fundManagementFeesDollar ||
        dealParams.fundGeneralPartner ||
        dealParams.fundEstimatedTerm) && (
        <div
          style={{
            backgroundColor: colors.gray[50],
            height: 44,
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 8,
            textAlign: 'left',
            padding: '10px',
            borderTop: `1px solid ${colors.gray[200]}`,
            borderBottom: `1px solid ${colors.gray[200]}`,
          }}
        >
          <span>Fund Terms</span>
        </div>
      )}
      {show && (
        <>
          <List>
            {dealParams.fundGeneralPartner && (
              <ListItem>
                <ListItemText primary="General Partner" secondary={dealParams.fundGeneralPartner} />
              </ListItem>
            )}
            {dealParams.fundTotalCarry && (
              <ListItem>
                <ListItemText primary="Total Carry" secondary={`${dealParams.fundTotalCarry}%`} />
              </ListItem>
            )}
            {dealParams.fundEstimatedSetupCosts && (
              <ListItem>
                <ListItemText
                  primary="Estimated Setup Costs"
                  secondary={`${dealParams.fundEstimatedSetupCosts}%`}
                />
              </ListItem>
            )}
            {dealParams.fundEstimatedSetupCostsDollar && (
              <ListItem>
                <ListItemText
                  primary="Estimated Setup Costs"
                  secondary={`$${dealParams.fundEstimatedSetupCostsDollar}`}
                />
              </ListItem>
            )}
            {dealParams.fundManagementFees && (
              <ListItem>
                <ListItemText
                  primary="Management Fee"
                  secondary={`${dealParams.fundManagementFees}% (${dealParams.fundManagementFeeType})`}
                />
              </ListItem>
            )}
            {dealParams.fundManagementFeesDollar && (
              <ListItem>
                <ListItemText
                  primary="Management Fee"
                  secondary={`$${dealParams.fundManagementFeesDollar} (${dealParams.fundManagementFeeType})`}
                />
              </ListItem>
            )}
            {dealParams.fundEstimatedTerm && (
              <ListItem>
                <ListItemText
                  primary="Estimated Term"
                  secondary={`${dealParams.fundEstimatedTerm} years`}
                />
              </ListItem>
            )}
          </List>
        </>
      )}
    </>
  );
}

function InvestorData({ investor }) {
  if (!investor)
    return (
      <Paper>
        <Loader />
      </Paper>
    );

  return (
    <>
      <div
        style={{
          backgroundColor: colors.gray[50],
          height: 44,
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 16,
          textAlign: 'left',
          padding: '10px',
          borderTop: `1px solid ${colors.gray[200]}`,
          borderBottom: `1px solid ${colors.gray[200]}`,
        }}
      >
        <span>My Info</span>
        <Link to="/profile">edit</Link>
      </div>

      <List>
        <ListItem>
          <ListItemText primary="Investor Type" secondary={_.upperFirst(investor.investor_type)} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Country" secondary={investor.country} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Accreditation" secondary={investor.accredited_investor_status} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Subscriber Name" secondary={investor.name} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Signer Full Name" secondary={investor.signer_full_name} />
        </ListItem>
      </List>
    </>
  );
}

export default function Deal() {
  const mobile = useMediaQuery('(max-width:1200px)');
  const { organization, deal_slug } = useParams();
  const history = useHistory();
  const { search } = useLocation();
  const { userProfile, isAuthenticated, loading } = useAuth();
  const [getDeal, { data, error, refetch, called }] = useLazyQuery(GET_INVESTOR_DEAL);
  const [allowEdit, setAllowEdit] = useState(true);
  const [createInvestment, { called: didCreateInvestment }] = useMutation(CREATE_INVESTMENT, {
    onCompleted: () => {
      // alert('Mutation Succeeded!')
      refetch();
    },
  });

  useEffect(() => {
    if (!loading && !called && isAuthenticated) {
      getDeal({
        variables: {
          deal_slug,
          fund_slug: organization || 'allocations',
        },
      });
    }
  }, [isAuthenticated, loading, called, getDeal, deal_slug, organization]);

  useEffect(() => {
    const blocked = userProfile?.email?.includes('allocations');
    if (data && !data.user?.invitedDeal?.investment && !blocked) {
      let decodedParams = {};
      if (base64regex.test(search.substring(1)) && search && !search.includes('amount')) {
        decodedParams = base64.decode(search.substring(1));
      }
      const isTvc = organization === 'theventurecollective';
      const paramsToUse = isTvc ? decodedParams : search;
      const p = new URLSearchParams(paramsToUse);
      // eslint-disable-next-line radix
      const amount = parseInt(p.get('amount')) || 0;
      const investment = {
        deal_id: data.user.invitedDeal?._id,
        user_id: data.user._id,
        amount,
      };
      if (userProfile?.email && !didCreateInvestment) {
        createInvestment({ variables: { investment } });
      }
    }
  }, [called, createInvestment, data, didCreateInvestment, organization, search, userProfile]);
  useEffect(() => {
    const isEncoded = base64regex.test(search.substring(1)) && search.substring(1).length > 0;
    if (isEncoded) {
      setAllowEdit(false);
    }
  }, [organization, search]);

  useEffect(() => {
    // theres been an error
    if (error) {
      const q = queryString.parse(search);
      if (q && q.ref === 'public' && q.invite) {
        // need to redir back to public link (haven't been invited)
        return history.push(
          `/public/${organization || 'allocations'}/deals/${deal_slug}?invite_code=${
            q.invite
          }&no_redirect=true`,
        );
      }

      if (error.message === 'GraphQL error: REDIRECT') return history.push(`/`);
      if (userProfile.email) refetch();
    }
  }, [deal_slug, error, history, organization, refetch, search, userProfile]);
  if (!data) return <Loader />;

  const {
    user,
    user: { invitedDeal: deal },
  } = data;
  const { investment } = deal;
  return (
    <>
      <div style={{ width: mobile ? '100%' : 'calc(100% - 300px)' }}>
        <Grid container justify="space-between" alignItems="flex-end">
          <Grid item>
            <h2>{deal.company_name}</h2>
            <h4>{deal.company_description}</h4>
          </Grid>
          {investment?._id && (
            <Pledge investment={investment} refetch={refetch} allowEdit={allowEdit} />
          )}
        </Grid>
        <InvestmentFlow
          deal={{ ...deal, deal_slug, organization }}
          investment={investment}
          investor={user}
          refetch={refetch}
        />
      </div>

      <div
        style={{
          position: !mobile ? 'absolute' : 'relative',
          padding: '85px 16px',
          top: !mobile ? 0 : -32,
          bottom: 0,
          right: 0,
          width: !mobile ? 300 : '100%',
          borderLeft: !mobile ? `1px solid ${colors.gray[200]}` : 0,
        }}
      >
        <DealParams deal={deal} deal_slug={deal_slug} />
        <InvestorData investor={user} />
      </div>
    </>
  );
}
