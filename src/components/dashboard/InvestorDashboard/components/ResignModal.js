import React, { useState, useEffect } from 'react';
import { Button, Grid } from '@material-ui/core';
import { useLazyQuery, useMutation, gql } from '@apollo/client';
import { toast } from 'react-toastify';
import { getClientIp } from '../../../../utils/ip';
import { nWithCommas } from '../../../../utils/numbers';
import personalInfoValidation from '../../../../utils/validation';
import AppModal from '../../../Modal/AppModal';
import PersonalInformation from '../../../DealOneClick/InvestmentPage/PersonalInformation';
import InvestmentAmountPanel from '../../../DealOneClick/InvestmentPage/InvestmentAmount';

const GET_INVESTMENT = gql`
  query GetInvestment($_id: String!) {
    investment(_id: $_id) {
      _id
      status
      amount
      submissionData {
        country
        state
        legalName
        fullName
        investor_type
        accredited_investor_status
        title
      }
      deal {
        _id
        docSpringTemplateId
        organization {
          name
        }
        dealParams {
          is3c7
        }
      }
    }
  }
`;

const CONFIRM_INVESTMENT = gql`
  mutation ConfirmInvestment($payload: Object) {
    confirmInvestment(payload: $payload) {
      _id
    }
  }
`;

const ResignModal = ({ showResignModal, setShowResignModal, refetch }) => {
  const [investor, setInvestor] = useState({
    country: '',
    country_search: '',
    state: '',
    state_search: '',
  });
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState([]);

  const [getInvestment, { data, called }] = useLazyQuery(GET_INVESTMENT);
  const [submitConfirmation] = useMutation(CONFIRM_INVESTMENT, {
    onCompleted: () => {
      toast.success('Success! Investment updated');
      setShowResignModal(false);
      refetch();
    },
    onError: () => {
      toast.error('Sorry, Something went wrong. Try again or contact support@allocations.com');
    },
  });

  useEffect(() => {
    if (showResignModal._id) {
      getInvestment({
        variables: {
          _id: showResignModal?._id,
        },
      });
    }
  }, [showResignModal._id, getInvestment]);

  useEffect(() => {
    if (called && data) {
      setInvestor((prev) => ({
        ...prev,
        ...data?.investment?.submissionData,
        country_search: data?.investment?.submissionData.country,
        state_search: data?.investment?.submissionData.state,
        title: data?.investment?.submissionData.title || '',
      }));
      setAmount(data?.investment?.amount);
    }
  }, [called, data]);

  const organization = data?.investment?.deal?.organization?.name.toLowerCase();

  const submitInvestment = async () => {
    const validation = personalInfoValidation(
      investor,
      organization,
      {},
      data?.investment?.deal.docSpringTemplateId,
      data?.investment?.deal?.dealParams?.is3c7,
    );
    setErrors(validation);
    if (validation.length > 0) {
      return toast.warning('Please complete the form before continuing');
    }
    const ip = await getClientIp();
    const payload = {
      ...investor,
      investmentAmount: nWithCommas(amount),
      investmentId: data?.investment?._id,
      clientIp: ip,
      dealId: data?.investment?.deal?._id,
      docSpringTemplateId: data?.investment?.deal.docSpringTemplateId,
    };

    submitConfirmation({ variables: { payload } });
    toast.warn('Loading. We are confirming your changes.');
    setShowResignModal(false);
  };

  return (
    <AppModal
      isOpen={Boolean(showResignModal)}
      onClose={() => setShowResignModal(false)}
      maxWidth="md"
    >
      <Grid container direction="column" alignItems="center">
        <InvestmentAmountPanel amount={amount} setAmount={setAmount} isFromModal />
        <PersonalInformation
          org={organization}
          errors={errors}
          investor={investor}
          is3c7={data?.investment?.deal?.dealParams?.is3c7}
          setInvestor={setInvestor}
          isFromModal
        />

        <Button variant="contained" color="secondary" onClick={submitInvestment}>
          Update
        </Button>
      </Grid>
    </AppModal>
  );
};

export default ResignModal;
