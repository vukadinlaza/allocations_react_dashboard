import React, { useState } from 'react';
import _ from 'lodash';
import MailIcon from '@material-ui/icons/Mail';
import { Avatar, Typography, Grid } from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { ScrollableBox } from '../widgets';
import { nWithCommas } from '../../../../utils/numbers';
import Loader from '../../../utils/Loader';
import { phone } from '../../../../utils/helpers';
import AppModal from '../../../Modal/AppModal';
import InvestmentEdit from '../../../InvestmentEdit/UpdateInvestment';
import DeleteViewedUser from '../../../InvestmentEdit/DeleteViewedUser';

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

const demoAmounts = [5000, 8000, 10000, 12000, 15000, 17000, 13000, 18000, 20000, 50000];

const demoBool = [true, false];

const InvestorBox = ({
  classes,
  investor,
  index,
  width,
  superAdmin,
  setShowModal,
  setInvestmentId,
  setDealId,
  setInvestorId,
}) => {
  const onClick = () => {
    if(superAdmin){
      if (investor.investmentId) {
        setInvestmentId(investor.investmentId);
        setShowModal(true);
      }else{
        setDealId(investor.dealId);
        setInvestorId(investor.id);
        setShowModal(true);
      }
    }
  };
  return width > phone ? (
    <div className={classes.investorBox} onClick={onClick} key={`investor-${index}`}>
      <div className={classes.investorBoxName} style={{ display: 'flex' }}>
        <Avatar className={classes.avatar}>{investor.name.charAt(0).toUpperCase()}</Avatar>
        <Typography className={classes.investorName}>{investor.name}</Typography>
        <div className={classes.accredited} style={investor.accredidation_status ? {} : { background: '#bbc5ba' }}>
          <Typography style={{ color: 'white', fontSize: '12px' }}>
            <VerifiedUserIcon /> 506c
          </Typography>
        </div>
      </div>
      {(investor.amount && investor.status !== 'invited') && (
        <Typography style={{ width: '80px', textAlign: 'right' }}>${nWithCommas(investor.amount)}</Typography>
      )}
    </div>
  ) : (
    <div className={classes.investorBox} onClick={onClick} key={`investor-${index}`}>
      <Avatar className={classes.avatar}>{investor.name.charAt(0).toUpperCase()}</Avatar>
      <div className={classes.investorBoxAmount}>
        <Typography className={classes.investorName}>{investor.name}</Typography>
        <div className={classes.accredited} style={investor.accredidation_status ? {} : { background: '#bbc5ba' }}>
          <Typography style={{ color: 'white', fontSize: '12px' }}>
            <VerifiedUserIcon /> 506c
          </Typography>
        </div>
        {(investor.amount && investor.status !== 'invited') && <Typography style={{ textAlign: 'right' }}>${nWithCommas(investor.amount)}</Typography>}
      </div>
    </div>
  );
};

