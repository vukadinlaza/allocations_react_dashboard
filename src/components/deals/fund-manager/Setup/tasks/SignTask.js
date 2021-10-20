import { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';

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
      // eslint-disable-next-line no-undef
      DocSpring.createVisualForm({
        dataRequestId: data.dataRequestId,
        tokenId: data.tokenId,
        tokenSecret: data.tokenSecret,
        domainVerification: false,
      });
    }
  }, [loading]);

  return null;
}
