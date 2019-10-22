import React from 'react';

import DealList from '../components/Deallist';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';



const Deal = () => {
    return(
        <div>
               {/* <Link to="/addDeal" > <Button>Create Deal</Button> </Link> */}
               <DealList />
        </div>
    )
};



export default Deal;