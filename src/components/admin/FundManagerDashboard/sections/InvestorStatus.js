import React, { useEffect } from 'react';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useLazyQuery } from '@apollo/react-hooks';
import MailIcon from '@material-ui/icons/Mail';
import { Avatar, Typography } from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { ScrollableBox } from '../widgets';
import { nWithCommas } from '../../../../utils/numbers'
import Loader from '../../../utils/Loader'


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
        }
      }
    }
  }
`;


const InvestorBox = ({classes, investor, index}) => {
  return(
    <div className={classes.investorBox} key={`investor-${index}`}>
      <div className={classes.investorBoxName}>
        <Avatar className={classes.avatar}>{investor.name.charAt(0).toUpperCase()}</Avatar>
        <Typography style={{fontSize: "14px"}}>{investor.name}</Typography>
        <div className={classes.investorCheck}>
          <Typography style={{color: "white", fontSize: "8px"}}><VerifiedUserIcon/> 506c</Typography>
        </div>
      </div>
      <Typography>${nWithCommas(investor.amount)}</Typography>
    </div>
  )
}


const InvestorStatus = ({ classes, buttonAction }) => {

  const { deal: dealSlug, organization: orgSlug } = useParams();
  const [getInvestments, { data, error }] = useLazyQuery(GET_INVESTMENTS);

  useEffect(() => {
    getInvestments({ variables: { deal_slug: dealSlug, fund_slug: orgSlug } });
  }, []);

  if(!data?.deal?.investments){
    return <Loader/>
  }


  const { investments } = data.deal;
  const investors = investments.map(inv => {
    const firstName = _.get(inv, 'investor.first_name', '');
    const n = _.get(inv, 'investor.name', '');
    let name = inv?.submissionData?.legalName ? inv?.submissionData?.legalName : (n? n : firstName);
    return {
      name,
      amount: inv.amount,
      status: inv.status
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


  return (
    <div className={classes.section}>
      <ScrollableBox
        title="VIEWED"
        titleData={<p className={classes.titleDataText}>${nWithCommas(viewedTotal)}</p>}
        autoHeight={true}
        fontSize="small"
        size="third"
        buttonText={true? '' : <div><MailIcon style={{color: "white", marginRight: "0.5em"}}/>Send Reminder</div>}
        buttonAction={buttonAction}
        >
        {viewedInvestors.map((investor, index) =>
          <InvestorBox investor={investor} classes={classes} index={index} key={`investor-${index}`} />
        )}
      </ScrollableBox>
      <ScrollableBox
        title="SIGNED"
        titleData={<p className={classes.titleDataText}>${nWithCommas(signedTotal)}</p>}
        autoHeight={true}
        fontSize="small"
        size="third"
        buttonText={true? '' : <div><MailIcon style={{color: "white", marginRight: "0.5em"}}/>Send Reminder</div>}
        buttonAction={buttonAction}
        >
        {signedInvestors.filter(investor => investor.status === 'signed').map((investor, index) =>
          <InvestorBox investor={investor} classes={classes} index={index} />
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
          <InvestorBox investor={investor} classes={classes} index={index} />
        )}
      </ScrollableBox>
    </div>
  );
}

export default InvestorStatus;
