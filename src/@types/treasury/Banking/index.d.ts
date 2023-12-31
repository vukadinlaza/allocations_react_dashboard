import React from 'react';

interface AllocationsUser {
  admin?: boolean;
  first_name?: string;
  last_name?: string;
  organizations_admin?: any[];
}

interface BankingProps {
  deal_id?: string;
  virtual_account_number?: string | null;
  org_slug?: string;
  deal_name?: string;
  high_volume_partner?: boolean;
  org_id: string;
}

const Banking: React.FC<{
  user: AllocationsUser;
  bankProps: BankingProps;
}> = () => JSX.Element;

export default Banking;
