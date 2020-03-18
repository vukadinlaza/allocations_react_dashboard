import React, { useEffect, useState } from 'react'
import * as API from "../../api"
import { useParams } from 'react-router-dom'
import { useLazyQuery} from '@apollo/react-hooks'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextField, Table, TableBody, TableCell, TableRow, Paper } from '@material-ui/core'

export default function DealSearch ({ deal, setDeal, errors = [], label = "Deal" }) {
  const { organization: org } = useParams()
  const [q, setQ] = useState("")
  const [records, setRecords] = useState([])
  const [search, searchRes] = useLazyQuery(API.deals.searchByOrg)

  useEffect(() => {
    search({ variables: { q, org } })
  }, [q])

  useEffect(() => {
    if (searchRes.data && searchRes.data.searchDealsByOrg) {
      setRecords(q === "" ? [] : searchRes.data.searchDealsByOrg)
    }
  }, [searchRes.data])

  if (deal) {
    return (
      <Paper className="assoc-value">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>{deal.company_name}</TableCell>
              <TableCell>{deal.company_description}</TableCell>
              <TableCell><FontAwesomeIcon icon="times" onClick={() => { setQ(""); setDeal(null) }} /></TableCell>
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
        error={errors.includes("deal")}
        label={label}
        variant="filled"
        onChange={e => setQ(e.target.value)} />
      <Paper className="assoc-search-results">
        <Table>
          <TableBody>
            {records.map(record => (
              <TableRow key={record._id} 
                className="assoc-option" 
                onClick={() => setDeal(record)}>
                <TableCell>{record.company_name}</TableCell>
                <TableCell>{record.company_description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  )
}