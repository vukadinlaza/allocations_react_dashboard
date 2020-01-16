import React from "react"
import { Table, TableBody, TableCell, TableRow, TableHead, Paper } from '@material-ui/core'

const data = {
  funds: [
    {
      name: "Goldmount Holdings",
      series_name: "I",
      deal_name: "Dreamliners",
      location: "offshore",
      date_created: "11/1/2019",
      formation_certificate: true,
      fund_document: false,
      bank_account: false,
      manager: {
        email: "sam@advanifamilyoffice.com"
      }
    },
    {
      name: "Helios Holdings Management",
      series_name: "I",
      deal_name: "OrbitFab",
      location: "USA",
      date_created: "11/1/2019",
      formation_certificate: true,
      fund_document: true,
      bank_account: true,
      manager: {
        email: "ryan@helioscapital.us"
      }
    },
    {
      name: "Sharding Holdings Management LLC",
      series_name: "I",
      deal_name: "Oncosenx",
      location: "USA",
      date_created: "10/1/2019",
      formation_certificate: true,
      fund_document: true,
      bank_account: true,
      manager: {
        email: "kadvani1@gmail.com"
      }
    }
  ]
}

function DocsIcon ({ done }) {
  return done ? "✅" : "⌛"
}

export default function Funds () {
  const funds = data.funds
  return (
    <Paper className="table-wrapper">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Manager</TableCell>
            <TableCell>Fund</TableCell>
            <TableCell>Series Name</TableCell>
            <TableCell>Deal Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Date Created</TableCell>
            <TableCell>Formation Cert</TableCell>
            <TableCell>Fund Document</TableCell>
            <TableCell>Bank Account</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {funds.map(fund => (
            <TableRow key={fund.name}>
              <TableCell>{fund.manager.email}</TableCell>
              <TableCell scope="row">{fund.name}</TableCell>
              <TableCell>{fund.series_name}</TableCell>
              <TableCell scope="row">{fund.deal_name}</TableCell>
              <TableCell>{fund.location}</TableCell>
              <TableCell>{fund.date_created}</TableCell>
              <TableCell><DocsIcon done={fund.formation_certificate} /></TableCell>
              <TableCell><DocsIcon done={fund.fund_document} /></TableCell>
              <TableCell><DocsIcon done={fund.bank_account} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}