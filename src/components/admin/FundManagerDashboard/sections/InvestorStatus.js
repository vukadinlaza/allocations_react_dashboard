import React from 'react';
import MailIcon from '@material-ui/icons/Mail';
import { SimpleBox } from '../widgets'


const InvestorStatus = ({ classes, buttonAction }) => {

  return (
    <div className={classes.section}>
      <SimpleBox
        title="VIEWED"
        titleData={<p style={{fontSize: "14px", color: "#39C522", fontWeight: "bold"}}>$0</p>}
        autoHeight={true}
        fontSize="small"
        size="third"
        buttonText={<div><MailIcon style={{color: "white", marginRight: "0.5em"}}/>Send Reminder</div>}
        buttonAction={buttonAction}
        >

      </SimpleBox>
      <SimpleBox
        title="SIGNED"
        titleData={<p style={{fontSize: "14px", color: "#39C522", fontWeight: "bold"}}>$400,000</p>}
        autoHeight={true}
        fontSize="small"
        size="third"
        buttonText={<div><MailIcon style={{color: "white", marginRight: "0.5em"}}/>Send Reminder</div>}
        buttonAction={buttonAction}
        >
      </SimpleBox>
      <SimpleBox
        title="WIRED"
        titleData={<p style={{fontSize: "14px", color: "#39C522", fontWeight: "bold"}}>$0</p>}
        autoHeight={true}
        fontSize="small"
        size="third"
        >
      </SimpleBox>
    </div>
  );
}

export default InvestorStatus;
