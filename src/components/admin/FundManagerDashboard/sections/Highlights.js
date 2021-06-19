import React, { useEffect, useState } from 'react';
import _, { isNumber } from 'lodash';
import moment from 'moment'
import { Typography } from '@material-ui/core';
import {
  DefaultChartTable,
  DoughnutChart,
  LineChart
} from '../../../utils/charts';
import { SimpleBox, ChartBox } from '../widgets'
import { nWithCommas } from '../../../../utils/numbers';
import { nestedSort } from '../../../../utils/helpers';
import Loader from '../../../utils/Loader';
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

// const series = [
//   {label: 'SpaceX', total: 0.45},
//   {label: 'Volumetric SPV', total: 0.3},
//   {label: 'Turn Bio', total: 0.20},
//   {label: 'Retrotope SPV', total: 0.05},
// ]


const Highlights = ({ classes, data, orgData, isDemo }) => {

  const [multipleAvg, setMultipleAvg] = useState(1);

  useEffect(() => {
    if(orgData) getMultipleAvg()
  }, [orgData])

  const getMultipleAvg = () => {
    if(isDemo){
      setMultipleAvg(3);
    }else{
      const dealsMultiples = orgData?.deals.map(deal => _.toNumber(deal?.dealParams?.dealMultiple || 1))
      const multiplesSum = _.sum(dealsMultiples);
      const dealsLength = (dealsMultiples.length === 0 ? 1 : dealsMultiples.length)
      const multipleAvg = multiplesSum/dealsLength;

      setMultipleAvg(multipleAvg);
    }
  }

  if(!orgData) return <Loader/>

  const setMonthsToShow = (data) => {
    let monthsArray = [];

    data.forEach(item => {
      let itemMonth = moment(item['Date']).format('YYYYMM');
      if(!monthsArray.includes(itemMonth)) monthsArray.push(itemMonth);
    })
    monthsArray.sort()

    return monthsArray
  }

  const setLabelsAndData = (data, monthsArray) => {
    let labels = [];
    let chartData = []

    data.forEach(item => {
      let itemMonth = moment(item['Date']).format('YYYYMM');
      let monthsIndex = monthsArray.indexOf(itemMonth);
      let itemLabel = moment(item['Date']).format('MMM YYYY');
      let itemAmount = item['Invested'];
      if(labels.includes(itemLabel)){
        chartData[monthsIndex] += itemAmount
      }else{
        labels[monthsIndex] = itemLabel;
        chartData[monthsIndex] = itemAmount
      }
    })
    let nextMonth = moment(monthsArray[monthsArray.length - 1]).add(1, 'month').format('MMM YYYY')

    labels.push(nextMonth)
    chartData.push(0)

    return { labels, chartData }
  }

  const getSteppedChartData = () => {
    const monthsArray = setMonthsToShow(data)
    const { labels, chartData } = setLabelsAndData(data, monthsArray)
    let accAmount = 0;

    let steppedData = chartData.map((item, i) => {
      accAmount += item;
      return accAmount
    })
    let steppedChartData = { labels, data: steppedData };
    return steppedChartData;
  }

  let series = data.map(s => { return {label: s['Investment'], total: s['Invested'] } }).sort((a, b) => nestedSort(a, b, 'total', 'desc'))
  let seriesTotal = series.map(s => s.total).reduce((acc, n) => acc + n)
  let steppedChartData = getSteppedChartData()

  return (
    <div className={classes.section}>
      {/*
        <SimpleBox size="half" title="Committed" info="Explanation">Child</SimpleBox>
        <SimpleBox size="half" title="Closed" info="Explanation">Child</SimpleBox>
      */}
      <SimpleBox size="third" title="Portfolio Value" info="Explanation">
        <div className={classes.simpleBoxDataRow} style={{flexDirection: "column", alignItems: "flex-start"}}>
          <Typography style={{fontSize: "26px"}}>
            ${nWithCommas((_.sumBy(data, 'Invested') * (multipleAvg === 0 ? 1 : multipleAvg)).toFixed(0))}
          </Typography>
          <Typography style={{fontSize: "10px"}}>0% Realized | 100% Unrealized</Typography>
        </div>
      </SimpleBox>
      <SimpleBox size="third" title="Total Invested" info="Explanation">
        <div className={classes.simpleBoxDataRow} style={{flexDirection: "column", alignItems: "flex-start"}}>
          <Typography style={{fontSize: "26px"}}>
            ${nWithCommas(_.sumBy(data, 'Invested').toFixed(0))}
          </Typography>
          <Typography style={{fontSize: "10px"}}>
            {(data || []).length} Total Investments
          </Typography>
        </div>
      </SimpleBox>
      <SimpleBox size="third" title="Multiple" info="Explanation">
        <div className={classes.simpleBoxDataRow} style={{flexDirection: "column", alignItems: "flex-start"}}>
          <Typography style={{fontSize: "26px"}}>
            {multipleAvg.toFixed(2) || 1}x
          </Typography>
          <Typography style={{fontSize: "10px"}}>Last Updated: June 1st, 2021</Typography>
        </div>
      </SimpleBox>
      <div className={classes.subSection}>
        <ChartBox title="Portfolio Overview" info="Explanation">
          <div className={classes.chartContainer}>
            <DoughnutChart
              series={formatDoughnutSeries(series)}
              />
          </div>
          <div className={classes.tableContainer}>
            <DefaultChartTable
              series={formatDoughnutSeries(series)}
              title="Investments"
              secondColumnHeader="$us"
              sumLabel="Total"
              seriesTotal={seriesTotal}
              seriesLabelKey="label"
              />
          </div>
        </ChartBox>
        <ChartBox title="Value" info="Explanation">
          <LineChart
            dataset={steppedChartData}
            />
        </ChartBox>
      </div>
    </div>
  );
}

export default Highlights;
