import React from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import RemoteBanking from './RemoteBanking';
import Banking from './Banking';

interface Props {
  dealData: { [key: string]: any };
  deal_id: string;
  virtual_account_number: string | null;
}

const BankingTab = ({ dealData, deal_id, virtual_account_number }: Props) => {
  const { treasuryBankingTab } = useFlags();

  return (
    <>
      {treasuryBankingTab ? (
        <RemoteBanking dealData={dealData} />
      ) : (
        <Banking deal_id={deal_id} virtual_account_number={virtual_account_number} />
      )}
    </>
  );
};

export default BankingTab;
