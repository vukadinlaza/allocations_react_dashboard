import React, { useEffect, useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import _, { toLower } from 'lodash';
import moment from 'moment'
import { Typography } from '@material-ui/core';
import {
  DefaultChartTable,
  DoughnutChart,
  LineChart
} from '../../../utils/charts';
import { SimpleBox, ChartBox } from '../widgets'
import { nWithCommas } from '../../../../utils/numbers';
import { useFetch } from '../../../../utils/hooks';
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


const Highlights = ({ classes, data, dealData, openTooltip, handleTooltip, dealInvestments }) => {

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


  if(!data) return <Loader/>

  let series = data.map(s => { return {label: s['Investment'], total: s['Invested'] } }).sort((a, b) => nestedSort(a, b, 'total', 'desc'))
  let seriesTotal = series.length? series.map(s => s.total).reduce((acc, n) => acc + n) : 0
  let steppedChartData = getSteppedChartData()
  let dealMultiple = _.toNumber(dealData?.dealParams?.dealMultiple || 1)
  const investments = dealInvestments?.deal?.investments?.length && dealInvestments.deal.investments;
  const totalRaised = investments?.map(i => i.amount).reduce((acc, n) => acc + n) || 0;

  return (
    <div className={classes.section}>
      {/*status === "fetching"?
        <div style={{position: "absolute", width: "100%", height: "100%"}}>
          <div className={classes.loaderContainer}>
            <Loader/>
          </div>
        </div>
        : ''
      */}
      <SimpleBox
        size="fourth"
        title="Total Raised"
        openTooltip={openTooltip}
        handleTooltip={handleTooltip}
        id="portfolioValue"
        tooltipContent={<Typography color="inherit" >This is the total capital raised and wired into the fund</Typography>}
        >
        <div className={classes.simpleBoxDataRow} style={{flexDirection: "column", alignItems: "flex-start"}}>
          <Typography style={{fontSize: "26px"}}>
            ${nWithCommas(totalRaised)}
          </Typography>
        </div>
      </SimpleBox>
      <SimpleBox
        size="fourth"
        title="Portfolio Value"
        openTooltip={openTooltip}
        handleTooltip={handleTooltip}
        id="portfolioValue"
        tooltipContent={<Typography color="inherit" >This is the estimated value of the portfolio</Typography>}
        >
        <div className={classes.simpleBoxDataRow} style={{flexDirection: "column", alignItems: "flex-start"}}>
          <Typography style={{fontSize: "26px"}}>
            ${nWithCommas((_.sumBy(data, 'Invested') * (dealMultiple === 0 ? 1 : dealMultiple)).toFixed(0))}
          </Typography>
          <Typography className={classes.footerData}>0% Realized | 100% Unrealized</Typography>
        </div>
      </SimpleBox>
      <SimpleBox
        size="fourth"
        title="Total Invested"
        openTooltip={openTooltip}
        handleTooltip={handleTooltip}
        id="totalInvested"
        tooltipContent={<Typography color="inherit" >This is the total amount invested on the platform</Typography>}
        >
        <div className={classes.simpleBoxDataRow} style={{flexDirection: "column", alignItems: "flex-start"}}>
          <Typography style={{fontSize: "26px"}}>
            ${nWithCommas(_.sumBy(data, 'Invested').toFixed(0))}
          </Typography>
          <Typography className={classes.footerData}>
            {(data || []).length} Total Investments
          </Typography>
        </div>
      </SimpleBox>
      <SimpleBox
        size="fourth"
        title="Multiple"
        openTooltip={openTooltip}
        handleTooltip={handleTooltip}
        id="multiple"
        tooltipContent={<Typography color="inherit" >This is the estimated multiple IRR based on estimate data inputted by the fund manager. Subject to change and not to be relied upon.</Typography>}
        >
        <div className={classes.simpleBoxDataRow} style={{flexDirection: "column", alignItems: "flex-start"}}>
          <Typography style={{fontSize: "26px"}}>
            {dealMultiple.toFixed(2) || 1}x
          </Typography>
          <Typography className={classes.footerData}>Last Updated: June 1st, 2021</Typography>
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
              secondColumnHeader="USD"
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
