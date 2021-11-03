import React, { useState } from 'react';
import { Button, Typography, TextField } from '@material-ui/core';
import { useQuery, gql, useMutation } from '@apollo/client';
import HelpIcon from '@material-ui/icons/Help';
import Loader from '../../../utils/Loader';
import { ModalTooltip } from '../widgets';

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

const UPDATE_DEAL = gql`
  mutation updateDeal($org: String!, $deal: DealInput!) {
    updateDeal(deal: $deal, org: $org) {
      _id
    }
  }
`;

const Banking = ({
  classes,
  deal_id,
  deal_NDvirtualAccountNum,
  handleTooltip,
  openTooltip,
  orgSlug,
}) => {
  const [NDvirtualAccountNum, setNDvirtualAccountNum] = useState('');
  const [hasVirtualAccountNumber, setHasVirtualAccountNumber] = useState(deal_NDvirtualAccountNum);

  const { data, loading, refetch } = useQuery(REFERENCE_NUMBERS_BY_DEAL_ID, {
    variables: { deal_id },
  });

  const [allocateRefNums, { loading: allocateLoading }] = useMutation(ALLOCATE, {
    variables: { deal_id },
    onCompleted: () => {
      refetch();
    },
  });

  const [updateDeal] = useMutation(UPDATE_DEAL, {
    variables: {
      deal: {
        _id: deal_id,
        nd_virtual_account_number: NDvirtualAccountNum,
      },
      org: orgSlug,
    },
    onCompleted: () => {
      refetch();
      setHasVirtualAccountNumber(NDvirtualAccountNum);
    },
  });

  let referenceNumberRange = null;
  if (data && data.referenceNumbersByDealId && data.referenceNumbersByDealId.length > 0) {
    const refNums = [...data.referenceNumbersByDealId].sort(
      (a, b) => Number(a.number) - Number(b.number),
    );
    const low = refNums[0].number;
    const high = refNums[refNums.length - 1].number;
    referenceNumberRange = `${low}-${high}`;
  }

  return (
    <>
      {(loading || allocateLoading) && (
        <div>
          <Loader />
        </div>
      )}
      <div
        style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
        className={classes.bankingAllocateWrapper}
      >
        {!referenceNumberRange && (
          <div
            style={{
              width: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Button
              variant="contained"
              onClick={() => allocateRefNums()}
              className={classes.createButton}
              color="secondary"
              style={{ margin: '1rem 1rem 1rem 0px', backgroundColor: 'blue' }}
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
        )}
        {referenceNumberRange && (
          <>
            <div style={{ display: 'flex' }}>
              <p style={{ marginRight: '1em' }}>ND Reference Number Range</p>
              <p style={{ marginLeft: '1em' }}>{referenceNumberRange}</p>
            </div>
          </>
        )}
        {hasVirtualAccountNumber ? (
          <div style={{ display: 'flex' }}>
            <p style={{ marginRight: '1em' }}>New Directions Virtual Account #</p>
            <p style={{ marginLeft: '1em' }}>{hasVirtualAccountNumber}</p>
          </div>
        ) : (
          <div
            style={{
              width: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TextField
              variant="outlined"
              placeholder="New Directions Virtual Account #"
              value={NDvirtualAccountNum}
              onChange={(event) => setNDvirtualAccountNum(event.target.value)}
              style={{ width: '-webkit-fill-available' }}
            />
            <Button
              variant="contained"
              className={classes.createButton}
              color="secondary"
              style={{ marginLeft: '1rem', backgroundColor: 'blue' }}
              onClick={updateDeal}
            >
              Save
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Banking;
