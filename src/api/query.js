import gql from 'graphql-tag';

export const GetDeals = gql`
 query GetDeals{   
    GetDeals{
    _id
    entity_name
    deal_name
    amount_wired
    deal_complete_date
    operations_agreement
    subscription_agreement
    private_placement_memorandum
    createdAt
    updatedAt
   }
 }
`;


export const addDeal = gql`
  mutation addDeal($input: IDealInputType!) {
    addDeal(input:$input){
        _id
        entity_name
        amount_wired
        total_investors
    }
}
`;

export const deleteDealById=gql`
mutation deleteDealById($id: ID!){
  deleteDealById(id:$id){
    _id
  }
}
`;

export const deleteInvestorById=gql`
mutation deleteInvestorById($id:ID!){
  deleteInvestorById(id:$id){
    _id
  }
}
`;