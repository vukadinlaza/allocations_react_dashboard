import { useReducer, useEffect, useState } from 'react';

/** *
 *
 * simple helper hooks
 * useSimpleReducer provides this.setState({ [prop]: value })
 * syntax to hooks for state objects
 *
 * */

const reducer = (prev, updatedProp) => ({
  ...prev,
  ...updatedProp,
});

export function useSimpleReducer(init) {
  return useReducer(reducer, init);
}

export function useToggle(init) {
  return useReducer((prev) => !prev, init);
}

export const useFetch = (base, tableName) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!base || !tableName) return;
    const url = `https://api.airtable.com/v0/${base}/${tableName}?api_key=${process.env.REACT_APP_AIRTABLE_API_KEY}`;
    const fetchData = async () => {
      setStatus('fetching');
      const response = await fetch(url);
      const data = await response.json();
      setData(data.records);
      setStatus('fetched');
    };

    fetchData();
  }, [base, tableName]);

  return { status, data };
};
