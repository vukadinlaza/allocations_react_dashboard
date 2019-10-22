
import React from "react"
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

const query= gql`
{  
    query GetDealById ($id:String!)
    {
        GetDealById(id:$id){
            _id
            deal_name
            deal_name
            amount_wired
        }
    }
}`;


const Deal=(props)=>{
    
    const  id= props.item;

    const { loading, error, data } = useQuery(query,{
        variables: {id}
    });
    

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

        return(
            <div>
                {
                    data.GetDealById.deal_name
                }
            </div>
        )


}
