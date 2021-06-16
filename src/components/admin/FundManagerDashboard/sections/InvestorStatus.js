import React from 'react';
import MailIcon from '@material-ui/icons/Mail';
import { Avatar, Typography } from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { SimpleBox } from '../widgets';
import { nWithCommas } from '../../../../utils/numbers'

const investors = [
  {first_name: 'Kingsley', last_name: 'Advani', amount: 0, status: 'viewed'},
  {first_name: 'Danny', last_name: 'Suarez', amount: 0, status: 'viewed'},
  {first_name: 'Lance', last_name: 'Merrill', amount: 0, status: 'viewed'},
  {first_name: 'Brandon', last_name: 'Stuchkus', amount: 200000, status: 'wired'},
  {first_name: 'Eli', last_name: 'Nicholson', amount: 200000, status: 'signed'},
  {first_name: 'Danny', last_name: 'Hogan', amount: 300000, status: 'signed'},
  {first_name: 'Adrian', last_name: 'Monasterios', amount: 200000, status: 'wired'},
]


const InvestorBox = ({classes, investor, index}) => {
  return(
    <div className={classes.investorBox} key={`investor-${index}`}>
      <div className={classes.investorBoxName}>
        <Avatar className={classes.avatar}>{investor.first_name.charAt(0)}</Avatar>
        <Typography style={{fontSize: "14px"}}>{investor.first_name} {investor.last_name}</Typography>
        <div className={classes.investorCheck}>
          <Typography style={{color: "white", fontSize: "8px"}}><VerifiedUserIcon/> 506c</Typography>
        </div>
      </div>
      <Typography>${nWithCommas(investor.amount)}</Typography>
    </div>
  )
}


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
        {investors.filter(investor => investor.status === 'viewed').map((investor, index) =>
          <InvestorBox investor={investor} classes={classes} index={index} key={`investor-${index}`} />
        )}
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
        {investors.filter(investor => investor.status === 'signed').map((investor, index) =>
          <InvestorBox investor={investor} classes={classes} index={index} />
        )}
      </SimpleBox>
      <SimpleBox
        title="WIRED"
        titleData={<p style={{fontSize: "14px", color: "#39C522", fontWeight: "bold"}}>$0</p>}
        autoHeight={true}
        fontSize="small"
        size="third"
        >
        {investors.filter(investor => investor.status === 'wired').map((investor, index) =>
          <InvestorBox investor={investor} classes={classes} index={index} />
        )}
      </SimpleBox>
    </div>
  );
}

export default InvestorStatus;
