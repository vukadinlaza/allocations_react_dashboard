import React, { useState } from 'react';
import AllocationsTable from '../../../utils/AllocationsTable';
import Loader from '../../../utils/Loader';

const dummyData = Array.apply(' ', Array(100)).map((_, i) => {
  return {
    number: '00000000',
    available: Math.random() >= 0.5 ? true : false,
  };
});

const getCellContent = (type, row, headerValue) => {
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

const Banking = ({ deal_id }) => {
  return (
    <AllocationsTable
      data={dummyData}
      headers={headers}
      getCellContent={getCellContent}
      sortField="available"
      sortOrder="desc"
    />
  );
};

export default Banking;
