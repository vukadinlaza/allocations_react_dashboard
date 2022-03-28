import React from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import RemoteBanking from './RemoteBanking';
import Banking from './Banking';

interface Props {
  organizationData: { [key: string]: any };
  dealData: { [key: string]: any };
  deal_id: string;
  virtual_account_number: string | null;
}

const BankingTab = ({ organizationData, dealData, deal_id, virtual_account_number }: Props) => {
  const { treasuryBankingTab } = useFlags();

  return (
    <>
      {treasuryBankingTab ? (
        <RemoteBanking
          organizationData={organizationData}
          dealData={dealData}
          virtual_account_number={virtual_account_number}
        />
      ) : (
        <Banking deal_id={deal_id} virtual_account_number={virtual_account_number} />
      )}
    </>
  );
};

export default BankingTab;
