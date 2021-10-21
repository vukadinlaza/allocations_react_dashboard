import React, { useState } from 'react';
import styles from '../styles';
import { Button } from '@material-ui/core';
import AllocationsTable from '../../../utils/AllocationsTable';
import Loader from '../../../utils/Loader';

const dummyData = Array.apply(' ', Array(100)).map((_, i) => {
  return {
    number: '00000000',
    available: Math.random() >= 0.5 ? true : false,
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

const Banking = ({ classes, deal_id }) => {
  // const [loaded, setLoaded] = useState(false);
  console.log(styles);
  return (
    <>
      <Button>Allocate Reference Numbers</Button>

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
