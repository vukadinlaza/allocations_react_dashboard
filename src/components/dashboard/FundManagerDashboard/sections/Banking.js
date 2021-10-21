import React from 'react';
import { Button } from '@material-ui/core';
import { useQuery, gql, useMutation } from '@apollo/client';
import AllocationsTable from '../../../utils/AllocationsTable';
import Loader from '../../../utils/Loader';

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

const ALLOCATE = gql`
  mutation Allocate($deal_id: String!) {
    referenceNumbersAllocate(deal_id: $deal_id) {
      _id
    }
  }
`;

const Banking = ({ classes, deal_id }) => {
  const { data, loading, refetch } = useQuery(REFERENCE_NUMBERS_BY_DEAL_ID, {
    variables: { deal_id },
  });
  const [allocateRefNums, { loading: allocateLoading }] = useMutation(ALLOCATE, {
    variables: { deal_id },
    onCompleted: () => {
      refetch();
    },
  });

  if (loading || allocateLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  if (data && data.referenceNumbersByDealId && data.referenceNumbersByDealId.length === 0)
    return (
      <Button
        variant="contained"
        onClick={() => allocateRefNums()}
        className={classes.createButton}
        color="secondary"
        style={{ margin: '1rem', backgroundColor: 'blue' }}
      >
        Allocate Reference Numbers
      </Button>
    );

  return (
    <>
      <AllocationsTable
        data={data.referenceNumbersByDealId}
        headers={headers}
        getCellContent={getCellContent}
        sortField="available"
        sortOrder="desc"
      />
    </>
  );
};

export default Banking;
