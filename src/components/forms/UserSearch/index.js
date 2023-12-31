import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextField, Table, TableBody, TableCell, TableRow, Paper } from '@material-ui/core';
import * as API from '../../../api';

export default function UserSearch({
  user,
  setUser,
  errors = [],
  label = 'Investor',
  showLabelOnSelect = false,
}) {
  const [q, setQ] = useState('');
  const [records, setRecords] = useState([]);
  const [search, searchRes] = useLazyQuery(API.users.search);

  useEffect(() => {
    search({ variables: { field: 'email', searchTerm: q } });
  }, [q]);

  useEffect(() => {
    if (searchRes.data && searchRes.data.searchUsers) {
      setRecords(q === '' ? [] : searchRes.data.searchUsers);
    }
  }, [searchRes.data]);

  if (user) {
    return (
      <>
        <Table>
          <TableBody>
            <TableRow>
              {showLabelOnSelect && <TableCell>{label}</TableCell>}
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <FontAwesomeIcon
                  icon="times"
                  onClick={() => {
                    setQ('');
                    setUser(null);
                  }}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </>
    );
  }

  return (
    <div className="assoc-search">
      <TextField
        style={{ width: '100%' }}
        required
        value={q}
        error={errors.includes('user')}
        label={label}
        variant="outlined"
        onChange={(e) => setQ(e.target.value)}
      />
      <Paper className="assoc-search-results">
        <Table>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record._id} className="assoc-option" onClick={() => setUser(record)}>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
