
import { useMutation } from '@apollo/react-hooks';
import { Button } from 'reactstrap';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import React from "react"
import { GetDeals, deleteDealById } from '../api/query';

const DeleteDeal=(props)=>{
    const id=props.id;
 const [DELETE_BY_ID,{data,loading,error}] = useMutation(deleteDealById,
    {
        refetchQueries:[{query:GetDeals}]
    //  update(cache,{data:{ DELETE_BY_ID } }){
    //      const deals =cache.readQuery(GetDeals);
    //      console.log("data"+data);
    //      console.log("deals"+deals);
    //      if (deals){
    //         cache.writeQuery({
    //             query: GetDeals,
    //             data: {deals: deals.filter(e => e.id !== id)}
    //          })
    //      }
       
         
    //  }
     
 });

 if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

const handleDeleteButtonClick=()=>{
    console.log("deleted");
    console.log(id);
    DELETE_BY_ID({ variables: { id: id } });
}

 return(
     <div>
          <Button onClick={handleDeleteButtonClick}> <DeleteForeverIcon /></Button>
     </div>
    
 )
}
export default DeleteDeal;