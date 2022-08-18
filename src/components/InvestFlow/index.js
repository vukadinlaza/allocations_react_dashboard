import { useFlags } from 'launchdarkly-react-client-sdk';
import React, { Suspense } from 'react';
import { useParams } from 'react-router';
import { shouldShowDealBasedFlag } from '../../utils/helpers';
import InvestmentPage from '../DealOneClick/InvestmentPage';
import Loader from '../utils/Loader';

const Invest = React.lazy(() => import('invest/Invest'));

export default function InvestFlow() {
  const { deal_id, investment_id } = useParams();
  const { newInvestFlow } = useFlags();

  const showNewInvestFlow = shouldShowDealBasedFlag(newInvestFlow, deal_id);

  if (showNewInvestFlow) {
    return (
      <Suspense fallback={<Loader />}>
        <Invest deal_id={deal_id} investment_id={investment_id} />
      </Suspense>
    );
  }

  return <InvestmentPage deal_id={deal_id} />;
}
