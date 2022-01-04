import React, { useEffect, useState } from 'react';
import Loader from '../../utils/Loader';
import InvestorEditForm from '../InvestorEdit';

/** *
 *
 * investor profile / edit
 *
 * */

export default function EditInvestor({ data, refetch }) {
  const [investor, setInvestor] = useState(null);
  const [formStatus, setFormStatus] = useState('edit');

  useEffect(() => {
    if (data) {
      setInvestor(data);
    }
  }, [data]);

  useEffect(() => {
    if (formStatus === 'complete') refetch();
  }, [formStatus]);

  const icon =
    formStatus === 'loading' ? 'circle-notch' : formStatus === 'complete' ? 'check' : null;

  if (!data.email)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <InvestorEditForm
      investor={investor}
      icon={icon}
      refetch={refetch}
      setInvestor={setInvestor}
      setFormStatus={setFormStatus}
      actionText="Save Profile"
    />
  );
}
