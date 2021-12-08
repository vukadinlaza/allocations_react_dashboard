import React from 'react';
import BN from 'bignumber.js';
import _ from 'lodash';
import { ResponsivePie } from '@nivo/pie';
import randomColor from 'randomcolor';

import { Table, TableBody, TableCell, TableRow, TableHead, Paper } from '@material-ui/core';
import { nWithCommas } from '../../utils/numbers';

function percentageOfSPV(investment, total) {
  return new BN(investment.amount).dividedBy(total).times(100).toFixed(2);
}

// eslint-disable-next-line no-unused-vars
export default function CapitalAccount({ deal, investments, totalRaised, useInvestingAs }) {
  return (
    <TableRow>
      <TableCell colSpan={7} className="CapitalAccount">
        <Paper className="CapitalAccount-table">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Investor</TableCell>
                <TableCell>Share of SPV</TableCell>
                <TableCell>Investment Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {investments.map((investment) => (
                <TableRow key={investment._id}>
                  <TableCell>
                    {useInvestingAs
                      ? investment?.investor?.investingAs
                      : investment?.investor?.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {percentageOfSPV(investment, totalRaised)}%
                  </TableCell>
                  <TableCell className="text-center">${nWithCommas(investment.amount)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell />
                <TableCell className="text-center">
                  <b>Total</b>
                </TableCell>
                <TableCell className="text-center">
                  <b>${nWithCommas(_.sumBy(investments, 'amount'))}</b>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
        <CapitalAccountPie investments={investments} />
      </TableCell>
    </TableRow>
  );
}

function CapitalAccountPie({ investments }) {
  const colors = randomColor({ count: investments.length, format: 'hsl' });
  const data = investments.map((investment, i) => {
    return {
      id: investment?.investor?.name,
      label: `${investment?.investor?.name}`,
      value: investment.amount || 0,
      color: colors[i],
    };
  });
  return (
    <div className="CapitalAccount-pie">
      <ResponsivePie
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ scheme: 'set3' }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
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
  );
}
