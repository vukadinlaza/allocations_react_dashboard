import React, { useState } from 'react';
import _ from 'lodash';
import MailIcon from '@material-ui/icons/Mail';
import {
  Avatar,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Tooltip,
  Button,
} from '@material-ui/core';
import Select from '@material-ui/core/Select';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { ScrollableBox } from '../../widgets';
import { nWithCommas } from '../../../../../utils/numbers';
import Loader from '../../../../utils/Loader';
import { phone } from '../../../../../utils/helpers';
import AppModal from '../../../../Modal/AppModal';
import InvestmentEdit from '../../../../InvestmentEdit/UpdateInvestment';
import DeleteViewedUser from '../../../../InvestmentEdit/DeleteViewedUser';
import CreateInvestment from '../../../../InvestmentNew/CreateInvestment';
import SendWireReminder from '../../../../InvestmentNew/SendWireReminder';

const InvestorBoxViewed = ({
  classes,
  investor,
  index,
  width,
  superAdmin,
  setShowModal,
  setInvestmentId,
  setDealId,
  setInvestorId,
  dealId,
}) => {
  const onClick = () => {
    if (superAdmin) {
      if (investor.investmentId) {
        setInvestmentId(investor.investmentId);
        setShowModal(true);
      } else {
        setDealId(dealId);
        setInvestorId(investor._id);
        setShowModal(true);
      }
    }
  };

  return width > phone ? (
    <div
      className={classes.investorBox}
      onClick={onClick}
      key={`investor-${index}`}
      style={superAdmin ? { cursor: 'pointer' } : {}}
    >
      <div className={classes.investorBoxName} style={{ display: 'flex' }}>
        <Avatar className={classes.avatar}>{investor?.email.charAt(0).toUpperCase()}</Avatar>
        <Typography className={classes.investorName}>
          {investor?.name || investor?.email}
        </Typography>
        <div />
      </div>
    </div>
  ) : (
    <div
      className={classes.investorBox}
      onClick={onClick}
      key={`investor-${index}`}
      style={superAdmin ? { cursor: 'pointer' } : {}}
    >
      <Avatar className={classes.avatar}>{investor?.email.charAt(0).toUpperCase()}</Avatar>
      <div className={classes.investorBoxAmount}>
        <Typography className={classes.investorName}>
          {investor?.name || investor?.email}
        </Typography>
        <div />
      </div>
    </div>
  );
};