const InvestorStatus = ({ classes, width, data, superAdmin, refetch }) => {
  const [showModal, setShowModal] = useState(false);
  const [investmentId, setInvestmentId] = useState(null);
  const [dealId, setDealId] = useState(null);
  const [investorId, setInvestorId] = useState(null);
  const onClose = () => {
    setShowModal(false);
  };

  const handleUpdate = () => {
    refetch();
    setShowModal(false);
  };

  if (!data?.deal?.investments) {
    return (
      <div className={classes.loaderContainer}>
        <Loader />
      </div>
    );
  }

  const { investments } = data.deal;

  const investors = investments.map((inv) => {
    const firstName = _.get(inv, 'investor.first_name', '');
    const n = _.get(inv, 'investor.name', '');
    const name = inv?.submissionData?.legalName ? inv?.submissionData?.legalName : n || firstName;
    return {
      name,
      amount: inv.amount,
      status: inv.status,
      accredidation_status: inv.investor.accredidation_status,
      id: inv.investor._id,
      investmentId: inv._id,
      dealId: data.deal._id,
    };
  });

  const getColumnData = (status) => {
    const columnInvestors = investors.filter((inv) => inv.status === status);
    let total = 0;
    if (columnInvestors.length) {
      total = columnInvestors.map((inv) => inv.amount).reduce((acc, n) => acc + n);
    }
    return { investors: columnInvestors, total };
  };

  const { investors: viewedInvestors } = getColumnData('invited');
  let { investors: signedInvestors, total: signedTotal } = getColumnData('signed');
  let { investors: wiredInvestors, total: wiredTotal } = getColumnData('wired');

  const demoViewedArray = Array(15)
    .fill('')
    .map(() => {
      return {
        accredidation_status: _.sample(demoBool),
        amount: _.sample(demoAmounts),
        name: _.sample(demoNames),
        status: 'invited',
        id: '60390e16b5675e00231ad607',
        investmentId: false,
        dealId: '5ff493654ed6240023ded5e5',
      };
    });

  const demoSignedArray = Array(15)
    .fill('')
    .map(() => {
      return {
        accredidation_status: _.sample(demoBool),
        amount: _.sample(demoAmounts),
        name: _.sample(demoNames),
        status: 'signed',
      };
    });

  const demoWiredArray = Array(25)
    .fill('')
    .map(() => {
      return {
        accredidation_status: _.sample(demoBool),
        amount: _.sample(demoAmounts),
        name: _.sample(demoNames),
        status: 'wired',
      };
    });


  const isDemo = false;
  if(isDemo){
    signedTotal += demoSignedArray.map((i) => i.amount).reduce((acc, n) => acc + n);
    wiredTotal += demoWiredArray.map((i) => i.amount).reduce((acc, n) => acc + n);
  }
  // const isDemo = window?.origin?.includes('vercel') || window.origin.includes('localhost');


  return (
    <Grid container spacing={3} className={classes.section}>
      <Grid item xs={12} lg={4}>
        <ScrollableBox
          title="VIEWED"
          autoHeight
          fontSize="small"
          size="third"
          buttonText={
            true ? (
              ''
            ) : (
              <div>
                <MailIcon style={{ color: 'white', marginRight: '0.5em' }} />
                Send Reminder
              </div>
            )
          }
        >
          {isDemo? 
            demoViewedArray.map((investor, index) => (
                <InvestorBox
                  investor={investor}
                  classes={classes}
                  index={index}
                  key={`demo-investor-${index}`}
                  width={width}
                  superAdmin={superAdmin}
                  setShowModal={setShowModal}
                  setInvestmentId={setInvestmentId}
                  setDealId={setDealId}
                  setInvestorId={setInvestorId}
                />
              ))
            : viewedInvestors.map((investor, index) => (
                <InvestorBox
                  investor={investor}
                  classes={classes}
                  index={index}
                  key={`investor-${index}`}
                  width={width}
                  superAdmin={superAdmin}
                  setShowModal={setShowModal}
                  setInvestmentId={setInvestmentId}
                  setDealId={setDealId}
                  setInvestorId={setInvestorId}
                />
              ))}
        </ScrollableBox>
      </Grid>
      <Grid item xs={12} lg={4}>
        <ScrollableBox
          title="SIGNED"
          titleData={<p className={classes.titleDataText}>${nWithCommas(signedTotal)}</p>}
          autoHeight
          fontSize="small"
          size="third"
          buttonText={
            true ? (
              ''
            ) : (
              <div>
                <MailIcon style={{ color: 'white', marginRight: '0.5em' }} />
                Send Reminder
              </div>
            )
          }
        >
          {isDemo? 
            demoSignedArray.map((investor, index) => (
                <InvestorBox
                  investor={investor}
                  classes={classes}
                  index={index}
                  key={`demo-investor-${index}`}
                  width={width}
                  superAdmin={superAdmin}
                  setShowModal={setShowModal}
                  setInvestmentId={setInvestmentId}
                  setDealId={setDealId}
                  setInvestorId={setInvestorId}
                />
              ))
            : signedInvestors
                .filter((investor) => investor.status === 'signed')
                .map((investor, index) => (
                  <InvestorBox
                    investor={investor}
                    classes={classes}
                    index={index}
                    key={`investor-${index}`}
                    width={width}
                    superAdmin={superAdmin}
                    setShowModal={setShowModal}
                    setInvestmentId={setInvestmentId}
                    setDealId={setDealId}
                    setInvestorId={setInvestorId}
                  />
                ))}
        </ScrollableBox>
      </Grid>
      <Grid item xs={12} lg={4}>
        <ScrollableBox
          title="WIRED"
          titleData={<p className={classes.titleDataText}>${nWithCommas(wiredTotal)}</p>}
          autoHeight
          fontSize="small"
          size="third"
        >
          {isDemo? 
            demoWiredArray.map((investor, index) => (
                <InvestorBox
                  investor={investor}
                  classes={classes}
                  index={index}
                  key={`demo-investor-${index}`}
                  width={width}
                  superAdmin={superAdmin}
                  setShowModal={setShowModal}
                  setInvestmentId={setInvestmentId}
                  setDealId={setDealId}
                  setInvestorId={setInvestorId}
                />
              ))
            : wiredInvestors
                .filter((investor) => investor.status === 'wired')
                .map((investor, index) => (
                  <InvestorBox
                    investor={investor}
                    classes={classes}
                    index={index}
                    key={`investor-${index}`}
                    width={width}
                    superAdmin={superAdmin}
                    setShowModal={setShowModal}
                    setInvestmentId={setInvestmentId}
                    setDealId={setDealId}
                    setInvestorId={setInvestorId}
                  />
                ))}
        </ScrollableBox>
      </Grid>

      <AppModal isOpen={showModal} onClose={onClose}>
        {investmentId ? (
          <InvestmentEdit investmentId={investmentId} handleUpdate={handleUpdate} />
        ) : (
          <DeleteViewedUser dealId={dealId} investorId={investorId} handleUpdate={handleUpdate} />
        )}
      </AppModal>
    </Grid>
  );
};

export default InvestorStatus;
