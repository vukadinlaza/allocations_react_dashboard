import React, { useEffect } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import EditIcon from '@material-ui/icons/Edit';
import moment from 'moment';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { pick, get } from 'lodash';
import { nWithCommas } from '../../../../utils/numbers';
import './styles.scss';

const GET_INVESTOR = gql`
  query GetInvestor($deal_id: String!, $_id: String) {
    investor(_id: $_id) {
      _id
      name
      dealInvestments(deal_id: $deal_id) {
        _id
        status
        amount
        submissionData {
          country
          state
          legalName
          fullName
          investor_type
          accredited_investor_type
        }
      }
    }
  }
`;

function InvestmentHistory({ deal, setInvestor, investor, setAmount }) {
  const { data } = useQuery(GET_INVESTOR, {
    variables: {
      deal_id: deal._id,
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (data?.investor?.dealInvestments !== null && (data?.investor?.dealInvestments || []).length > 0) {
      const firstInv = get(data, 'investor.dealInvestments[0]');
      if (firstInv) {
        setInvestor({
          ...investor,
          ...pick(firstInv?.submissionData, [
            'fullName',
            'legalName',
            'country',
            'state',
            'investor_type',
            'accredited_investor_status',
          ]),
          investmentId: firstInv?._id,
        });
        setAmount(firstInv?.amount);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const investments = data?.investor?.dealInvestments.map((inv) => {
    const timestamp = inv._id.toString().substring(0, 8);
    const date = new Date(parseInt(timestamp, 16) * 1000);
    const addedDate = moment(date).format('DD/MM/YY');
    return (
      <Button
        className="invButton"
        style={{ border: investor?.investmentId === inv._id ? 'solid 2px #3AC522' : '' }}
        onClick={() => {
          setInvestor({
            ...investor,
            ...pick(inv?.submissionData, [
              'fullName',
              'legalName',
              'country',
              'state',
              'investor_type',
              'accredited_investor_status',
            ]),
            investmentId: inv?._id,
          });
          setAmount(inv?.amount);
        }}
      >
        <div>
          <div className="itemHeader">Date</div>
          <div>{addedDate}</div>
        </div>
        <div>
          <div className="itemHeader">Entity</div>
          <div>{inv?.submissionData?.legalName || inv?.submissionData?.fullName || data?.investor.name}</div>
        </div>
        <div>
          <div className="itemHeader">Amount</div>
          <div>${nWithCommas(inv.amount)}.00</div>
        </div>
        <EditIcon style={{ color: investor?.investmentId === inv._id ? '#3AC522' : 'grey' }} />
      </Button>
    );
  });
  return (
    <section className="InvestmentHistoryPanel">
      <p className="section-label">My Investment History</p>
      {investments}
      <Button
        style={{ border: !investor?.investmentId ? 'solid 2px #3AC522' : '' }}
        className="addNewbtn"
        onClick={() =>
          setInvestor({
            country: '',
            country_search: '',
            state: '',
            state_search: '',
          })
        }
      >
        <AddCircleIcon style={{ color: !investor?.investmentId ? '#3AC522' : 'grey' }} />
        <Typography>Add a new investment</Typography>
      </Button>
    </section>
  );
}

export default InvestmentHistory;
