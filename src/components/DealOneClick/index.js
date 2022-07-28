import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useParams } from 'react-router';
import moment from 'moment';
import { getMomentFromId } from '@allocations/nextjs-common';
import DealLandingPage from './LandingPage';
import RemoteDealPage from '../RemoteDealPage';

const GET_DEAL = gql`
  query GetDeal($fund_slug: String, $deal_slug: String) {
    deal(fund_slug: $fund_slug, deal_slug: $deal_slug) {
      _id
    }
  }
`;

export default function DealOneClick() {
  const { newDealPage } = useFlags();
  const { deal_slug, organization: fund_slug } = useParams();
  const { data } = useQuery(GET_DEAL, { variables: { deal_slug, fund_slug } });

  if (!data) return null;

  const { deal: { _id: deal_id } = {} } = data;
  const isDealWhiteListed = newDealPage?.whiteListedDeals?.includes(deal_id);
  const isDealBlackListed = newDealPage?.blackListedDeals?.includes(deal_id);

  const minimumDate = moment(newDealPage?.minDealCreationDate, 'MMMM DD, YYYY');
  const dealCreationDate = getMomentFromId(deal_id);

  const isDealCreatedAfterMinDate = dealCreationDate.diff(minimumDate, 'minutes') >= 0;

  return !isDealBlackListed && (isDealWhiteListed || isDealCreatedAfterMinDate) ? (
    <RemoteDealPage />
  ) : (
    <DealLandingPage />
  );
}
