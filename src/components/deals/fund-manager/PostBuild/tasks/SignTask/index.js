/* eslint-disable no-undef */
import React, { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import Loader from '../../../../../utils/Loader';

const SERVICE_AGREEMENT_LINK = gql`
  query serviceAgreementLink($deal_id: String) {
    dataRequest: getServiceAgreementLink(deal_id: $deal_id) {
      dataRequestId: id
      tokenId: token_id
      tokenSecret: token_secret
    }
  }
`;

const INVESTMENT_AGREEMENT_LINK = gql`
  query investmentAgreementLink($deal_id: String) {
    dataRequest: getInvestmentAgreementLink(deal_id: $deal_id) {
      dataRequestId: id
      tokenId: token_id
      tokenSecret: token_secret
    }
  }
`;

const queryMap = {
  'service-agreement': SERVICE_AGREEMENT_LINK,
  'investment-agreement': INVESTMENT_AGREEMENT_LINK,
};

export const usePrefetchSigningLinks = (deal_id) => {
  useQuery(SERVICE_AGREEMENT_LINK, {
    variables: { deal_id },
  });

  useQuery(INVESTMENT_AGREEMENT_LINK, {
    variables: { deal_id },
  });
};

export default function SignTask({ deal, task }) {
  const QUERY = queryMap[task.metadata.key];

  const { data, loading } = useQuery(QUERY, {
    variables: { deal_id: deal._id },
  });

  useEffect(() => {
    if (data) {
      DocSpring.createVisualForm({
        dataRequestId: data.dataRequest.dataRequestId,
        tokenId: data.dataRequest.tokenId,
        tokenSecret: data.dataRequest.tokenSecret,
        domainVerification: false,
        onSubmit: () => DocSpring.closeModal(),
      });
    }
  }, [loading]);

  if (loading) return <Loader />;

  return null;
}
