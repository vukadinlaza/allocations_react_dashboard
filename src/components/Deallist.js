import React,{useState} from 'react';
import { useQuery } from '@apollo/react-hooks';

import { Table } from 'reactstrap';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import AddDeal from "./AddDeal"
import DeleteDeal from './DeleteDeal';
import { GetDeals } from '../api/query';
import   AssignmentTurnedIn   from '@material-ui/icons/AssignmentTurnedIn';


const DealRow=(props)=>{
const  deal= props.item;
 return(
     <tr>
        <td >{deal.entity_name}</td>
        <td> {deal.deal_name}</td>
        <td> {deal.amount_wired}</td>
        <td> {deal.deal_complete_date}</td>
        <td><a target="_blank" rel='noreferrer noopener'  href={deal.operations_agreement}><AssignmentTurnedIn /></a>  </td>
        <td><a target="_blank" rel='noreferrer noopener'  href={deal.subscription_agreement}><AssignmentTurnedIn /></a></td>
        <td><a target="_blank" rel='noreferrer noopener'  href={deal.private_placement_memorandum}> <AssignmentTurnedIn />  </a></td>
       
        <td><a target="_blank" rel='noreferrer noopener'  href={deal.bank_account}> <AssignmentTurnedIn />  </a></td>
        <td><a target="_blank" rel='noreferrer noopener'  href={deal.formation_certificate_filing}> <AssignmentTurnedIn />  </a></td>
        <td><a target="_blank" rel='noreferrer noopener'  href={deal.ein_filing}> <AssignmentTurnedIn />  </a></td>
        <td><a target="_blank" rel='noreferrer noopener'  href={deal.form_d_filing}> <AssignmentTurnedIn />  </a></td>
        <td><a target="_blank" rel='noreferrer noopener'  href={deal.form_1065_filing}> <AssignmentTurnedIn />  </a></td>
        <td><a target="_blank" rel='noreferrer noopener'  href={deal.w9_filing}> <AssignmentTurnedIn />  </a></td>
       
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
                <ModalHeader toggle={toggle}>Create fund</ModalHeader>
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

          
            <CreateDealModal buttonLabel="Create new fund"  className="add"  />
             <br />
             <Table striped>
                    <thead>
                        <tr>
                        <th>Fund Name</th>
                        <th>Deal Name</th>
                        <th>Raise Amount</th>
                        <th>Deal Complete Date</th>
                        <th>Operating Agreement</th>
                        <th>Subscription Agreement </th>
                        <th>Private Placement Memorandum </th>
                        <th>Bank account</th>
                        <th>Formation certificate filing</th>
                        <th>EIN filing</th>
                        <th>Form D filing</th>
                        <th>Form 1065 filing</th>
                        <th>W9 filing</th>
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