import React from 'react'
import BN from 'bignumber.js'
import _ from 'lodash'
import { nWithCommas } from '../../utils/numbers'
import { ResponsivePie } from '@nivo/pie'
import randomColor from 'randomcolor'

import { Table, TableBody, TableCell, TableRow, TableHead, Paper, Button, LinearProgress } from '@material-ui/core'

function percentageOfSPV(investment, total) {
  const p = new BN(investment.amount).dividedBy(total).times(100).toFixed(0)
  return p === 0 ? "<1" : p
}

export default function CapitalAccount ({ deal }) {
  const investments = _.orderBy(deal.investments, 'amount', 'desc')
  const totalRaised = _.sumBy(investments, 'amount')
  return (
    <TableRow>
      <TableCell colSpan={7} className="CapitalAccount">
        <Paper className="CapitalAccount-table">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Investor</TableCell>
                <TableCell>Share of SPV</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {investments.map(investment => (
                <TableRow key={investment._id}>
                  <TableCell>{investment.investor.name}</TableCell>
                  <TableCell className="text-right">
                    {percentageOfSPV(investment, totalRaised)}%
                  </TableCell>
                  <TableCell>${nWithCommas(investment.amount)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell><b>${nWithCommas(totalRaised)}</b></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
        <CapitalAccountPie investments={investments} />
      </TableCell>
    </TableRow>
  )
}

function CapitalAccountPie ({ investments }) {
    const colors = randomColor({ count: investments.length, format: "hsl" })
    const data = investments.map((investment, i) => {
      return {
        id: investment.investor.name,
        label: `${investment.investor.name}`,
        value: investment.amount || 0,
        color: colors[i]
      }
    })
    return (
      <div className="CapitalAccount-pie">
        <ResponsivePie
            data={data}
            margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            colors={{ scheme: 'set3' }}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
            enableRadialLabels={false}
            enableSlicesLabels={false}
            animate={false}
            motionStiffness={90}
            motionDamping={15}
            defs={[]}
            fill={[]}
            legends={[]}
        />
      </div>
    )  
}