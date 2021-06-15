import React, { useState } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { nWithCommas } from '../../utils/numbers'

const styles = theme => ({

});


export const DoughnutChart = withStyles(styles)(({ series }) => {

	Chart.plugins.register(ChartDataLabels);

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
					plugins: {
						datalabels: {
							display: true,
							color: 'white',
							labels: {
								title: {
									font: {
										weight: 'bold',
										size: 18,
										family: "'Roboto'"
									}
								}
							},
							formatter: function(value, ctx, els) {
								const total = ctx.dataset?._meta[0]?.total
								return Math.round((value * 100) / total) + '%';
							},
						}
					},
					elements: {
						point: {
							radius: 2
						}
					},
					legend: {
						display: true,
						position: "right",
						labels: {
							fontSize: 18,
							usePointStyle: true,
							pointStyle: "circle",
							boxWidth: 12,
							padding: 20
						}
					},
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


export const LineChart = withStyles(styles)(({ }) => {
	const series = true

	if (!series) {
		return <div></div>
	} else {
		return (
			<Line
				data={{
					labels: ['Jan 2021', 'Feb 2021', 'Mar 2021', 'Apr 2021'],
					datasets: [
						{
							label: 'Dataset',
							data: [700000, 900000, 1600000, 1900000],
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
						xAxes: [

						],
						yAxes: [{
							gridLines: {
								borderDash: [8, 4]
							},
							ticks: {
			          stepSize: 1000000,
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
