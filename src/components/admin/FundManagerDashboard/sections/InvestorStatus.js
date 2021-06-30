import React, { useEffect } from 'react';
import _ from 'lodash';
import { useParams, useLocation } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useLazyQuery } from '@apollo/react-hooks';
import MailIcon from '@material-ui/icons/Mail';
import { Avatar, Typography } from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { ScrollableBox } from '../widgets';
import { nWithCommas } from '../../../../utils/numbers'
import Loader from '../../../utils/Loader'
import { phone } from '../../../../utils/helpers'


const GET_INVESTMENTS = gql`
  query GetDeal($fund_slug: String!, $deal_slug: String!) {
    deal(fund_slug: $fund_slug, deal_slug: $deal_slug) {
      _id
      investments {
        _id
        amount
        status
        submissionData {
          legalName
        }
        investor {
          _id
          first_name
          last_name
          name
          accredidation_status
        }
      }
    }
  }
`;


const demoNames = [
"Jazlynn Wilkerson",
"Virginia Rich",
"Monique Hendrix",
"Xzavier Bird",
"Kendal Barnes",
"Yadira Chan",
"Gregory Villarreal",
"Lauryn Donovan",
"Sophia Sexton",
"Simon Navarro",
"Kale Sutton",
"Angelo Campbell",
"Marilyn Bullock",
"Helen Shah",
"Theodore Harmon",
"Jonathon Williamson",
"Josh Kent",
"Jacey Frey",
"Colt Hartman",
"Kenna Gentry",
"Adrian Edwards",
"Yosef Lloyd",
"Madyson Ortiz",
"Slade Jordan",
"Kamron Whitaker",
"Franco Nash",
"Ariella Gamble",
"Deon Bates",
"Jesse Case",
"Jaylon Castaneda",
"Sidney Arellano",
"Kellen Singleton",
"Ana Haney",
"Kadence Flowers",
"Liana Medina",
"Shawn Perez",
"Alayna Dalton",
"Trinity Mcguire",
"Armani Nolan",
"Bailey Sanders",
"Raul Peterson",
"Maria Luna",
"Elliot Norton",
"Jaden Jacobs",
"Darien Parrish",
"Ralph Vang",
"Patience Cameron",
"Case Jacobson",
"Tyshawn Jarvis",
"Anne Walters",
"Paityn Powers",
"Amira Rasmussen",
"Victor Booker",
"Emelia Collier",
"Pablo Carter",
"Ann Velazquez",
"Marin Malone",
"Savanah Fowler",
"Cherish Downs",
"Sylvia Huff",
"Julien Dominguez",
"Laila Petersen",
"Genevieve Hall",
"Braedon Coffey",
"Amiyah Bonilla",
"Amanda Allen",
"Alivia Estes",
"Ciara Francis",
"Dane Richard",
"Jaylen Ferguson",
"Kamari Norris",
"Conrad Cabrera",
"Zechariah Oconnell",
"Killian Graves",
"Curtis Steele",
"Adelyn Huang",
"Kailee Cannon",
"Ronald Clements",
"Darren Price",
"Garrett Mcneil",
"Kingston House",
"Ansley Burke",
"Carissa Chaney",
"Darnell Figueroa",
"Emmalee Cummings",
]

const demoAmounts = [5000, 8000, 10000, 12000, 15000, 17000, 130000, 180000, 20000, 50000]

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


const InvestorStatus = ({ classes, width, dealSlug }) => {

  const { organization: orgSlug } = useParams();
  const location = useLocation();
  const [getInvestments, { data }] = useLazyQuery(GET_INVESTMENTS);

  useEffect(() => {
    getInvestments({ variables: { deal_slug: dealSlug, fund_slug: orgSlug } });
  }, []);

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

  const { investors: viewedInvestors, total: viewedTotal } = getColumnData('invited');
  const { investors: signedInvestors, total: signedTotal } = getColumnData('signed');
  const { investors: wiredInvestors, total: wiredTotal } = getColumnData('wired');

  const demoViewedArray = Array(15).fill('').map(i => {return {accredidation_status: _.sample(demoBool), amount: _.sample(demoAmounts), name: _.sample(demoNames), status: "invited"}})
  const demoSignedArray = Array(15).fill('').map(i => {return {accredidation_status: _.sample(demoBool), amount: _.sample(demoAmounts), name: _.sample(demoNames), status: "signed"}})
  const demoWiredArray = Array(25).fill('').map(i => {return {accredidation_status: _.sample(demoBool), amount: _.sample(demoAmounts), name: _.sample(demoNames), status: "wired"}})
  const isDemo = window?.origin?.includes('vercel') || window?.origin?.includes('localhost')
  console.log(isDemo, window.origin, window.origin.includes('localhost'));

  return (
    <div className={classes.section}>
      <ScrollableBox
        title="VIEWED"
        titleData={<p className={classes.titleDataText}>${nWithCommas(viewedTotal)}</p>}
        autoHeight={true}
        fontSize="small"
        size="third"
        buttonText={true? '' : <div><MailIcon style={{color: "white", marginRight: "0.5em"}}/>Send Reminder</div>}
        >
        {viewedInvestors.map((investor, index) =>
          <InvestorBox investor={investor} classes={classes} index={index} key={`investor-${index}`} width={width}/>
        )}
        {isDemo && demoViewedArray.map((investor, index) =>
          <InvestorBox investor={investor} classes={classes} index={index} key={`demo-investor-${index}`} width={width}/>
        )}
      </ScrollableBox>
      <ScrollableBox
        title="SIGNED"
        titleData={<p className={classes.titleDataText}>${nWithCommas(signedTotal)}</p>}
        autoHeight={true}
        fontSize="small"
        size="third"
        buttonText={true? '' : <div><MailIcon style={{color: "white", marginRight: "0.5em"}}/>Send Reminder</div>}
        >
        {signedInvestors.filter(investor => investor.status === 'signed').map((investor, index) =>
          <InvestorBox investor={investor} classes={classes} index={index} key={`investor-${index}`} width={width}/>
        )}
        {isDemo && demoSignedArray.map((investor, index) =>
          <InvestorBox investor={investor} classes={classes} index={index} key={`demo-investor-${index}`} width={width}/>
        )}
      </ScrollableBox>
      <ScrollableBox
        title="WIRED"
        titleData={<p className={classes.titleDataText}>${nWithCommas(wiredTotal)}</p>}
        autoHeight={true}
        fontSize="small"
        size="third"
        >
        {wiredInvestors.filter(investor => investor.status === 'wired').map((investor, index) =>
          <InvestorBox investor={investor} classes={classes} index={index} key={`investor-${index}`} width={width}/>
        )}
        {isDemo && demoWiredArray.map((investor, index) =>
          <InvestorBox investor={investor} classes={classes} index={index} key={`demo-investor-${index}`} width={width}/>
        )}
      </ScrollableBox>
    </div>
  );
}

export default InvestorStatus;
