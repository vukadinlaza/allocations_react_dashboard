import React from 'react';
import { Button } from '@material-ui/core';
import { useQuery, gql } from '@apollo/client';
import AllocationsTable from '../../../utils/AllocationsTable';
import Loader from '../../../utils/Loader';

const dummyData = Array.apply(' ', Array(100)).map((_, i) => {
  return {
    number: '00000000',
    available: Math.random() >= 0.5,
  };
});

const getCellContent = (type, row) => {
  switch (type) {
    case 'number':
      return row.number;
    case 'available':
      return row.available.toString();
    default:
      return <div />;
  }
};

const headers = [
  { value: 'number', label: 'REFERENCE NUMBER', align: 'left', alignHeader: true, type: 'number' },
  { value: 'available', label: 'AVAILABLE', type: 'available', align: 'left', alignHeader: true },
];

const REFERENCE_NUMBERS_BY_DEAL_ID = gql`
  query ReferenceNumbersByDealId($deal_id: String!) {
    referenceNumbersByDealId(deal_id: $deal_id) {
      number
      available
    }
  }
`;

const Banking = ({ classes, deal_id }) => {
  const { data: referenceNumbers, loading } = useQuery(REFERENCE_NUMBERS_BY_DEAL_ID, {
    variables: { deal_id },
  });

  console.log('referenceNumbers', referenceNumbers);
  if (loading)
    return (
      <div>
        <Loader />
      </div>
    );

  if (referenceNumbers && referenceNumbers.length === 0)
    return (
      <Button
        variant="contained"
        onClick={() => {
          console.log('ass', deal_id);
        }}
        className={classes.createButton}
        color="secondary"
        style={{ margin: '1rem', backgroundColor: 'blue' }}
      />
    );

  return (
    <>
      <AllocationsTable
        data={dummyData}
        headers={headers}
        getCellContent={getCellContent}
        sortField="available"
        sortOrder="desc"
      />
    </>
  );
};

export default Banking;
