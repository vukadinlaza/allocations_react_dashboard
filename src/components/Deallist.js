import React,{useState} from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Table } from 'reactstrap';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from "react-router-dom";
import AddDeal from "./AddDeal"
import DeleteDeal from './DeleteDeal';
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


const DealRow=(props)=>{
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
        <th><DeleteDeal id={deal._id} /></th>
      </tr>
 )

}

const CreateDealModal=(props)=>{

    const { buttonLabel, className } = props;
    const [modal, setModal] = useState(false);
  
    const toggle = () => setModal(!modal);
    return(
        <div>
           <Button color="success" onClick={toggle}>{buttonLabel}</Button>
            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader toggle={toggle}>Create Deal</ModalHeader>
                <ModalBody>
                   <AddDeal />
                </ModalBody>
                <ModalFooter>
                
                <Button color="success" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

const DealList=(props)=>  {
  const { loading, error, data } = useQuery(GetAllDeals);




  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

    return (
        <div>

          
            <CreateDealModal buttonLabel="Create new fund"  className="add"  />
             <br />
             <Table striped>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Entity Name</th>
                        <th>Deal Name</th>
                        <th>Amount Wired</th>
                        <th>Deal Complete Date</th>
                        <th>#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.GetDeals.map(d=>(
                                <DealRow key={d._id} item={d} />
                            ))
                        }
                    </tbody>
               </Table>
        </div>
    )
}

export default DealList;