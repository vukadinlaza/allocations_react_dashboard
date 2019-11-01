import React,{useState} from 'react';
import { useQuery } from '@apollo/react-hooks';

import { Table } from 'reactstrap';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import AddDeal from "./AddDeal"
import DeleteDeal from './DeleteDeal';
import { GetDeals } from '../api/query';





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
           <Button color="danger" onClick={toggle}>{buttonLabel}</Button>
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
  const { loading, error, data } = useQuery(GetDeals);




  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

    return (
        <div>

          
            <CreateDealModal buttonLabel="Add Deal"  className="add"  />
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