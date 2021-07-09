import React, { useEffect } from 'react';
import _ from 'lodash';
import { useParams, useLocation } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useLazyQuery } from '@apollo/react-hooks';
import MailIcon from '@material-ui/icons/Mail';
import { Avatar, Typography, Grid } from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { ScrollableBox } from '../widgets';
import { nWithCommas } from '../../../../utils/numbers'
import Loader from '../../../utils/Loader'
import { phone } from '../../../../utils/helpers'


const demoNames = [
  'Pablo Picasso',
  'Vincent van Gogh',
  'Leonardo da Vinci',
  'Claude Monet',
  'Salvador Dali',
  'Henri Matisse',
  'Rembrandt',
  'Andy Warhol',
  "Georgia O'Keeffe",
  'Michelangelo',
  'Peter Paul Rubens',
  'Edgar Degas',
  'Caravaggio',
  'Pierre-Auguste Renoir',
  'Raphael',
  'Paul Cezanne',
  'Marc Chagall',
  'Titian',
  'Joan Miro',
  'Jackson Pollock',
  'Gustav Klimt',
  'Albrecht Durer',
  'Edward Hopper',
  'Wassily Kandinsky',
  'Jan Vermeer',
  'Paul Klee',
  'Edvard Munch',
  'Goya',
  'Janet Fish',
  'Edouard Manet',
];


const demoAmounts = [5000, 8000, 10000, 12000, 15000, 17000, 13000, 18000, 20000, 50000]

const demoBool = [true, false]


const InvestorBox = ({classes, investor, index, width}) => {
  return(
    width > phone?
      <div className={classes.investorBox} key={`investor-${index}`}>
        <div className={classes.investorBoxName}>
          <Avatar className={classes.avatar}>{investor.name.charAt(0).toUpperCase()}</Avatar>
          <Typography className={classes.investorName}>{investor.name}</Typography>
          <div className={classes.accredited} style={investor.accredidation_status? {} : {background: "#bbc5ba"}}>
            <Typography style={{color: "white", fontSize: "12px"}}><VerifiedUserIcon/> 506c</Typography>
          </div>
        </div>
        <Typography style={{width: "80px", textAlign: "right"}}>${nWithCommas(investor.amount)}</Typography>
      </div>
      :
      <div className={classes.investorBox} key={`investor-${index}`}>
        <Avatar className={classes.avatar}>{investor.name.charAt(0).toUpperCase()}</Avatar>
        <div className={classes.investorBoxAmount}>
          <Typography className={classes.investorName}>{investor.name}</Typography>
          <div className={classes.accredited} style={investor.accredidation_status? {} : {background: "#bbc5ba"}}>
            <Typography style={{color: "white", fontSize: "12px"}}><VerifiedUserIcon/> 506c</Typography>
          </div>
          <Typography style={{textAlign: "right"}}>${nWithCommas(investor.amount)}</Typography>
        </div>
      </div>

  )
}


const InvestorStatus = ({ classes, width, data }) => {

  if(!data?.deal?.investments){
    return (
      <div className={classes.loaderContainer}>
        <Loader/>
      </div>
    )
  }


  const { investments } = data.deal;
  const investors = investments.map(inv => {
    const firstName = _.get(inv, 'investor.first_name', '');
    const n = _.get(inv, 'investor.name', '');
    let name = inv?.submissionData?.legalName ? inv?.submissionData?.legalName : (n? n : firstName);
    return {
      name,
      amount: inv.amount,
      status: inv.status,
      accredidation_status:inv.investor.accredidation_status
    }
  })

  const getColumnData = (status) => {
    const columnInvestors = investors.filter(inv => inv.status === status);
    let total = 0;
    if(columnInvestors.length){
      total = columnInvestors.map(inv => inv.amount).reduce((acc, n) => acc + n);
    }
    return { investors: columnInvestors, total}
  }

  let { investors: viewedInvestors, total: viewedTotal } = getColumnData('invited');
  let { investors: signedInvestors, total: signedTotal } = getColumnData('signed');
  let { investors: wiredInvestors, total: wiredTotal } = getColumnData('wired');

  const demoViewedArray = Array(15).fill('').map(i => {return {accredidation_status: _.sample(demoBool), amount: _.sample(demoAmounts), name: _.sample(demoNames), status: "invited"}})
  const demoSignedArray = Array(15).fill('').map(i => {return {accredidation_status: _.sample(demoBool), amount: _.sample(demoAmounts), name: _.sample(demoNames), status: "signed"}})
  const demoWiredArray = Array(25).fill('').map(i => {return {accredidation_status: _.sample(demoBool), amount: _.sample(demoAmounts), name: _.sample(demoNames), status: "wired"}})
  viewedTotal += demoViewedArray.map(i => i.amount).reduce((acc, n) => acc + n)
  signedTotal += demoSignedArray.map(i => i.amount).reduce((acc, n) => acc + n)
  wiredTotal += demoWiredArray.map(i => i.amount).reduce((acc, n) => acc + n)
  const isDemo = window?.origin?.includes('vercel') || window?.origin?.includes('localhost');

  return (
    <Grid container spacing={3} className={classes.section}>
      <Grid item xs={12} lg={4}>
        <ScrollableBox
          title="VIEWED"
          titleData={<p className={classes.titleDataText}>${nWithCommas(viewedTotal)}</p>}
          autoHeight={true}
          fontSize="small"
          size="third"
          buttonText={true? '' : <div><MailIcon style={{color: "white", marginRight: "0.5em"}}/>Send Reminder</div>}
          >
          {isDemo?
            demoViewedArray.map((investor, index) =>
              <InvestorBox investor={investor} classes={classes} index={index} key={`demo-investor-${index}`} width={width}/>
            )
              :
            viewedInvestors.map((investor, index) =>
              <InvestorBox investor={investor} classes={classes} index={index} key={`investor-${index}`} width={width}/>
            )
          }
        </ScrollableBox>
      </Grid>
      <Grid item xs={12} lg={4}>
        <ScrollableBox
          title="SIGNED"
          titleData={<p className={classes.titleDataText}>${nWithCommas(signedTotal)}</p>}
          autoHeight={true}
          fontSize="small"
          size="third"
          buttonText={true? '' : <div><MailIcon style={{color: "white", marginRight: "0.5em"}}/>Send Reminder</div>}
          >
          {isDemo?
            demoSignedArray.map((investor, index) =>
              <InvestorBox investor={investor} classes={classes} index={index} key={`demo-investor-${index}`} width={width}/>
            )
              :
            signedInvestors.filter(investor => investor.status === 'signed').map((investor, index) =>
              <InvestorBox investor={investor} classes={classes} index={index} key={`investor-${index}`} width={width}/>
            )
          }
        </ScrollableBox>

      </Grid>
      <Grid item xs={12} lg={4}>
        <ScrollableBox
          title="WIRED"
          titleData={<p className={classes.titleDataText}>${nWithCommas(wiredTotal)}</p>}
          autoHeight={true}
          fontSize="small"
          size="third"
          >
          {isDemo?
            demoWiredArray.map((investor, index) =>
                <InvestorBox investor={investor} classes={classes} index={index} key={`demo-investor-${index}`} width={width}/>
            )
              :
            wiredInvestors.filter(investor => investor.status === 'wired').map((investor, index) =>
              <InvestorBox investor={investor} classes={classes} index={index} key={`investor-${index}`} width={width}/>
            )
          }
        </ScrollableBox>
      </Grid>
    </Grid>
  );
}

export default InvestorStatus;
