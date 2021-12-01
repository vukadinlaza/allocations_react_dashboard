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

export const useFetch = (base, tableName, filter) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!base || !tableName) return;

    let url = `https://api.airtable.com/v0/${base}/${tableName}`;
    if (filter) url += `?filterByFormula=${filter}`;

    const fetchData = async () => {
      setStatus('fetching');
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
        },
      });
      const res = await response.json();
      setData(res.records);
      setStatus('fetched');
    };
    fetchData();
  }, [base, tableName, filter]);

  // Differentiate an Airtable reponse with no results, from an invalid query
  if (!base || !tableName) return { status, data: null };

  return { status, data };
};

export const usePostAirtable = (base, tableName, inputData) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState([]);
  useEffect(() => {
    const postData = async () => {
      const payload = {
        records: [
          {
            fields: inputData,
          },
        ],
      };
      setStatus('fetching');
      const response = await fetch(`https://api.airtable.com/v0/${base}/${tableName}`, {
        method: 'post', // make sure it is a "POST request"
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`, // API key
          'Content-Type': 'application/json', // we will recive a json object
        },
      });
      const data = response.json();
      setData(data.records);
      setStatus('fetched');
    };
    postData();
  }, [base, inputData, tableName]);
  return { status, data };
};

export const useFetchWithEmail = (base, tableName, email) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!base || !tableName) return;
    const url = `https://api.airtable.com/v0/${base}/${tableName}?api_key=${process.env.REACT_APP_AIRTABLE_API_KEY}&filterByFormula={Email}="${email}"`;
    const fetchData = async () => {
      setStatus('fetching');
      const response = await fetch(url);
      const data = await response.json();
      setData(data.records);
      setStatus('fetched');
    };

    fetchData();
  }, [base, email, tableName]);

  return { status, data };
};

// PURPOSE: getting height and width of viewport for responsive frontend
export const useViewport = () => {
  const [width, setWidth] = useState(window.innerWidth);
  // Add a second state variable "height" and default it to the current window height
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleWindowResize = () => {
      setWidth(window.innerWidth);
      // Set the height in state as well as the width
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  // Return both the height and width
  return { width, height };
};
