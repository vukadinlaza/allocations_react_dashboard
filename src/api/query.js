import gql from 'graphql-tag';

export const GetDeals = gql`
 query GetDeals{   
    GetDeals{
    _id
    entity_name
    deal_name
    amount_wired
    deal_complete_date
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
  deleteDealById(id:$id)
}
`;