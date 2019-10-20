import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Table } from 'reactstrap';

const GetAllDeals = gql`
 {  GetDeals {
    _id
    entity_name
    deal_name
    amount_wired
    deal_complete_date
  }
 }
`;


const Deal=(props)=>{
 const  deal= props.item;

 return(
     <tr>
        <td className="text-muted">
          {deal._id} 
        </td>
        <td >{deal.entity_name}</td>
        <td> {deal.deal_name}</td>
        <td> {deal.amount_wired}</td>
         <td> {deal.deal_complete_date}</td>
      </tr>
 )

}

const DealList=()=>  {
  const { loading, error, data } = useQuery(GetAllDeals);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

    return (
        <div>
             <Table dark>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Entity Name</th>
                        <th>Deal Name</th>
                        <th>Amount Wired</th>
                        <th>Deal Complete Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.GetDeals.map(d=>(
                                <Deal key={d._id} item={d} />
                            ))
                        }
                    </tbody>
               </Table>
        </div>
    )
}

export default DealList;