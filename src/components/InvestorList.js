import React from "react";
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { Table } from 'reactstrap';

const GetAllInvestors=gql`
 {  
     GetInvestors{
        _id
        first_name
        last_name
        email
        residence
        accredited_type
        accredidted_status
        entity_name
        investor_type
        passport
        deal_complete_data
        total_invested
        deals_invited
        kyc_status
        aml_status
        score
    }
 }
`;

const Investor=(props)=>{
 const  investor= props.item;

 return(
     <tr>
        <td className="text-muted">
          {investor._id} 
        </td>
        <td >{investor.first_name}</td>
        <td> {investor.last_name}</td>
        <td> {investor.email}</td>
        <td> {investor.accredited_type}</td>
        <td> {investor.accredidted_status}</td>
        <td> {investor.entity_name}</td>
        <td> {investor.investor_type}</td>
        <td> {investor.passport}</td>
        <td> {investor.deal_complete_data}</td>
        <td> {investor.total_invested}</td>
       
      </tr>
 )
}

const InvestorList = () =>{

  const { loading, error, data } = useQuery(GetAllInvestors);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

    return (
        <div>
             <Table striped>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Accredited Type </th>
                        <th>Accredidted Status</th>
                        <th>Entity Name</th>
                        <th>Investor Type</th>
                        <th>Passport</th>
                        <th>Deal Complete Date</th>
                        <th>Total Invested</th>
                      
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.GetInvestors.map(d=>(
                                <Investor key={d._id} item={d} />
                            ))
                        }
                    </tbody>
               </Table>
        </div>
    )
}

export default InvestorList;