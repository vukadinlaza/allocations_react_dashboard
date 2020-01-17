import React, { useEffect, useState } from 'react'
import * as API from "../../api"
import { useLazyQuery} from '@apollo/react-hooks'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextField, Table, TableBody, TableCell, TableRow, TableHead, Paper, Button } from '@material-ui/core'

export default function UserSearch ({ user, setUser, errors }) {
  const [q, setQ] = useState("")
  const [records, setRecords] = useState([])
  const [search, searchRes] = useLazyQuery(API.users.search)

  useEffect(() => {
    search({ variables: { q } })
  }, [q])

  useEffect(() => {
    if (searchRes.data && searchRes.data.searchUsers) {
      setRecords(q === "" ? [] : searchRes.data.searchUsers)
    } 
  }, [searchRes.data])

  if (user) {
    return (
      <Paper className="assoc-value">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell><FontAwesomeIcon icon="times" onClick={() => { setQ(""); setUser(null) }} /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    )
  }

  return (
    <div className="assoc-search">
      <TextField style={{width: "100%"}}
        required
        value={q}
        error={errors.includes("user")}
        label="Investor"
        variant="filled"
        onChange={e => setQ(e.target.value)} />
      <Paper className="assoc-search-results">
        <Table>
          <TableBody>
            {records.map(record => (
              <TableRow key={record._id} 
                className="assoc-option" 
                onClick={() => setUser(record)}>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  )
}