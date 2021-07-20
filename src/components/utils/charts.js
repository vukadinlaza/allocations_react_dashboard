import React, { useState } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Tooltip from '@material-ui/core/Tooltip';
import { nWithCommas } from '../../utils/numbers';
import { titleCase, phone } from '../../utils/helpers';
import { useViewport } from '../../utils/hooks'


const styles = theme => ({
	dataTable: {
		height: '250px',
		width: '100%',
		position: 'relative',
		overflowY: 'hidden',
		overflowX: 'hidden',
		display: 'flex',
		flexDirection: 'column',
	},
	header: {
		position: 'sticky',
		top: '0',
		backgroundColor: 'white',
		color: theme.palette.text.secondary
	},
	rowColor: {
		borderRadius: '100%',
		width: '10px',
		height: '10px',
		marginRight: '10px',
		alignSelf: 'center',
	},
	secondColumnHeader: {
		position: 'sticky',
		top: '0',
		backgroundColor: 'white',
		paddingRight: '15px',
		textAlign: 'right',
		justifyContent: 'flex-end',
		color: theme.palette.text.secondary
	},
	seriesAmount: {
		paddingRight: '15px',
		width:'35%',
		justifyContent: 'flex-end',
		color: '#0040FE',
		fontWeight: 'bold'
	},
	seriesLabel: {
		width: '100%',
		display: 'block',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		paddingRight: "0.5em"
	},
	seriesTotal: {
		position: 'sticky',
		top: 0,
		backgroundColor: "white",
		borderTop: "1px solid rgba(0, 0, 0, 0.1)"
	},
	sLabel: {
		width: '90%',
		display: 'block',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	sTotal: {
		paddingRight: '15px',
		width:'35%',
		justifyContent: 'flex-end'
	},
	tableBody: {
		maxHeight: '190px',
		maxWidth: '100%',
		overflowY: 'scroll',
		flexDirection: 'column',
		'& tr': {
			borderBottom: `solid 1px rgba(0, 0, 0, 0.1)`,
			minHeight: '40px'
		},
		'&::-webkit-scrollbar':{
			display: 'none'
		}
	}
});


 export const DefaultChartTable = withStyles(styles)(({
	classes,
	series,
	title,
	secondColumnHeader,
	sumLabel,
	seriesTotal,
	firstColumnToolTip, //JSX
	secondColumnToolTip, //JSX
	seriesLabelKey, //String
}) => {

	if(!series){
		return <div></div>
	}else{
		return(
				<table className={classes.dataTable}>
					<thead style={{width: '100%'}}>
						<tr>
							<th className={classes.header}>{title}</th>
							<th className={classes.secondColumnHeader}>{secondColumnHeader}</th>
						</tr>
					</thead>
					<tbody className={classes.tableBody}>
						<tr className={classes.seriesTotal}>
							<td align="left" style={{width: '65%', minWidth: "65%"}}>
								<div className={classes.seriesLabel}>
									{sumLabel}
								</div>
							</td>
							<td align="right" className={classes.seriesAmount}>
								${nWithCommas(Math.floor(seriesTotal))}
							</td>
						</tr>
					{series.map((s, i) => (
						<tr key={`series_${i}`}>
							{!!firstColumnToolTip?
								<Tooltip title={<React.Fragment>{firstColumnToolTip(s)}</React.Fragment>}>
									<td align="left" style={{width: '65%', minWidth: "65%"}}>
										<div style={{backgroundColor: s.borderColor? s.borderColor : s.backgroundColor}} className={classes.rowColor}/>
										<div className={classes.sLabel}>
											{s[seriesLabelKey] && titleCase(s[seriesLabelKey].replace(/_/g, ' '))}
										</div>
									</td>
								</Tooltip>
								:
								<td align="left" style={{width: '65%', minWidth: "65%"}}>
									<div style={{backgroundColor: s.backgroundColor}} className={classes.rowColor}/>
									<div className={classes.sLabel}>
										{s[seriesLabelKey] && titleCase(s[seriesLabelKey].replace(/_/g, ' '))}
									</div>
								</td>

							}
							{!!secondColumnToolTip?
								<Tooltip title={<React.Fragment><p>{!!secondColumnToolTip && secondColumnToolTip(s)}</p></React.Fragment>}>
									<td align="right" className={classes.sTotal}>
										{nWithCommas(s.total)}
									</td>
								</Tooltip>
								:
								<td align="right" className={classes.sTotal}>
									${nWithCommas(s.total)}
								</td>
							}
					</tr>
					))}
				</tbody>
			</table>
		)
	}
})


export const DoughnutChart = withStyles(styles)(({ series }) => {

	Chart.plugins.register(ChartDataLabels);

	const { width } = useViewport();

	let legendOptions = {
		display: false,
		position: "right",
		labels: {
			fontSize: 18,
			usePointStyle: true,
			pointStyle: "circle",
			boxWidth: 12,
			padding: 20
		}
	}

	let dataLabels = {
		title: {
			font: {
				weight: 'bold',
				size: 18,
				family: "'Roboto'"
			}
		}
	}

	const setFontSizes = (chart) => {
		chart.legend.options.labels.fontSize = 12
		chart.options.plugins.datalabels.labels.title.font.size = 12
		chart.update()
	}

	if(width < phone) {
		legendOptions.labels.fontSize = 12;
		dataLabels.title.font.size = 12
	}

	if (!series) {
		return <div></div>
	} else {
		return (
			<Doughnut
				data={{
					labels: series.map(s => s.label),
					datasets: [{
						backgroundColor: series.map(s => s.backgroundColor),
						data: series.map(s => s.total)
					}] || []
				}}
				options={{
					responsive: true,
					onResize: (chart, size) => {
						if(size.height < 250){
							setFontSizes(chart, size)
						}
					},
					plugins: {
						datalabels: {
							display: true,
							color: 'white',
							labels: dataLabels,
							formatter: function(value, ctx, els) {
								const chartId = ctx.chart?.id
								const total = ctx.dataset?._meta[chartId]?.total;
								const percentage = Math.round((value * 100) / total)
								if(percentage >= 5) return percentage + '%';
								return ''
							},
						}
					},
					elements: {
						point: {
							radius: 2
						}
					},
					legend: legendOptions,
					tooltips: {
						enabled: true
					},
					responsive: true,
					maintainAspectRatio: false,
					cutoutPercentage: 65,
				}}
			/>
		)
	}
})



export const LineChart = withStyles(styles)(({ dataset: { data, labels } }) => {

	const getMaxValue = () => {
		let max = 200000;
		let dataMaxValue = data[data.length - 1];
		if(dataMaxValue < 10000) return 10000
		while(max < dataMaxValue){
			max += 200000
		}
		return max
	}

	const maxValue = getMaxValue()

	if (!data) {
		return <div></div>
	} else {
		return (
			<Line
				data={{
					labels: labels,
					datasets: [
						{
							label: 'Dataset',
							data: data,
							borderColor: '#0461FF',
							backgroundColor: 'rgba(4, 97, 255, 0.2)',
							fill: true,
							steppedLine: true
						}
					]
				}}
				options={{
					interaction: {
						intersect: false,
						axis: 'x'
					},
					plugins: {
						textInside: false,
						datalabels: {
							display: false
						}
					},
					spanGaps: true,
					legend: {
						display: false
					},
					elements: {
						point: {
							radius: 0 //delete points
						}
					},
					responsive: true,
					maintainAspectRatio: false,
					scales: {
						xAxes: [{
							position: 'right',
							ticks: {

							},
							scaleBeginAtZero : false,
							beginAtZero: false
						}],
						yAxes: [{
							gridLines: {
								borderDash: [8, 4]
							},
							ticks: {
			          stepSize: maxValue/5,
								max: maxValue,
								callback: function(val, index) {
			            return nWithCommas(val);
			          },
			        }
						}],
					}
				}}
			/>
		)
	}
})
