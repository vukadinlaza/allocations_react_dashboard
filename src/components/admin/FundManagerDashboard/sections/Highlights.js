import React from 'react';
import Chart from 'react-google-charts';
import { Typography } from '@material-ui/core';
import {
  DoughnutChart,
  LineChart
} from '../../../utils/charts';
import { SimpleBox, ChartBox } from '../widgets'
import 'chartjs-plugin-datalabels';


export function getColor(i) {
  const colors = ["#A6CEE3","#1F78B4","#B2DF8A","#33A02C"]
  let modulo = i % colors.length
  let color = colors[modulo]
  return color
}


export function formatDoughnutSeries(series) {
  return series.map((s, i) => {
    return {
      backgroundColor: getColor(i),
      label: s.label,
      total: s.total
    }
  })
}

const series = [
  {label: 'SpaceX', total: 0.45},
  {label: 'Volumetric SPV', total: 0.3},
  {label: 'Turn Bio', total: 0.20},
  {label: 'Retrotope SPV', total: 0.05},
]


const Highlights = ({ classes }) => {

  return (
    <div className={classes.section}>
      {/*
        <SimpleBox size="half" title="Committed" info="Explanation">Child</SimpleBox>
        <SimpleBox size="half" title="Closed" info="Explanation">Child</SimpleBox>
      */}
      <SimpleBox size="third" title="Portfolio Value" info="Explanation">
        <div className={classes.simpleBoxDataRow} style={{flexDirection: "column", alignItems: "flex-start"}}>
          <Typography style={{fontSize: "26px"}}>$2,094,293</Typography>
          <Typography style={{fontSize: "10px"}}>0% Realized | 100% Unrealized</Typography>
        </div>
      </SimpleBox>
      <SimpleBox size="third" title="Total Invested" info="Explanation">
        <div className={classes.simpleBoxDataRow} style={{flexDirection: "column", alignItems: "flex-start"}}>
          <Typography style={{fontSize: "26px"}}>$339,500</Typography>
          <Typography style={{fontSize: "10px"}}>32 Investments</Typography>
        </div>
      </SimpleBox>
      <SimpleBox size="third" title="Multiple" info="Explanation">
        <div className={classes.simpleBoxDataRow} style={{flexDirection: "column", alignItems: "flex-start"}}>
          <Typography style={{fontSize: "26px"}}>1.00x</Typography>
          <Typography style={{fontSize: "10px"}}>Last Updated: June 1st, 2021</Typography>
        </div>
      </SimpleBox>
      <div className={classes.subSection}>
        <ChartBox title="Portfolio Overview" info="Explanation">
          <DoughnutChart
            series={formatDoughnutSeries(series)}
            />
        </ChartBox>
        <ChartBox title="Value" info="Explanation">
          <LineChart/>
        </ChartBox>
      </div>
    </div>
  );
}

export default Highlights;
