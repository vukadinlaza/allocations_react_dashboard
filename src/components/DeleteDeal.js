
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Button } from 'reactstrap';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import React from "react"
const MUTATION_QUERY=gql`
mutation deleteDealById($id: ID!){
  deleteDealById(id:$id)
}
`;
const DeleteDeal=(props)=>{
    const id=props.id;
 const [deleteDealById, { data }, error, loading] = useMutation(MUTATION_QUERY);

 if (loading) return <p>Loading...</p>;
 if (error) return <p>Error :(</p>;

const handleDeleteButtonClick=()=>{
    console.log("deleted");
    console.log(id);
    deleteDealById({ variables: { id: id } });
}

 return(
     <div>
          <Button onClick={handleDeleteButtonClick}> <DeleteForeverIcon /></Button>
     </div>
    
 )
}
export default DeleteDeal;