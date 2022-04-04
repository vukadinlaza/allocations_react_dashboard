import { Button, Checkbox, FormControlLabel } from '@material-ui/core';
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { toast } from 'react-toastify';
import { nWithCommas } from '../../../utils/numbers';
import styles from '../styles';

const SEND_WIRE_REMINDERS = gql`
  mutation SendWireReminders($investment_ids: [String], $deal_id: String!) {
    sendWireReminders(investment_ids: $investment_ids, deal_id: $deal_id)
  }
`;

function SendWireReminder({ signedInvestors, deal }) {
  const classes = styles();
  const [selectedInvestors, setSelectedInvestors] = useState([
    ...signedInvestors.map((investment) => investment.investmentId),
  ]);
  const [sendWireReminders] = useMutation(SEND_WIRE_REMINDERS, {
    onError: (error) => {
      const errorsLength = error?.graphQLErrors?.length || 0;
      if (
        JSON.stringify(error).includes('Wire reminders already sent today.') &&
        errorsLength === 1
      ) {
        toast.error('Wire reminders were already sent today.');
      } else {
        toast.error(
          'Sorry, something went wrong. Try again or contact support at support@allocations.com',
        );
      }
    },
    onCompleted: () => {
      toast.success('Wire reminders sent.');
    },
  });

  const handleCheck = (investor) => {
    setSelectedInvestors((prev) => {
      if (prev.includes(investor.investmentId)) {
        return [...prev.filter((id) => id !== investor.investmentId)];
      }
      return [...prev, investor.investmentId];
    });
  };

  const selectAll = () => {
    setSelectedInvestors([...signedInvestors.map((investment) => investment.investmentId)]);
  };

  const deselectAll = () => {
    setSelectedInvestors([]);
  };

  const handleSubmit = () => {
    sendWireReminders({
      variables: {
        investment_ids: selectedInvestors,
        deal_id: deal._id,
      },
    });
  };

  const SelectButton = () => {
    return selectedInvestors.length > 0 ? (
      <Button onClick={deselectAll}>Deselect All</Button>
    ) : (
      <Button onClick={selectAll}>Select All</Button>
    );
  };

  const InvestorList = () => {
    const investorItems = signedInvestors.map((investor, i) => {
      return (
        <li key={i} className={classes.investorItem}>
          <FormControlLabel
            className={classes.investorLabel}
            label={investor.name}
            control={
              <Checkbox
                onChange={() => handleCheck(investor)}
                checked={selectedInvestors.includes(investor.investmentId)}
                color="primary"
              />
            }
          />
          <p className={classes.investorAmount}>${nWithCommas(investor.amount)}</p>
        </li>
      );
    });

    return <ul className={classes.investorList}>{investorItems}</ul>;
  };

  return (
    <div className={classes.SendWireReminder}>
      <div className={classes.container}>
        <div className={classes.investors}>
          <p className={classes.title}>Investors</p>
          <SelectButton />
          <InvestorList />
        </div>

        <div className={classes.message}>
          <p className={classes.title}>Message</p>
          <img
            src="https://allocations-public.s3.us-east-2.amazonaws.com/WireReminderTemplate.png"
            alt="wire reminder template"
          />
        </div>
      </div>

      <Button className={classes.sendButton} onClick={handleSubmit}>
        Send Wire Reminder
      </Button>
    </div>
  );
}

export default SendWireReminder;
