import { gql } from 'apollo-boost';

export const create = gql`
  mutation CreateInvestment($investment: InvestmentInput!) {
    createInvestment(investment: $investment) {
      _id
    }
  }
`;

export const destroy = gql`
  mutation DeleteInvestment($id: String!) {
    deleteInvestment(_id: $id)
  }
`;
