import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import React, {useState} from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

const createDealMutation = gql`
  mutation createDeal($input: IDealInputType!) {
    addDeal(input:$input){
        _id
        entity_name
        amount_wired
        total_investors
    }
}
`;


const AddDeal=(props)=>{
   let deal;
    let [createDeal, { data }, error, loading] = useMutation(createDealMutation);
    const [entity_name, setEntityName]=useState("");
    const [deal_name,setDealName]= useState("");
    const [amount_wired, setAmountWired]=useState("");
    const [deal_complete_date, setDealCompleteDate]=useState("");

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
      
    function handleClick(e) {
        e.preventDefault();
        console.log(entity_name);
        deal={
            entity_name: entity_name,
            deal_name: deal_name,
            amount_wired: parseInt(amount_wired),
            deal_complete_date: deal_complete_date
        }

        createDeal({ variables: { input: deal } });
        
        if(error){
          console.log(data);
          
        }else{
          setEntityName("")
          setDealName("")
          setAmountWired("")
          setDealCompleteDate("")
        }
    }

  
  

   return (
    
      <div>
      <Form  onSubmit={handleClick} >
        <FormGroup>
                <Input name="entity_name" value={entity_name} onChange={e=>{setEntityName(e.target.value)}} placeholder="Enter entity name" required />
        </FormGroup>
        <FormGroup>
            <Input name="deal_name" value={deal_name} onChange={e=>{setDealName(e.target.value)}} placeholder="Enter deal name" required/>
        </FormGroup>
       
        <FormGroup>
            <Input type="number" name="amount_wired" value={amount_wired} onChange={e=>{setAmountWired(e.target.value)}} placeholder="Enter amount wired" required/>
        </FormGroup>
        <FormGroup>
            <Input name="deal_complete_date" value={deal_complete_date} onChange={e=>{setDealCompleteDate(e.target.value)}} placeholder="Enter deal complete date"/>
        </FormGroup>
        <Button >Create Deal</Button>
      </Form>
      <div>
        {
          error && (
            <p> Something went wrong </p>
          )
          
        }
      
      </div>
    </div>
   
  );
}

export default AddDeal;