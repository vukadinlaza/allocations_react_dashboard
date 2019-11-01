
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Button } from 'reactstrap';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import React from "react"
import { deleteInvestorById } from '../api/query';



const DeleteInvestor=(props)=>{
    const id=props.id;
 const [DELETE_INVESTOR_BY_ID, { data }, error, loading] = useMutation(deleteInvestorById);

 if (loading) return <p>Loading...</p>;
 if (error) return <p>Error :(</p>;

const handleDeleteButtonClick=()=>{
    console.log("deleted");
    console.log(id);
    DELETE_INVESTOR_BY_ID({ variables: { id: id } });
}

 return(
     <div>
          <Button onClick={handleDeleteButtonClick}> <DeleteForeverIcon /></Button>
     </div>
    
 )
}
export default DeleteInvestor;