const InvestorBox = ({
  classes,
  investor,
  index,
  width,
  superAdmin,
  setShowModal,
  setInvestmentId,
  dealType,
}) => {
  const onClick = () => {
    if (superAdmin) {
      if (investor.investmentId) {
        setInvestmentId(investor.investmentId);
        setShowModal(true);
      }
    }
  };

  return width > phone ? (
    <div
      className={classes.investorBox}
      onClick={onClick}
      key={`investor-${index}`}
      style={superAdmin ? { cursor: 'pointer' } : {}}
    >
      <div className={classes.investorBoxName} style={{ display: 'flex' }}>
        <Avatar className={classes.avatar}>{investor.name.charAt(0).toUpperCase()}</Avatar>
        <Typography className={classes.investorName}>{investor.name}</Typography>
        {dealType === '506c' ? (
          <div
            className={classes.accredited}
            style={investor.accredidation_status ? {} : { background: '#bbc5ba' }}
          >
            <Tooltip
              title={
                investor.accredidation_status
                  ? 'This investor is accredited for 506c deals'
                  : 'This investor is not accredited for 506c deals'
              }
            >
              <Typography style={{ color: 'white', fontSize: '12px' }}>
                <VerifiedUserIcon /> 506c
              </Typography>
            </Tooltip>
          </div>
        ) : (
          ''
        )}
      </div>
      {investor.amount && investor.status !== 'invited' ? (
        <Typography style={{ width: '80px', textAlign: 'right' }}>
          ${nWithCommas(investor.amount)}
        </Typography>
      ) : (
        ''
      )}
    </div>
  ) : (
    <div
      className={classes.investorBox}
      onClick={onClick}
      key={`investor-${index}`}
      style={superAdmin ? { cursor: 'pointer' } : {}}
    >
      <Avatar className={classes.avatar}>{investor.name.charAt(0).toUpperCase()}</Avatar>
      <div className={classes.investorBoxAmount}>
        <Typography className={classes.investorName}>{investor.name}</Typography>
        {investor.accredidation_status ? (
          <div className={classes.accredited}>
            <Typography style={{ color: 'white', fontSize: '12px' }}>
              <VerifiedUserIcon /> 506c
            </Typography>
          </div>
        ) : (
          ''
        )}
        {investor.amount && investor.status !== 'invited' ? (
          <Typography style={{ textAlign: 'left', width: '100%' }}>
            ${nWithCommas(investor.amount)}
          </Typography>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

const InvestorStatus = ({ classes, width, data, superAdmin, refetch, dealType }) => {
  const [showModal, setShowModal] = useState(false);
  const [showCreateInvModal, setShowCreateInvModal] = useState(false);
  const [investmentId, setInvestmentId] = useState(null);
  const [dealId, setDealId] = useState(null);
  const [investorId, setInvestorId] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [reminderModalOpen, setReminderModalOpen] = useState(false);

  const onClose = () => {
    setInvestmentId(null);
    setDealId(null);
    setInvestorId(null);
    setShowModal(false);
  };

  const handleUpdate = {
    refetch: () => refetch(),
    closeModal: () => setShowModal(false),
    setShowCreateInvModal: () => setShowCreateInvModal(false),
  };

  if (!data?.deal?.investments) {
    return (
      <div className={classes.loaderContainer}>
        <Loader />
      </div>
    );
  }

  const { investments } = data.deal;

  const viewedUsers = data?.deal?.viewedUsers || [];

  const investors = investments
    .filter((inv) => inv?.investor?._id)
    .map((inv) => {
      const firstName = _.get(inv, 'investor.first_name', '');
      const n = _.get(inv, 'investor.name', '');
      const name = inv?.submissionData?.legalName ? inv?.submissionData?.legalName : n || firstName;
      const timestamp = inv._id.toString().substring(0, 8);
      const date = new Date(parseInt(timestamp, 16) * 1000);

      return {
        name,
        amount:
          inv.capitalWiredAmount !== null && inv.capitalWiredAmount
            ? inv.capitalWiredAmount
            : inv.amount,
        status: inv.status,
        accredidation_status: inv.investor.accredidation_status,
        id: inv.investor._id,
        investmentId: inv._id,
        dealId: data.deal._id,
        date,
      };
    });

  const sortBy = (investors) => {
    return investors.sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return -1;
      }
      if (a[sortField] > b[sortField]) {
        return 1;
      }
      return 0;
    });
  };

  const getColumnData = (status) => {
    let columnInvestors = investors.filter((inv) => inv.status === status);
    let total = 0;
    if (columnInvestors.length) {
      // For deals that support capitalWiredAmount, we should look for capitalWiredAmount on wired investments, for old deals we just rely on the wired status and use amount
      total = Math.round(
        columnInvestors
          .map((inv) =>
            ['wired', 'completed'].includes(status)
              ? inv.capitalWiredAmount || inv.amount
              : inv.amount,
          )
          .reduce((acc, n) => {
            return acc + n;
          }),
      );
    }

    if (sortField) {
      columnInvestors = sortBy(columnInvestors);
    }

    return { investors: columnInvestors, total };
  };

  const { investors: viewedInvestors } = getColumnData('invited');
  const { investors: signedInvestors, total: signedTotal } = getColumnData('signed');
  let { investors: wiredInvestors, total: wiredTotal } = getColumnData('wired');
  const { investors: completedInvestors, total: completedTotal } = getColumnData('complete');
  wiredInvestors = [...wiredInvestors, ...completedInvestors];
  wiredTotal += completedTotal;

  const handleSort = (event) => {
    setSortField(event.target.value);
  };

  return (
    <>
      <div className={classes.sortField}>
        {superAdmin ? (
          <Button variant="contained" color="primary" onClick={() => setShowCreateInvModal(true)}>
            {' '}
            Create Investment
          </Button>
        ) : (
          <> </>
        )}
        <FormControl variant="outlined" size="small" value={sortField}>
          <InputLabel id="sort-label">Sort By:</InputLabel>
          <Select native onChange={handleSort} labelId="sort-label">
            <option value="name">Name</option>
            <option value="amount">Amount</option>
            <option value="date">Date Added</option>
          </Select>
        </FormControl>
      </div>
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
            {viewedInvestors.map((investor, index) => (
              <InvestorBox
                investor={investor}
                classes={classes}
                index={index}
                key={`investor-${index}`}
                width={width}
                superAdmin={superAdmin}
                setShowModal={setShowModal}
                setInvestmentId={setInvestmentId}
                dealType={dealType}
              />
            ))}

            {viewedUsers.map((investor, index) => {
              return (
                <InvestorBoxViewed
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
                  dealId={data?.deal?._id}
                  dealType={dealType}
                />
              );
            })}
          </ScrollableBox>
        </Grid>
        <Grid item xs={12} lg={4}>
          <ScrollableBox
            title="SIGNED"
            titleData={<p className={classes.titleDataText}>${nWithCommas(signedTotal)}</p>}
            autoHeight
            fontSize="small"
            size="third"
            className={classes.scrollBox}
            buttonAction={() => setReminderModalOpen((open) => !open)}
            buttonText={
              !superAdmin ? (
                ''
              ) : (
                <div>
                  <MailIcon style={{ color: 'white', marginRight: '0.5em' }} />
                  Send Wire Reminder
                </div>
              )
            }
          >
            {signedInvestors.map((investor, index) => (
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
                dealType={dealType}
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
            {wiredInvestors.map((investor, index) => (
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
                dealType={dealType}
              />
            ))}
          </ScrollableBox>
        </Grid>

        <AppModal isOpen={showModal} onClose={onClose} maxWidth="md">
          {investmentId ? (
            <InvestmentEdit
              investmentId={investmentId}
              investorId={investorId}
              handleUpdate={handleUpdate}
            />
          ) : (
            <DeleteViewedUser dealId={dealId} investorId={investorId} handleUpdate={handleUpdate} />
          )}
        </AppModal>
        <AppModal
          isOpen={showCreateInvModal}
          onClose={() => setShowCreateInvModal(false)}
          maxWidth="md"
        >
          <CreateInvestment deal={data.deal} handleUpdate={handleUpdate} />
        </AppModal>
        <AppModal
          maxWidth="md"
          modalHeader="Send Wire Reminder"
          isOpen={reminderModalOpen}
          onClose={() => setReminderModalOpen(false)}
        >
          <SendWireReminder signedInvestors={signedInvestors} deal={data} />
        </AppModal>
      </Grid>
    </>
  );
};

export default InvestorStatus;
