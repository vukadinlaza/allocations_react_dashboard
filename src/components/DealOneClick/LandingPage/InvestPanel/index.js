import React from 'react';
import { Button } from '@material-ui/core';
import './styles.scss';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../auth/useAuth';

function InvestPanel({ deal, deal_slug, organization }) {
  const { userProfile, isAuthenticated } = useAuth();
  const history = useHistory();

  const handleWaitlistSubmit = async () => {
    await fetch('https://hooks.zapier.com/hooks/catch/7904699/ov0jofs', {
      method: 'post',
      body: JSON.stringify({
        'Deal Name': deal.company_name,
        'User Email': userProfile.email,
        'Deal ID': deal._id,
        'User First Name': userProfile.first_name || 'N/A',
      }),
    });
    return toast.success('Successfully added to the waitlist!');
  };

  const {
    dealParams: { wireDeadline, signDeadline },
    status
  } = deal;

  const getDeadline = (date) => {
    return moment(date).format('dddd, MMMM D YYYY, h:mm a [EST]');
  };

  const isClosed = status === 'closed';

  return (
    <section className="InvestPanel">
      <p className="section-label">One click invest</p>
      <ul>
        <li>
          <p>Signing deadline:</p>
          <h2>
            {signDeadline
              ? getDeadline(signDeadline)
              : wireDeadline
              ? getDeadline(wireDeadline)
              : 'No signing deadline has been set.'}
          </h2>
        </li>
        <li>
          <p>Wire deadline:</p>
          <h2>
            {wireDeadline
              ? getDeadline(wireDeadline)
              : signDeadline
              ? getDeadline(signDeadline)
              : 'No wire deadline has been set.'}
          </h2>
        </li>
      </ul>
      <Button
        onClick={() => {
          if (isClosed && isAuthenticated) {
            return handleWaitlistSubmit();
          }
          history.push(`/invest${organization ? `/${organization}` : ''}/${deal_slug}`);
        }}
      >
        {isClosed ? 'Join Waitlist' : 'Invest'}
      </Button>
    </section>
  );
}

export default InvestPanel;
