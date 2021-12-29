import { Button, Checkbox, FormControlLabel } from '@material-ui/core';
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { nWithCommas } from '../../utils/numbers';
import './style.scss';
import { toast } from 'react-toastify';

const SEND_WIRE_REMINDERS = gql`
  mutation SendWireReminders($investment_ids: [String], $deal_id: String!) {
    sendWireReminders(investment_ids: $investment_ids, deal_id: $deal_id)
  }
`;

function SendWireReminder({ signedInvestors, deal }) {
  const [selectedInvestors, setSelectedInvestors] = useState([
    ...signedInvestors.map((investment) => investment.investmentId),
  ]);
  const [sendWireReminders] = useMutation(SEND_WIRE_REMINDERS, {
    onError: (err) => {
      toast.error(err.message);
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
      <Button className="deselect-all" onClick={deselectAll}>
        Deselect All
      </Button>
    ) : (
      <Button onClick={selectAll}>Select All</Button>
    );
  };

  const InvestorList = () => {
    const investorItems = signedInvestors.map((investor, i) => {
      return (
        <li key={i} className="investor-item">
          <FormControlLabel
            className="investor-label"
            label={investor.name}
            control={
              <Checkbox
                onChange={() => handleCheck(investor)}
                checked={selectedInvestors.includes(investor.investmentId)}
                color="primary"
              />
            }
          />
          <p className="investor-amount">${nWithCommas(investor.amount)}</p>
        </li>
      );
    });

    return <ul className="investor-list">{investorItems}</ul>;
  };

  return (
    <div className="SendWireReminder">
      <div className="container">
        <div className="investors">
          <p className="title">Investors</p>
          <SelectButton />
          <InvestorList />
        </div>

        <div className="message">
          <p className="title">Message</p>
          <img
            src="https://allocations-public.s3.us-east-2.amazonaws.com/WireReminderTemplate.png"
            alt="wire reminder template"
          />
        </div>
      </div>

      <Button className="send-button" onClick={handleSubmit}>
        Send Wire Reminder
      </Button>
    </div>
  );
}

export default SendWireReminder;
