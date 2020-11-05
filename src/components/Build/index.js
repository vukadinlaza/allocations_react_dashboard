import React, { useEffect, useState } from 'react';
import { useFetch } from '../../utils/hooks';

const BASE = 'appI9kFJSiLbjnGl3';
const TABEL_NAME = 'table%201';
export default () => {
  //   const { loading, error, data } = useQuery(GET_RECORDS, {
  //     variables: { table: 'Marketplace' },
  //   });

  const { status, data } = useFetch(BASE, TABEL_NAME);

  console.log(data);
  return <>BUILD</>;
};
