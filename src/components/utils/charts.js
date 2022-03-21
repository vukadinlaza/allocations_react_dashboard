import React from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import { withStyles } from '@material-ui/core/styles';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { nWithCommas, titleCase } from '@allocations/nextjs-common';
import { phone } from '../../utils/helpers';
import { useViewport } from '../../utils/hooks';

const styles = (theme) => ({
  dataTable: {
    height: '250px',
    width: '100%',
    position: 'relative',
    overflowY: 'hidden',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    '& *': {
      fontSize: '0.875rem',
    },
  },
  header: {
    position: 'sticky',
    top: '0',
    backgroundColor: 'white',
    color: theme.palette.text.secondary,
  },
  rowColor: {
    borderRadius: '100%',
    width: '15px',
    height: '15px',
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
    color: theme.palette.text.secondary,
  },
  seriesAmount: {
    paddingRight: '15px',
    width: '35%',
    justifyContent: 'flex-end',
    color: '#0040FE',
    fontWeight: 'bold',
  },
  seriesLabel: {
    width: '100%',
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingRight: '0.5em',
  },
  seriesTotal: {
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  },
  sLabel: {
    width: '90%',
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '16px',
  },
  sTotal: {
    paddingRight: '15px',
    width: '35%',
    justifyContent: 'flex-end',
  },
  tableBody: {
    maxHeight: '100%',
    maxWidth: '100%',
    overflowY: 'scroll',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    paddingTop: '30px',
    '& tr': {
      // borderBottom: `solid 1px rgba(0, 0, 0, 0.1)`,
      minHeight: '40px',
    },
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
});

export const DefaultChartTable = withStyles(styles)(
  ({
    classes,
    series,
    seriesLabelKey, // String
  }) => {
    if (!series) {
      return <div />;
    }
    return (
      <table className={classes.dataTable}>
        <tbody className={classes.tableBody}>
          {series.map((s, i) => (
            <tr key={`series_${i}`}>
              <td
                align="left"
                style={{
                  width: '100%',
                  minWidth: '65%',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  marginBottom: '10px',
                }}
              >
                <div style={{ backgroundColor: s.backgroundColor }} className={classes.rowColor} />
                <div className={classes.sLabel}>
                  {s[seriesLabelKey] && titleCase(s[seriesLabelKey].replace(/_/g, ' '))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
);

export const DoughnutChart = withStyles(styles)(({ series }) => {
  const addAlpha = (color, opacity) => {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
  };

  const getGradient = (context, canvas, color) => {
    const { height, width } = context.chart;
    const centerX = Math.floor(width / 2);
    const centerY = height / 2;
    const { ctx } = context.chart;
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, centerY * 1.6);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.4, color);
    gradient.addColorStop(0.5, addAlpha(color, 0.8));
    gradient.addColorStop(0.7, color);
    gradient.addColorStop(1, color);
    return gradient;
  };
  const doughnutData = (canvas) => {
    return {
      labels: series.map((s) => s.label),
      datasets:
        [
          {
            backgroundColor: (context) =>
              series.map((s) => getGradient(context, canvas, s.backgroundColor)),
            data: series.map((s) => s.total),
          },
        ] || [],
    };
  };

  Chart.plugins.register(ChartDataLabels);

  const { width } = useViewport();

  const legendOptions = {
    display: false,
    position: 'right',
    labels: {
      fontSize: 18,
      usePointStyle: true,
      pointStyle: 'circle',
      boxWidth: 12,
      padding: 20,
    },
  };

  const dataLabels = {
    title: {
      font: {
        weight: 'bold',
        size: 18,
        family: "'Roboto'",
      },
    },
  };

  const setFontSizes = (chart) => {
    chart.legend.options.labels.fontSize = 12;
    chart.options.plugins.datalabels.labels.title.font.size = 12;
    chart.update();
  };

  if (width < phone) {
    legendOptions.labels.fontSize = 12;
    dataLabels.title.font.size = 12;
  }

  if (!series) {
    return <div />;
  }
  return (
    <Doughnut
      data={doughnutData}
      options={{
        responsive: true,
        onResize: (chart, size) => {
          if (size.height < 250) {
            setFontSizes(chart, size);
          }
        },
        plugins: {
          datalabels: {
            display: false,
            color: 'white',
            labels: dataLabels,
            formatter(value, ctx) {
              const chartId = ctx.chart?.id;
              const total = ctx.dataset?._meta[chartId]?.total;
              const percentage = Math.round((value * 100) / total);
              if (percentage >= 5) return `${percentage}%`;
              return '';
            },
          },
        },
        elements: {
          point: {
            radius: 2,
          },
          arc: {
            borderWidth: 0,
          },
        },
        legend: legendOptions,
        tooltips: {
          enabled: true,
          callbacks: {
            title(tooltipItem, data) {
              return `$${nWithCommas(Math.round(data.datasets[0].data[tooltipItem[0].index]))}`;
            },
            label(tooltipItem, data) {
              return data.labels[tooltipItem.index];
            },
          },
          backgroundColor: '#FFF',
          titleFontSize: 16,
          titleFontColor: '#2A2B54',
          bodyFontColor: '#94A3B8',
        },
        maintainAspectRatio: false,
        cutoutPercentage: 55,
      }}
    />
  );
});

export const LineChart = withStyles(styles)(({ dataset: { data, labels } }) => {
  const lineChartPlugin = {
    afterDraw(chart) {
      if (chart.tooltip._active && chart.tooltip._active.length) {
        const activePoint = chart.controller.tooltip._active[0];
        const { ctx } = chart;
        const { x, y } = activePoint.tooltipPosition();
        // const topY = chart.scales['y-axis-0'].top;
        const bottomY = chart.scales['y-axis-0'].bottom;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, bottomY);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#0461FF';
        ctx.setLineDash([3]);
        ctx.stroke();
        ctx.restore();
      }
    },
  };

  const lineData = (canvas) => {
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 400, 400);
    gradient.addColorStop(0, 'rgba(4, 97, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(4, 97, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0');
    return {
      labels,
      datasets: [
        {
          label: 'Dataset',
          data,
          borderColor: '#0461FF',
          backgroundColor: gradient,
          fill: true,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#0461FF',
        },
      ],
    };
  };
  const getMaxValue = () => {
    let max = 200000;
    const dataMaxValue = data[data.length - 1];
    if (dataMaxValue < 10000) return 10000;
    while (max < dataMaxValue) {
      max += 200000;
    }
    return max + 0.25 * max;
  };

  const maxValue = getMaxValue();

  if (!data) {
    return <div />;
  }
  return (
    <Line
      data={lineData}
      plugins={[lineChartPlugin]}
      options={{
        interaction: {
          intersect: false,
          axis: 'x',
        },
        plugins: {
          textInside: false,
          datalabels: {
            display: false,
          },
        },
        spanGaps: true,
        legend: {
          display: false,
        },
        elements: {
          point: {
            radius: 0, // delete points
          },
        },
        responsive: true,
        tooltips: {
          callbacks: {
            title(tooltipItem, data) {
              return `$${nWithCommas(Math.round(data.datasets[0].data[tooltipItem[0].index]))}`;
            },
            label(tooltipItem, data) {
              return data.labels[tooltipItem.index];
            },
          },
          backgroundColor: '#FFF',
          titleFontSize: 16,
          titleFontColor: '#2A2B54',
          bodyFontColor: '#94A3B8',
          bodyFontSize: 14,
          displayColors: false,
          mode: 'index',
          intersect: false,
          yAlign: 'bottom',
          xAlign: 'center',
          caretPadding: 20,
          xPadding: 2,
          yPadding: 2,
          // borderColor: '#e3e7f1',
          borderWidth: 1,
        },
        hover: {
          mode: 'index',
          intersect: false,
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              position: 'right',
              ticks: {},
              scaleBeginAtZero: false,
              beginAtZero: false,
              gridLines: {
                borderDash: [8, 4],
                color: 'rgba(0, 0, 0, 0)',
                drawBorder: false,
                display: false,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                borderDash: [8, 4],
                color: 'rgba(0, 0, 0, 0)',
                drawBorder: false,
                display: false,
              },
              ticks: {
                display: false,
                stepSize: maxValue / 5,
                max: maxValue,
                callback(val) {
                  return nWithCommas(val);
                },
              },
            },
          ],
        },
      }}
    />
  );
});
