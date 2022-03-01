export interface Task {
  _id: string;
  title: string;
  description: string;
  type: string;
  complete: boolean;
  done_by: string;
}

export interface DealPhase {
  _id: string;
  name: string;
  deal_id: string;
  tasks: Task[];
}

export interface Investment {
  _id: string;
  amount: number;
  status: string;
}

export interface Deal {
  _id: string;
  organization_id: string;
  user_id: string;
  slug: string;
  name: string;
  accept_crypto: boolean;
  allocations_reporting_adviser: boolean;
  angels_deal: boolean;
  asset_type: string;
  carry_fee: {
    type: string;
    value: string;
    string_value: string;
    custom: string;
  };
  closing_date: Date;
  custom_investment_agreement: boolean;
  deal_stage: string;
  deal_multiple: number;
  deal_term: string;
  description: string;
  docspring_template_id: string;
  gp_entity: {
    gp_entity_name: string;
    need_gp_entity: string;
  };
  hubspot_deal_id: number;
  ica_exemption: {
    exemption_type: string;
    investor_type: string;
  };
  industry: string;
  international_company: {
    status: string;
    country: string;
  };
  investor_countries: [string];
  management_fee: {
    type: string;
    value: string;
    string_value: string;
    custom: string;
  };
  management_fee_frequency: string;
  manager: {
    type: string;
    name: string;
    email: string;
    title: string;
    entity_name: string;
  };
  memo: string;
  minimum_investment: number;
  nd_virtual_account_number: string;
  number_of_investments: number;
  offering_type: string;
  phase: string;
  portfolio_company_name: string;
  portfolio_company_securities: string;
  public_pitch_deck: boolean;
  representative: string;
  reporting_adviser: string;
  sectors: [string];
  series_name?: string;
  master_series: string;
  setup_cost: number;
  side_letters: boolean;
  sign_deadline: Date;
  target_raise_goal: number;
  type: 'spv' | 'fund';
  type_of_investors: string;
  wire_deadline: Date;
  createdAt: Date;
  updatedAt: Date;
  size: number;
  investmentType: string;
  dealParams: {
    dealMultiple: string;
  };
  AUM: number;
  investments: Investment[];
  company_name: string;
  status: string;
}

export interface Header {
  value?: string;
  label: string;
  type?: string;
  keyNotInData?: boolean;
  align?: string;
  alignHeader?: boolean;
  isSortable?: boolean;
  customSort?: boolean;
  id?: string;
  isButton?: boolean;
  withSort?: boolean;
}

export interface GeneralObject {
  [field: string]: any;
}
