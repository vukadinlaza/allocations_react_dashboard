import { useMutation } from '@apollo/react-hooks';
import React, {useState} from "react";
import { Button, Form, FormGroup, Input } from 'reactstrap';
import { GetDeals } from '../api/query';
import { addDeal } from '../api/query';



const AddDeal=(props)=>{
    let deal;
    let [Add_DEAL, { data, loading: mutationLoading, error: mutationError}] = useMutation(addDeal,
      {
        refetchQueries:[{query:GetDeals}]
        // update(cache,{data:{Add_DEAL}}){
        //   const  deals = cache.readQuery({query: GetDeals});
        //   console.log(deals);
        //   if(deals){
        //     cache.writeQuery({
        //       query: GetDeals,
        //       data:{ deals: deals.GetDeals.concat([Add_DEAL])}
        //     })
        //   }
        // }
      }
      );
    const [entity_name, setEntityName]=useState("");
    const [deal_name,setDealName]= useState("");
    const [amount_wired, setAmountWired]=useState("");
    const [deal_complete_date, setDealCompleteDate]=useState("");

  
      
    function handleClick(e) {
        e.preventDefault();
        console.log(entity_name);
        deal={
            entity_name: entity_name,
            deal_name: deal_name,
            amount_wired: parseInt(amount_wired),
            deal_complete_date: deal_complete_date
        }

          Add_DEAL({ variables: { input: deal } });
        
          setEntityName("")
          setDealName("")
          setAmountWired("")
          setDealCompleteDate("")
        
    }

  
  

   return (
    
      <div>
      <Form  onSubmit={handleClick} >
        <FormGroup>
                <Input name="entity_name" value={entity_name} onChange={e=>{setEntityName(e.target.value)}} placeholder="Enter entity name" required />
        </FormGroup>
        <FormGroup>
            <Input name="deal_name" value={deal_name} onChange={e=>{setDealName(e.target.value)}} placeholder="Enter fund name" required/>
        </FormGroup>
       
        <FormGroup>
            <Input type="number" name="amount_wired" value={amount_wired} onChange={e=>{setAmountWired(e.target.value)}} placeholder="Enter raise amount" required/>
        </FormGroup>
        <FormGroup>
            <Input name="deal_complete_date" value={deal_complete_date} onChange={e=>{setDealCompleteDate(e.target.value)}} placeholder="Enter closing date"/>
        </FormGroup>
        <Button >Create Fund</Button>
      </Form>
      <div>
        {mutationLoading && <p>Loading...</p>}
        {mutationError && <p>Error :( Please try again</p>}
      
      </div>
    </div>
   
  );
}

export default AddDeal;