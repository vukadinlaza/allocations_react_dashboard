import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { useQuery, gql, useMutation } from '@apollo/client';
import HelpIcon from '@material-ui/icons/Help';
import AllocationsTable from '../../../utils/AllocationsTable';
import Loader from '../../../utils/Loader';
import { ModalTooltip } from '../widgets';

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

const Banking = ({ classes, deal_id, handleTooltip, openTooltip }) => {
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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          variant="contained"
          onClick={() => allocateRefNums()}
          className={classes.createButton}
          color="secondary"
          style={{ margin: '1rem', backgroundColor: 'blue' }}
        >
          Allocate New Direction Reference Numbers
        </Button>
        <ModalTooltip
          title="Allocate New Direction Reference Numbers"
          handleTooltip={handleTooltip}
          openTooltip={openTooltip}
          tooltipContent={
            <Typography color="inherit">
              This button will allocate 100 New Direction Banking numbers to be used for
              investments.
            </Typography>
          }
          id="reference_numbers"
        >
          <HelpIcon
            style={{
              marginLeft: '0.2em',
              cursor: 'pointer',
              color: '#205DF5',
              fontSize: '22px',
            }}
            onClick={() => handleTooltip('reference_numbers')}
          />
        </ModalTooltip>
      </div>
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
